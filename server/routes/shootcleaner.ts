import { Router, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { pool } from '../db';
import { getS3Client, getS3Config, buildPublicUrl } from '../services/s3-storage';

const router = Router();

function getConfiguredApiKey(): string {
  return (process.env.SHOOTCLEANER_API_KEY || '').trim();
}

/**
 * The key the caller presented, by any of the names the integration is documented under.
 *
 * x-togninja-api-key IS THE DOCUMENTED HEADER and was not read. Every ShootCleaner handoff
 * states the transport as
 *
 *     x-togninja-api-key: <studio key>     # x-naf-api-key still accepted from older builds
 *
 * and this accepted neither — only x-api-key and a Bearer token. Anything written from the
 * specification 401'd on every endpoint, reporting "Invalid API key", which reads as a wrong
 * credential rather than an unread header.
 *
 * All four are accepted rather than switching: x-api-key and Bearer are what the shipped client
 * sends today, so dropping them would break the integration in the act of documenting it.
 *
 * Ported from the product line (AxixOS/togninja v1.9.242), where this was found by calling
 * /health exactly as the handoff's own worked example does.
 */
function getPresentedApiKey(req: Request): string {
  const named = ['x-togninja-api-key', 'x-naf-api-key', 'x-api-key'];
  for (const name of named) {
    const v = (req.headers[name] as string) || '';
    if (v.trim()) return v.trim();
  }

  const authHeader = (req.headers.authorization || '').trim();
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return '';
}

function requireShootCleanerApiKey(req: Request, res: Response, next: NextFunction) {
  const expectedApiKey = getConfiguredApiKey();
  if (!expectedApiKey) {
    return res.status(503).json({
      error: 'ShootCleaner integration is not configured',
      code: 'shootcleaner_not_configured',
    });
  }

  const presentedApiKey = getPresentedApiKey(req);
  if (!presentedApiKey || presentedApiKey !== expectedApiKey) {
    return res.status(401).json({
      error: 'Invalid API key',
      code: 'invalid_api_key',
    });
  }

  next();
}

function getBaseUrl(req: Request): string {
  const forwardedProto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = req.get('host') || 'newagefotografie.com';
  return `${forwardedProto}://${host}`;
}

function buildB2Url(key: string): string | null {
  const bucket = (process.env.AWS_S3_BUCKET || '').trim();
  const endpoint = (process.env.AWS_S3_ENDPOINT || '').trim();
  if (!bucket || !endpoint) {
    return null;
  }

  const encodedKey = key.split('/').map((part) => encodeURIComponent(part)).join('/');
  if (endpoint.includes('backblazeb2.com')) {
    return `https://${bucket}.${endpoint.replace('https://', '').replace(/\/$/, '')}/${encodedKey}`;
  }

  return `${endpoint.replace(/\/$/, '')}/${bucket}/${encodedKey}`;
}

// ---------------------------------------------------------------------------
// Write API (Export to Galleries / Export to Cloud)
// ---------------------------------------------------------------------------

const READ_SCOPES = ['galleries:read', 'gallery-images:read', 'digital-files:read', 'clients:read', 'questionnaires:read', 'studio:read', 'portfolio:read'];
const WRITE_SCOPES = ['galleries:write', 'gallery-images:write', 'digital-files:write', 'portfolio:write'];
const ALL_SCOPES = [...READ_SCOPES, ...WRITE_SCOPES];

const MAX_FILES_PER_CALL = 100;
const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200 MB
const PRESIGN_TTL_SECONDS = 15 * 60; // 15 minutes
const DEFAULT_EXPORT_FOLDER = 'ShootCleaner Exports';

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
  'image/tiff', 'image/heic', 'image/heif', 'image/avif',
]);
const ALLOWED_FILE_TYPES = new Set([
  ...ALLOWED_IMAGE_TYPES,
  'application/pdf', 'application/zip', 'video/mp4', 'video/quicktime',
]);

// Write endpoints require the key AND the matching *:write scope. v1 issues a
// single key that holds every scope; structured so a separate write-scoped key
// can be added later without changing the routes.
function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const expectedApiKey = getConfiguredApiKey();
    if (!expectedApiKey) {
      return res.status(503).json({ error: 'ShootCleaner integration is not configured', code: 'shootcleaner_not_configured' });
    }
    const presentedApiKey = getPresentedApiKey(req);
    if (!presentedApiKey || presentedApiKey !== expectedApiKey) {
      return res.status(401).json({ error: 'Invalid API key', code: 'invalid_api_key' });
    }
    if (!ALL_SCOPES.includes(scope)) {
      return res.status(403).json({ error: `Missing required scope: ${scope}`, code: 'insufficient_scope' });
    }
    next();
  };
}

// --- Idempotency: map a ShootCleaner externalRef -> the entity it created -----
let exportSchemaReady: Promise<void> | null = null;
function ensureExportSchema(): Promise<void> {
  if (!exportSchemaReady) {
    exportSchemaReady = pool
      .query(`
        CREATE TABLE IF NOT EXISTS shootcleaner_exports (
          external_ref text PRIMARY KEY,
          entity_type  text NOT NULL,
          entity_id    text NOT NULL,
          created_at   timestamptz DEFAULT now()
        )
      `)
      .then(() => undefined)
      .catch((err) => { exportSchemaReady = null; throw err; });
  }
  return exportSchemaReady;
}

async function lookupExternalRef(ref: string): Promise<{ entityType: string; entityId: string } | null> {
  if (!ref) return null;
  await ensureExportSchema();
  const result = await pool.query('SELECT entity_type, entity_id FROM shootcleaner_exports WHERE external_ref = $1 LIMIT 1', [ref]);
  const row = result.rows[0];
  return row ? { entityType: row.entity_type, entityId: row.entity_id } : null;
}

async function recordExternalRef(ref: string, entityType: string, entityId: string): Promise<void> {
  if (!ref) return;
  await ensureExportSchema();
  await pool.query(
    'INSERT INTO shootcleaner_exports (external_ref, entity_type, entity_id) VALUES ($1, $2, $3) ON CONFLICT (external_ref) DO NOTHING',
    [ref, entityType, entityId],
  );
}

// --- Helpers ------------------------------------------------------------------
function sanitizeFilename(name: string): string {
  return String(name || '').replace(/[^a-zA-Z0-9.\-]/g, '_');
}

function slugify(input: string): string {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function ensureUniqueSlug(base: string): Promise<string> {
  const seed = base || 'gallery';
  let candidate = seed;
  let n = 1;
  // Bounded in practice; the slug column is unique.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const r = await pool.query('SELECT 1 FROM galleries WHERE slug = $1 LIMIT 1', [candidate]);
    if (!r.rows[0]) return candidate;
    n += 1;
    candidate = `${seed}-${n}`;
  }
}

type FileValidationError = { status: number; error: string; code: string };
function validateFileList(files: any, allowed: Set<string>): FileValidationError | null {
  if (!Array.isArray(files) || files.length === 0) {
    return { status: 400, error: 'files[] is required', code: 'invalid_request' };
  }
  if (files.length > MAX_FILES_PER_CALL) {
    return { status: 400, error: `Maximum ${MAX_FILES_PER_CALL} files per call`, code: 'too_many_files' };
  }
  for (const f of files) {
    const contentType = String(f?.contentType || '').toLowerCase();
    if (!contentType || !allowed.has(contentType)) {
      return { status: 400, error: `Unsupported content type: ${f?.contentType ?? 'none'}`, code: 'invalid_content_type' };
    }
    const size = Number(f?.sizeBytes ?? f?.fileSize ?? 0);
    if (size && size > MAX_FILE_BYTES) {
      return { status: 413, error: `File exceeds the ${MAX_FILE_BYTES}-byte limit`, code: 'file_too_large' };
    }
  }
  return null;
}

async function presignPut(key: string, contentType: string): Promise<string> {
  const { bucket } = getS3Config();
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  return getSignedUrl(getS3Client(), command, { expiresIn: PRESIGN_TTL_SECONDS });
}

function presignExpiry(): string {
  return new Date(Date.now() + PRESIGN_TTL_SECONDS * 1000).toISOString();
}

async function clientExists(clientId: string): Promise<boolean> {
  const r = await pool.query('SELECT 1 FROM crm_clients WHERE id::text = $1 LIMIT 1', [clientId]);
  return !!r.rows[0];
}

async function fetchGalleryById(id: string, req: Request): Promise<any | null> {
  const r = await pool.query(
    `
      SELECT
        g.id, g.title, g.slug, g.description, g.cover_image,
        g.is_public, g.is_password_protected, g.client_id,
        g.created_at, g.updated_at,
        COALESCE(COUNT(gi.id), 0)::int AS image_count
      FROM galleries g
      LEFT JOIN gallery_images gi ON gi.gallery_id = g.id
      WHERE g.id = $1
      GROUP BY g.id
    `,
    [id],
  );
  const row = r.rows[0];
  if (!row) return null;
  const baseUrl = getBaseUrl(req);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    coverImageUrl: row.cover_image,
    isPublic: row.is_public,
    isPasswordProtected: row.is_password_protected,
    clientId: row.client_id,
    imageCount: row.image_count,
    galleryUrl: `${baseUrl}/gallery/${row.slug}`,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchGalleryImageById(imageId: string): Promise<any | null> {
  const r = await pool.query(
    `
      SELECT
        gi.id, gi.gallery_id AS "galleryId",
        g.slug AS "gallerySlug", g.title AS "galleryTitle",
        gi.filename, gi.url, gi.title, gi.description,
        gi.sort_order AS "sortOrder", gi.size_bytes AS "sizeBytes",
        gi.content_type AS "contentType", gi.created_at AS "createdAt"
      FROM gallery_images gi
      INNER JOIN galleries g ON g.id = gi.gallery_id
      WHERE gi.id = $1
    `,
    [imageId],
  );
  return r.rows[0] || null;
}

function mapDigitalFileRow(row: any, req: Request): any {
  const baseUrl = getBaseUrl(req);
  const fileExt = path.extname(row.file_name || '');
  const folder = row.folder_name || DEFAULT_EXPORT_FOLDER;
  const storageKey = `${folder}/${row.id}${fileExt}`;
  let parsedTags: any[] = [];
  if (typeof row.tags === 'string' && row.tags.trim()) {
    try { parsedTags = JSON.parse(row.tags); } catch { parsedTags = []; }
  }
  return {
    id: row.id,
    folderName: row.folder_name,
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: row.file_size,
    clientId: row.client_id,
    sessionId: row.session_id,
    description: row.description,
    tags: parsedTags,
    isPublic: row.is_public,
    uploadedAt: row.uploaded_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    fileUrl: buildB2Url(storageKey),
    thumbnailUrl: `${baseUrl}/api/files/thumbnail/${row.id}`,
  };
}

async function fetchDigitalFileById(id: string, req: Request): Promise<any | null> {
  const r = await pool.query('SELECT * FROM digital_files WHERE id = $1 LIMIT 1', [id]);
  const row = r.rows[0];
  return row ? mapDigitalFileRow(row, req) : null;
}

router.get('/health', requireShootCleanerApiKey, (_req, res) => {
  res.json({
    ok: true,
    service: 'shootcleaner',
    scopes: ALL_SCOPES,
  });
});

router.get('/galleries', requireShootCleanerApiKey, async (req, res) => {
  try {
    const limitRaw = Number.parseInt(String(req.query.limit || '100'), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 100;
    const search = String(req.query.search || '').trim();
    const clientId = String(req.query.clientId || '').trim();
    const publicOnly = String(req.query.publicOnly || '').trim().toLowerCase();

    const where: string[] = [];
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      where.push(`(g.title ILIKE $${params.length} OR g.slug ILIKE $${params.length} OR COALESCE(g.description, '') ILIKE $${params.length})`);
    }

    if (clientId) {
      params.push(clientId);
      where.push(`g.client_id = $${params.length}`);
    }

    if (publicOnly === 'true') {
      where.push('g.is_public = true');
    } else if (publicOnly === 'false') {
      where.push('g.is_public = false');
    }

    params.push(limit);

    const result = await pool.query(
      `
        SELECT
          g.id,
          g.title,
          g.slug,
          g.description,
          g.cover_image,
          g.is_public,
          g.is_password_protected,
          g.client_id,
          g.created_at,
          g.updated_at,
          COALESCE(COUNT(gi.id), 0)::int AS image_count
        FROM galleries g
        LEFT JOIN gallery_images gi ON gi.gallery_id = g.id
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        GROUP BY g.id
        ORDER BY g.created_at DESC
        LIMIT $${params.length}
      `,
      params,
    );

    const baseUrl = getBaseUrl(req);
    res.json({
      data: result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        coverImageUrl: row.cover_image,
        isPublic: row.is_public,
        isPasswordProtected: row.is_password_protected,
        clientId: row.client_id,
        imageCount: row.image_count,
        galleryUrl: `${baseUrl}/gallery/${row.slug}`,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error('[shootcleaner] Failed to list galleries:', error);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

router.get('/galleries/:id/images', requireShootCleanerApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
        SELECT
          gi.id,
          gi.gallery_id,
          gi.filename,
          gi.url,
          gi.title,
          gi.description,
          gi.sort_order,
          gi.size_bytes,
          gi.content_type,
          gi.created_at,
          g.slug AS gallery_slug,
          g.title AS gallery_title
        FROM gallery_images gi
        INNER JOIN galleries g ON g.id = gi.gallery_id
        WHERE gi.gallery_id = $1
        ORDER BY gi.sort_order ASC, gi.created_at ASC
      `,
      [id],
    );

    res.json({
      data: result.rows.map((row: any) => ({
        id: row.id,
        galleryId: row.gallery_id,
        gallerySlug: row.gallery_slug,
        galleryTitle: row.gallery_title,
        filename: row.filename,
        url: row.url,
        title: row.title,
        description: row.description,
        sortOrder: row.sort_order,
        sizeBytes: row.size_bytes,
        contentType: row.content_type,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('[shootcleaner] Failed to fetch gallery images:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

router.get('/digital-files', requireShootCleanerApiKey, async (req, res) => {
  try {
    const limitRaw = Number.parseInt(String(req.query.limit || '100'), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 100;
    const search = String(req.query.search || '').trim();
    const folderName = String(req.query.folderName || '').trim();
    const fileType = String(req.query.fileType || '').trim();
    const clientId = String(req.query.clientId || '').trim();
    const sessionId = String(req.query.sessionId || '').trim();
    const publicOnly = String(req.query.publicOnly || '').trim().toLowerCase();

    const where: string[] = [];
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      where.push(`(df.file_name ILIKE $${params.length} OR COALESCE(df.description, '') ILIKE $${params.length})`);
    }

    if (folderName) {
      params.push(`%${folderName}%`);
      where.push(`COALESCE(df.folder_name, '') ILIKE $${params.length}`);
    }

    if (fileType) {
      params.push(fileType);
      where.push(`df.file_type = $${params.length}`);
    }

    if (clientId) {
      params.push(clientId);
      where.push(`df.client_id = $${params.length}`);
    }

    if (sessionId) {
      params.push(sessionId);
      where.push(`df.session_id = $${params.length}`);
    }

    if (publicOnly === 'true') {
      where.push('df.is_public = true');
    } else if (publicOnly === 'false') {
      where.push('df.is_public = false');
    }

    params.push(limit);

    const result = await pool.query(
      `
        SELECT
          df.id,
          df.folder_name,
          df.file_name,
          df.file_type,
          df.file_size,
          df.client_id,
          df.session_id,
          df.description,
          df.tags,
          df.is_public,
          df.uploaded_at,
          df.created_at,
          df.updated_at
        FROM digital_files df
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY df.uploaded_at DESC NULLS LAST, df.created_at DESC
        LIMIT $${params.length}
      `,
      params,
    );

    const baseUrl = getBaseUrl(req);
    res.json({
      data: result.rows.map((row: any) => {
        const fileExt = path.extname(row.file_name || '');
        const folder = row.folder_name || 'Manual Website Images';
        const storageKey = `${folder}/${row.id}${fileExt}`;
        const fileUrl = buildB2Url(storageKey);

        let parsedTags: any[] = [];
        if (typeof row.tags === 'string' && row.tags.trim()) {
          try {
            parsedTags = JSON.parse(row.tags);
          } catch {
            parsedTags = [];
          }
        }

        return {
          id: row.id,
          folderName: row.folder_name,
          fileName: row.file_name,
          fileType: row.file_type,
          fileSize: row.file_size,
          clientId: row.client_id,
          sessionId: row.session_id,
          description: row.description,
          tags: parsedTags,
          isPublic: row.is_public,
          uploadedAt: row.uploaded_at,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          fileUrl,
          thumbnailUrl: `${baseUrl}/api/files/thumbnail/${row.id}`,
        };
      }),
    });
  } catch (error) {
    console.error('[shootcleaner] Failed to list digital files:', error);
    res.status(500).json({ error: 'Failed to fetch digital files' });
  }
});

// ---------------------------------------------------------------------------
// Export to Galleries
// ---------------------------------------------------------------------------

// Create (or idempotently reuse) a gallery.
router.post('/galleries', requireScope('galleries:write'), async (req, res) => {
  try {
    const body = req.body || {};
    const title = String(body.title || '').trim();
    if (!title) {
      return res.status(400).json({ error: 'title is required', code: 'invalid_request' });
    }

    const externalRef = String(body.externalRef || '').trim();
    if (externalRef) {
      const existing = await lookupExternalRef(externalRef);
      if (existing && existing.entityType === 'gallery') {
        const found = await fetchGalleryById(existing.entityId, req);
        if (found) return res.json({ data: found }); // idempotent re-export
      }
    }

    const clientId = body.clientId != null && String(body.clientId).trim() ? String(body.clientId).trim() : null;
    if (clientId && !(await clientExists(clientId))) {
      return res.status(400).json({ error: 'clientId not found', code: 'invalid_client_id' });
    }

    const isPasswordProtected = body.isPasswordProtected === true;
    const password = isPasswordProtected && body.password ? String(body.password) : null;
    const isPublic = body.isPublic === true; // default false for exports
    const description = body.description != null ? String(body.description) : null;
    const slug = await ensureUniqueSlug(slugify(String(body.slug || title)));

    const insert = await pool.query(
      `
        INSERT INTO galleries (title, slug, description, is_public, is_password_protected, password, client_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id
      `,
      [title, slug, description, isPublic, isPasswordProtected, password, clientId],
    );
    const galleryId = insert.rows[0].id;
    if (externalRef) await recordExternalRef(externalRef, 'gallery', galleryId);

    const created = await fetchGalleryById(galleryId, req);
    return res.status(201).json({ data: created });
  } catch (error) {
    console.error('[shootcleaner] Failed to create gallery:', error);
    return res.status(500).json({ error: 'Failed to create gallery', code: 'gallery_create_failed' });
  }
});

// Request presigned PUT URLs for gallery images (bytes go straight to B2).
router.post('/galleries/:id/images/presign', requireScope('gallery-images:write'), async (req, res) => {
  try {
    const { id } = req.params;
    const g = await pool.query('SELECT id FROM galleries WHERE id = $1 LIMIT 1', [id]);
    if (!g.rows[0]) return res.status(404).json({ error: 'Gallery not found', code: 'gallery_not_found' });

    const files = req.body?.files;
    const validationError = validateFileList(files, ALLOWED_IMAGE_TYPES);
    if (validationError) {
      return res.status(validationError.status).json({ error: validationError.error, code: validationError.code });
    }

    const { isConfigured } = getS3Config();
    if (!isConfigured) return res.status(503).json({ error: 'Storage is not configured', code: 'storage_not_configured' });

    const data: any[] = [];
    for (const f of files) {
      const rawName = String(f.filename || 'image');
      const ext = path.extname(rawName) || '.jpg';
      const base = sanitizeFilename(path.basename(rawName, ext)).slice(0, 80) || 'image';
      const fileKey = `galleries/${id}/${base}-${randomUUID().slice(0, 8)}${ext}`;
      const uploadUrl = await presignPut(fileKey, f.contentType);
      data.push({
        filename: f.filename,
        fileKey,
        uploadUrl,
        method: 'PUT',
        headers: { 'Content-Type': f.contentType },
        expiresAt: presignExpiry(),
      });
    }
    return res.json({ data });
  } catch (error) {
    console.error('[shootcleaner] Failed to presign gallery images:', error);
    return res.status(500).json({ error: 'Failed to create upload URLs', code: 'presign_failed' });
  }
});

// Register uploaded gallery images after the client PUTs the bytes to B2.
router.post('/galleries/:id/images/commit', requireScope('gallery-images:write'), async (req, res) => {
  try {
    const { id } = req.params;
    const gq = await pool.query('SELECT id, slug, title FROM galleries WHERE id = $1 LIMIT 1', [id]);
    const gallery = gq.rows[0];
    if (!gallery) return res.status(404).json({ error: 'Gallery not found', code: 'gallery_not_found' });

    const images = req.body?.images;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'images[] is required', code: 'invalid_request' });
    }
    if (images.length > MAX_FILES_PER_CALL) {
      return res.status(400).json({ error: `Maximum ${MAX_FILES_PER_CALL} images per call`, code: 'too_many_files' });
    }

    const { bucket, endpoint } = getS3Config();
    const s3 = getS3Client();
    const data: any[] = [];

    for (const img of images) {
      const fileKey = String(img?.fileKey || '').trim();
      if (!fileKey) return res.status(400).json({ error: 'fileKey is required for each image', code: 'invalid_request' });

      const externalRef = String(img?.externalRef || '').trim();
      if (externalRef) {
        const existing = await lookupExternalRef(externalRef);
        if (existing && existing.entityType === 'gallery_image') {
          const found = await fetchGalleryImageById(existing.entityId);
          if (found) { data.push(found); continue; } // idempotent
        }
      }

      // Confirm the client actually uploaded the object before writing the row.
      try {
        await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: fileKey }));
      } catch {
        return res.status(409).json({ error: `Uploaded object not found in storage: ${fileKey}`, code: 'object_missing' });
      }

      const url = buildPublicUrl(bucket, endpoint, fileKey);
      const filename = sanitizeFilename(String(img.filename || path.basename(fileKey)));
      const sortOrder = Number.isFinite(Number(img.sortOrder)) ? Number(img.sortOrder) : 0;
      const sizeBytes = Number(img.sizeBytes || 0);
      const metadata = JSON.stringify({ source: 'shootcleaner', fileKey, externalRef: externalRef || null });

      const ins = await pool.query(
        `
          INSERT INTO gallery_images
            (gallery_id, filename, url, title, description, sort_order, size_bytes, content_type, metadata, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, NOW())
          RETURNING id
        `,
        [id, filename, url, img.title ?? null, img.description ?? null, sortOrder, sizeBytes, img.contentType ?? null, metadata],
      );
      const newId = ins.rows[0].id;
      if (externalRef) await recordExternalRef(externalRef, 'gallery_image', newId);
      const created = await fetchGalleryImageById(newId);
      if (created) data.push(created);
    }

    return res.status(201).json({ data });
  } catch (error) {
    console.error('[shootcleaner] Failed to commit gallery images:', error);
    return res.status(500).json({ error: 'Failed to commit images', code: 'commit_failed' });
  }
});

// ---------------------------------------------------------------------------
// Studio portfolio publishing
//
// Ported from the product line (AxixOS/togninja v1.9.242). A studio's OWN public portfolio —
// no client, no expiry, no password — written into the /portfolio page this site already has
// rather than into a second one.
//
// WHAT "REPLACE, NOT APPEND" MEANS HERE. An image absent from a publish disappears from the
// public page, as the handoff asks. But portfolio_images on this site already holds 25
// photographs the studio put there themselves, and a literal replace would delete them the
// first time Publish was pressed in another application. So a publish owns exactly the rows it
// created — tracked in shootcleaner_exports — and removes only those.
//
// CATEGORY 'featured'. On this site that is not an invented bucket: PortfolioPage reads
// imagesByCategory['featured'] and renders it through FeaturedGrid as a mosaic, and six
// photographs are already filed there. Published work lands in that grid.
// ---------------------------------------------------------------------------

const PORTFOLIO_CATEGORY = 'featured';
const MAX_PORTFOLIO_IMAGES = 500;
// One publish at a time. The work HEADs objects in storage between writes, so it is not
// transactional — a session advisory lock rather than a row lock.
const PORTFOLIO_LOCK_KEY = 918273645;

let portfolioSchemaReady: Promise<void> | null = null;
function ensurePortfolioSchema(): Promise<void> {
  if (!portfolioSchemaReady) {
    portfolioSchemaReady = pool
      .query(`
        CREATE TABLE IF NOT EXISTS shootcleaner_portfolio (
          only_row       boolean PRIMARY KEY DEFAULT true CHECK (only_row),
          id             uuid NOT NULL DEFAULT gen_random_uuid(),
          title          text NOT NULL,
          intro          text,
          layout         text,
          source_user_id text,
          created_at     timestamptz NOT NULL DEFAULT now(),
          updated_at     timestamptz NOT NULL DEFAULT now()
        )
      `)
      .then(() => undefined)
      .catch((err) => { portfolioSchemaReady = null; throw err; });
  }
  return portfolioSchemaReady;
}

/**
 * ONE PORTFOLIO PER STUDIO, ENFORCED BY THE SCHEMA. A boolean primary key with a CHECK that it
 * is true makes a second row impossible at the database rather than by remembering to look one
 * up first — and the id survives every update, so a stored address keeps working.
 */
async function readPortfolioMeta(): Promise<any | null> {
  await ensurePortfolioSchema();
  const r = await pool.query(
    'SELECT id, title, intro, layout, source_user_id, created_at, updated_at FROM shootcleaner_portfolio LIMIT 1',
  );
  return r.rows[0] || null;
}

/** The portfolio_images rows this integration created — never the studio's own. */
async function shootcleanerPortfolioImageIds(): Promise<string[]> {
  await ensureExportSchema();
  const r = await pool.query(
    `SELECT e.entity_id
       FROM shootcleaner_exports e
       JOIN portfolio_images p ON p.id::text = e.entity_id
      WHERE e.entity_type = 'portfolio_image'`,
  );
  return r.rows.map((row: any) => String(row.entity_id));
}

function portfolioUrl(req: Request): string {
  return `${getBaseUrl(req)}/portfolio/`;
}

// Presign portfolio uploads. ShootCleaner is a desktop app whose files sit on a local disk with
// no address we could fetch, so there is no manifest route here on purpose.
router.post('/portfolio/images/presign', requireScope('portfolio:write'), async (req, res) => {
  try {
    const files = req.body?.files;
    const validationError = validateFileList(files, ALLOWED_IMAGE_TYPES);
    if (validationError) {
      return res.status(validationError.status).json({ error: validationError.error, code: validationError.code });
    }

    const { isConfigured } = getS3Config();
    if (!isConfigured) return res.status(503).json({ error: 'Storage is not configured', code: 'storage_not_configured' });

    const data: any[] = [];
    for (const f of files) {
      const rawName = String(f.filename || 'image');
      const ext = path.extname(rawName) || '.jpg';
      const base = sanitizeFilename(path.basename(rawName, ext)).slice(0, 80) || 'image';
      const fileKey = `portfolio/${base}-${randomUUID().slice(0, 8)}${ext}`;
      const uploadUrl = await presignPut(fileKey, f.contentType);
      data.push({
        filename: f.filename,
        fileKey,
        uploadUrl,
        method: 'PUT',
        headers: { 'Content-Type': f.contentType },
        expiresAt: presignExpiry(),
      });
    }
    return res.json({ data });
  } catch (error) {
    console.error('[shootcleaner] Failed to presign portfolio images:', error);
    return res.status(500).json({ error: 'Failed to create upload URLs', code: 'presign_failed' });
  }
});

// Create or replace the studio's portfolio. The images array is the whole thing.
router.post('/portfolio', requireScope('portfolio:write'), async (req, res) => {
  const title = String(req.body?.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title is required', code: 'invalid_request' });

  const images = req.body?.images;
  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'images[] is required', code: 'invalid_request' });
  }
  // Said, not truncated.
  if (images.length > MAX_PORTFOLIO_IMAGES) {
    return res.status(413).json({
      error: `A portfolio holds at most ${MAX_PORTFOLIO_IMAGES} images; ${images.length} were sent`,
      code: 'too_many_images',
    });
  }

  const sourceUserId = String(req.body?.sourceRef?.userId || '').trim();
  if (!sourceUserId) {
    return res.status(400).json({ error: 'sourceRef.userId is required', code: 'invalid_request' });
  }

  const { isConfigured, bucket, endpoint } = getS3Config();
  if (!isConfigured) return res.status(503).json({ error: 'Storage is not configured', code: 'storage_not_configured' });

  let client: any = null;
  try {
    await ensurePortfolioSchema();
    await ensureExportSchema();

    client = await pool.connect();
    const got = await client.query('SELECT pg_try_advisory_lock($1) AS ok', [PORTFOLIO_LOCK_KEY]);
    if (!got.rows[0]?.ok) {
      client.release();
      client = null;
      return res.status(409).json({ error: 'Another publish is in progress', code: 'portfolio_conflict' });
    }

    try {
      const s3 = getS3Client();
      const keptIds: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i] || {};
        const fileKey = String(img.fileKey || '').trim();
        const externalRef = String(img.externalRef || '').trim();
        if (!externalRef) {
          return res.status(400).json({ error: 'externalRef is required for each image', code: 'invalid_request' });
        }
        // Lenient on ordering: a missing sortOrder falls back to the position in the array,
        // which is the order they sent. Rejecting the publish would cost a studio their upload
        // over a field whose intent is never ambiguous.
        const sortOrder = Number.isFinite(Number(img.sortOrder)) ? Number(img.sortOrder) : i;
        const alt = img.alt == null ? null : String(img.alt).slice(0, 500);

        // Same externalRef means the same photograph. Reuse the row rather than store a second
        // copy of identical bytes — and UPDATE it, so a re-publish that only changes ordering
        // or alt text is applied without re-uploading anything.
        let rowId: string | null = null;
        const existing = await lookupExternalRef(externalRef);
        if (existing && existing.entityType === 'portfolio_image') {
          const chk = await pool.query('SELECT id FROM portfolio_images WHERE id = $1 LIMIT 1', [existing.entityId]);
          if (chk.rows[0]) {
            await pool.query(
              `UPDATE portfolio_images
                  SET sort_order = $2, alt = COALESCE($3, alt), category = $4, is_active = true, updated_at = now()
                WHERE id = $1`,
              [existing.entityId, sortOrder, alt, PORTFOLIO_CATEGORY],
            );
            rowId = String(existing.entityId);
          }
          // Falls through when the row is gone — deleted in admin and published again. The
          // stale mapping is repointed below rather than orphaned.
        }

        if (!rowId) {
          if (!fileKey) {
            return res.status(400).json({ error: 'fileKey is required for each new image', code: 'invalid_request' });
          }
          // A presigned URL expires in 15 minutes and a slow batch can outlive one. That case
          // is a 422 so the client re-presigns and retries — never a 500, and never a row
          // pointing at nothing.
          try {
            await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: fileKey }));
          } catch {
            return res.status(422).json({
              error: `Upload not found for fileKey: ${fileKey}`,
              code: 'invalid_file_key',
            });
          }

          const ins = await pool.query(
            `INSERT INTO portfolio_images (category, url, alt, sort_order, is_active)
             VALUES ($1, $2, $3, $4, true)
             RETURNING id`,
            [PORTFOLIO_CATEGORY, buildPublicUrl(bucket, endpoint, fileKey), alt, sortOrder],
          );
          rowId = String(ins.rows[0].id);
          await pool.query(
            `INSERT INTO shootcleaner_exports (external_ref, entity_type, entity_id)
             VALUES ($1, 'portfolio_image', $2)
             ON CONFLICT (external_ref) DO UPDATE SET entity_type = 'portfolio_image', entity_id = EXCLUDED.entity_id`,
            [externalRef, rowId],
          );
        }

        keptIds.push(rowId);
      }

      // REPLACE, scoped to this integration's own rows. The studio's 25 existing photographs
      // are not ours to delete.
      const previous = await shootcleanerPortfolioImageIds();
      const kept = new Set(keptIds);
      const removed = previous.filter((id) => !kept.has(id));
      if (removed.length) {
        await pool.query('DELETE FROM portfolio_images WHERE id::text = ANY($1::text[])', [removed]);
        await pool.query(
          `DELETE FROM shootcleaner_exports WHERE entity_type = 'portfolio_image' AND entity_id = ANY($1::text[])`,
          [removed],
        );
      }

      const meta = await pool.query(
        `INSERT INTO shootcleaner_portfolio (only_row, title, intro, layout, source_user_id, updated_at)
         VALUES (true, $1, $2, $3, $4, now())
         ON CONFLICT (only_row) DO UPDATE
            SET title = EXCLUDED.title,
                intro = EXCLUDED.intro,
                layout = EXCLUDED.layout,
                source_user_id = EXCLUDED.source_user_id,
                updated_at = now()
         RETURNING id, updated_at`,
        [
          title.slice(0, 300),
          req.body?.intro == null ? null : String(req.body.intro).slice(0, 2000),
          req.body?.layout == null ? null : String(req.body.layout).slice(0, 40),
          sourceUserId.slice(0, 200),
        ],
      );

      return res.json({
        id: String(meta.rows[0].id),
        url: portfolioUrl(req),
        imageCount: kept.size,
        updatedAt: new Date(meta.rows[0].updated_at).toISOString(),
      });
    } finally {
      if (client) {
        await client.query('SELECT pg_advisory_unlock($1)', [PORTFOLIO_LOCK_KEY]).catch(() => {});
        client.release();
        client = null;
      }
    }
  } catch (error) {
    console.error('[shootcleaner] Failed to publish portfolio:', error);
    if (client) { try { client.release(); } catch { /* already released */ } }
    return res.status(500).json({ error: 'Failed to publish portfolio', code: 'portfolio_publish_failed' });
  }
});

// Read the published portfolio back. 404 is a normal answer — "not published yet", not a fault.
router.get('/portfolio', requireScope('portfolio:read'), async (req, res) => {
  try {
    const meta = await readPortfolioMeta();
    if (!meta) {
      return res.status(404).json({ error: 'No portfolio has been published', code: 'portfolio_not_found' });
    }
    const ids = await shootcleanerPortfolioImageIds();
    return res.json({
      id: String(meta.id),
      url: portfolioUrl(req),
      title: meta.title,
      intro: meta.intro ?? null,
      layout: meta.layout ?? null,
      imageCount: ids.length,
      updatedAt: new Date(meta.updated_at).toISOString(),
    });
  } catch (error) {
    console.error('[shootcleaner] Failed to read portfolio:', error);
    return res.status(500).json({ error: 'Failed to read portfolio', code: 'portfolio_read_failed' });
  }
});

// Unpublish. Removes this integration's images and the record of the publication; the studio's
// own photographs stay and /portfolio/ keeps working.
router.delete('/portfolio', requireScope('portfolio:write'), async (_req, res) => {
  try {
    const meta = await readPortfolioMeta();
    if (!meta) {
      return res.status(404).json({ error: 'No portfolio has been published', code: 'portfolio_not_found' });
    }
    const ids = await shootcleanerPortfolioImageIds();
    if (ids.length) {
      await pool.query('DELETE FROM portfolio_images WHERE id::text = ANY($1::text[])', [ids]);
      await pool.query(
        `DELETE FROM shootcleaner_exports WHERE entity_type = 'portfolio_image' AND entity_id = ANY($1::text[])`,
        [ids],
      );
    }
    await pool.query('DELETE FROM shootcleaner_portfolio');
    return res.json({ ok: true, removed: ids.length });
  } catch (error) {
    console.error('[shootcleaner] Failed to unpublish portfolio:', error);
    return res.status(500).json({ error: 'Failed to unpublish portfolio', code: 'portfolio_unpublish_failed' });
  }
});

// ---------------------------------------------------------------------------
// Export to Cloud (digital files)
// ---------------------------------------------------------------------------

router.post('/digital-files/presign', requireScope('digital-files:write'), async (req, res) => {
  try {
    const files = req.body?.files;
    // Normalize digital-file fields (fileName/fileSize) onto the validator's shape.
    const normalized = Array.isArray(files)
      ? files.map((f: any) => ({ contentType: f?.contentType, sizeBytes: f?.fileSize ?? f?.sizeBytes }))
      : files;
    const validationError = validateFileList(normalized, ALLOWED_FILE_TYPES);
    if (validationError) {
      return res.status(validationError.status).json({ error: validationError.error, code: validationError.code });
    }

    const { isConfigured } = getS3Config();
    if (!isConfigured) return res.status(503).json({ error: 'Storage is not configured', code: 'storage_not_configured' });

    const folderName = String(req.body?.folderName || '').trim() || DEFAULT_EXPORT_FOLDER;
    const data: any[] = [];
    for (const f of files) {
      const fileName = String(f.fileName || f.filename || 'file');
      const ext = path.extname(fileName) || '';
      const fileId = randomUUID();
      const fileKey = `${folderName}/${fileId}${ext}`;
      const uploadUrl = await presignPut(fileKey, f.contentType);
      data.push({
        fileName,
        fileKey,
        uploadUrl,
        method: 'PUT',
        headers: { 'Content-Type': f.contentType },
        expiresAt: presignExpiry(),
      });
    }
    return res.json({ data });
  } catch (error) {
    console.error('[shootcleaner] Failed to presign digital files:', error);
    return res.status(500).json({ error: 'Failed to create upload URLs', code: 'presign_failed' });
  }
});

router.post('/digital-files/commit', requireScope('digital-files:write'), async (req, res) => {
  try {
    const files = req.body?.files;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'files[] is required', code: 'invalid_request' });
    }
    if (files.length > MAX_FILES_PER_CALL) {
      return res.status(400).json({ error: `Maximum ${MAX_FILES_PER_CALL} files per call`, code: 'too_many_files' });
    }

    const { bucket } = getS3Config();
    const s3 = getS3Client();
    const data: any[] = [];

    for (const f of files) {
      const fileKey = String(f?.fileKey || '').trim();
      if (!fileKey) return res.status(400).json({ error: 'fileKey is required for each file', code: 'invalid_request' });

      const externalRef = String(f?.externalRef || '').trim();
      if (externalRef) {
        const existing = await lookupExternalRef(externalRef);
        if (existing && existing.entityType === 'digital_file') {
          const found = await fetchDigitalFileById(existing.entityId, req);
          if (found) { data.push(found); continue; }
        }
      }

      try {
        await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: fileKey }));
      } catch {
        return res.status(409).json({ error: `Uploaded object not found in storage: ${fileKey}`, code: 'object_missing' });
      }

      const ext = path.extname(fileKey);
      const fileId = path.basename(fileKey, ext); // storage-key basename == digital_files.id
      const folderName = path.dirname(fileKey) || DEFAULT_EXPORT_FOLDER;
      const fileName = String(f.fileName || path.basename(fileKey));
      const contentType = String(f.contentType || '');
      const fileType = String(
        f.fileType ||
        (contentType.startsWith('image/') ? 'image'
          : contentType.startsWith('video/') ? 'video'
            : contentType === 'application/pdf' ? 'document' : 'other'),
      );

      const clientId = f.clientId != null && String(f.clientId).trim() ? String(f.clientId).trim() : null;
      if (clientId && !(await clientExists(clientId))) {
        return res.status(400).json({ error: 'clientId not found', code: 'invalid_client_id' });
      }
      const sessionId = f.sessionId != null && String(f.sessionId).trim() ? String(f.sessionId).trim() : null;
      const tags = JSON.stringify(Array.isArray(f.tags) ? f.tags : ['shootcleaner']);
      const fileSize = Number(f.fileSize || 0);
      const isPublic = f.isPublic === true;
      const description = f.description != null ? String(f.description) : '';

      await pool.query(
        `
          INSERT INTO digital_files
            (id, folder_name, file_name, file_type, file_size, client_id, session_id, description, tags, is_public, uploaded_at, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            file_name = EXCLUDED.file_name,
            file_size = EXCLUDED.file_size,
            description = EXCLUDED.description,
            tags = EXCLUDED.tags,
            is_public = EXCLUDED.is_public,
            updated_at = NOW()
        `,
        [fileId, folderName, fileName, fileType, fileSize, clientId, sessionId, description, tags, isPublic],
      );
      if (externalRef) await recordExternalRef(externalRef, 'digital_file', fileId);

      const created = await fetchDigitalFileById(fileId, req);
      if (created) data.push(created);
    }

    return res.status(201).json({ data });
  } catch (error) {
    console.error('[shootcleaner] Failed to commit digital files:', error);
    return res.status(500).json({ error: 'Failed to commit files', code: 'commit_failed' });
  }
});

// ---------------------------------------------------------------------------
// Clients (read) — so ShootCleaner can resolve/assign images to the right client
// ---------------------------------------------------------------------------

function mapClientRow(row: any): any {
  return {
    id: row.id,
    clientId: row.client_id,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: [row.first_name, row.last_name].filter(Boolean).join(' '),
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
    company: row.company,
    vatNumber: row.vat_number,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// List / search clients. ?search= matches name, email or client_id.
router.get('/clients', requireShootCleanerApiKey, async (req, res) => {
  try {
    const limitRaw = Number.parseInt(String(req.query.limit || '100'), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 100;
    const offsetRaw = Number.parseInt(String(req.query.offset || '0'), 10);
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
    const search = String(req.query.search || '').trim();

    const where: string[] = [];
    const params: any[] = [];
    if (search) {
      params.push(`%${search}%`);
      const p = `$${params.length}`;
      where.push(`(first_name ILIKE ${p} OR last_name ILIKE ${p} OR COALESCE(email,'') ILIKE ${p} OR COALESCE(client_id,'') ILIKE ${p} OR (first_name || ' ' || last_name) ILIKE ${p})`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRes = await pool.query(`SELECT COUNT(*)::int AS c FROM crm_clients ${whereSql}`, params);
    params.push(limit); params.push(offset);
    const result = await pool.query(
      `SELECT id, client_id, first_name, last_name, email, phone, address, city, state, zip,
              country, company, vat_number, status, created_at, updated_at
       FROM crm_clients ${whereSql}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    res.json({ data: result.rows.map(mapClientRow), total: countRes.rows[0]?.c ?? 0, limit, offset });
  } catch (error) {
    console.error('[shootcleaner] Failed to list clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.get('/clients/:id', requireShootCleanerApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, client_id, first_name, last_name, email, phone, address, city, state, zip,
              country, company, vat_number, status, created_at, updated_at
       FROM crm_clients WHERE id::text = $1 OR client_id = $1 LIMIT 1`,
      [id],
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Client not found', code: 'client_not_found' });
    res.json({ data: mapClientRow(row) });
  } catch (error) {
    console.error('[shootcleaner] Failed to fetch client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// ---------------------------------------------------------------------------
// Questionnaire responses (read) — source material for the case-study generator
// ---------------------------------------------------------------------------

function buildQuestionnaireLabelMap(surveyPages: any): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    const pages = typeof surveyPages === 'string' ? JSON.parse(surveyPages) : surveyPages;
    if (Array.isArray(pages)) {
      for (const page of pages) {
        for (const q of (page.questions || [])) {
          if (q.id && (q.title || q.text)) map[q.id] = q.title || q.text;
        }
      }
    }
  } catch { /* ignore malformed survey pages */ }
  return map;
}

function mapQuestionnaireRow(r: any): any {
  const labelMap = buildQuestionnaireLabelMap(r.survey_pages);
  const rawAnswers = typeof r.answers === 'string' ? JSON.parse(r.answers || '{}') : (r.answers || {});
  const resolvedAnswers: Record<string, string> = {};
  for (const [key, val] of Object.entries(rawAnswers)) {
    resolvedAnswers[labelMap[key] || key] = String(val);
  }
  return {
    id: r.id,
    clientId: r.client_id,
    clientName: [r.first_name, r.last_name].filter(Boolean).join(' ') || r.stored_client_name || 'Unknown',
    clientEmail: r.crm_email || r.stored_client_email || null,
    questionnaireSlug: r.template_slug,
    questionnaireTitle: r.questionnaire_title,
    answers: rawAnswers,
    // resolvedAnswers keys are the human question labels — ideal for case studies.
    resolvedAnswers,
    submittedAt: r.submitted_at,
  };
}

const QUESTIONNAIRE_SELECT = `
  SELECT qr.id, qr.client_id, qr.token, qr.template_slug, qr.answers, qr.submitted_at,
         qr.client_name AS stored_client_name, qr.client_email AS stored_client_email,
         c.first_name, c.last_name, c.email AS crm_email,
         s.title AS questionnaire_title, s.pages AS survey_pages
  FROM questionnaire_responses qr
  LEFT JOIN crm_clients c ON qr.client_id = c.id::text
  LEFT JOIN surveys s ON qr.template_slug::text = s.id::text`;

router.get('/questionnaire-responses', requireShootCleanerApiKey, async (req, res) => {
  try {
    const limitRaw = Number.parseInt(String(req.query.limit || '50'), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;
    const offsetRaw = Number.parseInt(String(req.query.offset || '0'), 10);
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
    const clientId = String(req.query.clientId || '').trim();
    const questionnaireId = String(req.query.questionnaireId || '').trim();

    const where: string[] = [];
    const params: any[] = [];
    if (clientId) { params.push(clientId); where.push(`qr.client_id = $${params.length}`); }
    if (questionnaireId) { params.push(questionnaireId); where.push(`qr.template_slug = $${params.length}`); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRes = await pool.query(`SELECT COUNT(*)::int AS c FROM questionnaire_responses qr ${whereSql}`, params);
    params.push(limit); params.push(offset);
    const result = await pool.query(
      `${QUESTIONNAIRE_SELECT} ${whereSql} ORDER BY qr.submitted_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    res.json({ data: result.rows.map(mapQuestionnaireRow), total: countRes.rows[0]?.c ?? 0, limit, offset });
  } catch (error) {
    console.error('[shootcleaner] Failed to list questionnaire responses:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire responses' });
  }
});

router.get('/questionnaire-responses/:id', requireShootCleanerApiKey, async (req, res) => {
  try {
    const result = await pool.query(`${QUESTIONNAIRE_SELECT} WHERE qr.id = $1 LIMIT 1`, [req.params.id]);
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Response not found', code: 'response_not_found' });
    res.json({ data: mapQuestionnaireRow(row) });
  } catch (error) {
    console.error('[shootcleaner] Failed to fetch questionnaire response:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire response' });
  }
});

// ---------------------------------------------------------------------------
// Studio profile (read) — so ShootCleaner can brand its output (invoices, galleries,
// case studies) with the studio's name, logo and contact details.
// ---------------------------------------------------------------------------
router.get('/studio', requireShootCleanerApiKey, async (_req, res) => {
  try {
    // Single-tenant per database — the app treats the first studio_configs row as
    // THE studio (mirrors studioConfigs.limit(1) elsewhere).
    const r = await pool.query(
      `SELECT studio_name, business_name, logo_url, email, owner_email, phone, website,
              address, city, state, zip, country, currency, vat_number
       FROM studio_configs
       LIMIT 1`,
    );
    const row = r.rows[0];
    if (!row) return res.status(404).json({ error: 'Studio not configured', code: 'studio_not_configured' });

    const formatted = [
      row.address,
      [row.zip, row.city].filter(Boolean).join(' '),
      row.state,
      row.country,
    ].filter(Boolean).join(', ') || null;

    res.json({
      data: {
        name: row.business_name || row.studio_name || null,
        logoUrl: row.logo_url || null,
        phone: row.phone || null,
        email: row.email || row.owner_email || null,
        website: row.website || null,
        address: {
          line: row.address || null,
          city: row.city || null,
          state: row.state || null,
          zip: row.zip || null,
          country: row.country || null,
          formatted,
        },
        vat: row.vat_number || null,
        currency: row.currency || null,
      },
    });
  } catch (error) {
    console.error('[shootcleaner] Failed to fetch studio profile:', error);
    res.status(500).json({ error: 'Failed to fetch studio profile' });
  }
});

export default router;
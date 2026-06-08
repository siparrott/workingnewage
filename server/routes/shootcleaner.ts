import { Router, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import { pool } from '../db';

const router = Router();

function getConfiguredApiKey(): string {
  return (process.env.SHOOTCLEANER_API_KEY || '').trim();
}

function getPresentedApiKey(req: Request): string {
  const headerKey = (req.headers['x-api-key'] as string) || '';
  if (headerKey) {
    return headerKey.trim();
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

router.get('/health', requireShootCleanerApiKey, (_req, res) => {
  res.json({
    ok: true,
    service: 'shootcleaner',
    scopes: ['galleries:read', 'gallery-images:read', 'digital-files:read'],
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

export default router;
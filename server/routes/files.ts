import { Router } from 'express';
import { db } from '../db';
import { eq, desc, and, like, ilike } from 'drizzle-orm';
import { digitalFiles } from '../../shared/schema';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
// removed unused imports

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Serve uploaded files
router.get('/serve/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(process.cwd(), 'uploads'))) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// GET /api/files - Retrieve digital files with filters
router.get('/', async (req, res) => {
  try {
    const { 
      folder_name, 
      file_type, 
      client_id, 
      session_id,
      search_term,
      is_public,
      limit = '20'
    } = req.query;

    const baseQuery = db.select({
      id: digitalFiles.id,
      folder_name: digitalFiles.folderName,
      file_name: digitalFiles.fileName,
      file_type: digitalFiles.fileType,
      file_size: digitalFiles.fileSize,
      client_id: digitalFiles.clientId,
      session_id: digitalFiles.sessionId,
      description: digitalFiles.description,
      tags: digitalFiles.tags,
      is_public: digitalFiles.isPublic,
      uploaded_at: digitalFiles.uploadedAt,
      created_at: digitalFiles.createdAt,
      updated_at: digitalFiles.updatedAt
    }).from(digitalFiles);

    // Apply filters
    const conditions = [];
    
    if (folder_name) {
  conditions.push(ilike(digitalFiles.folderName, `%${folder_name}%`));
    }
    
    if (file_type) {
  conditions.push(eq(digitalFiles.fileType, file_type as any));
    }
    
    if (client_id) {
  conditions.push(eq(digitalFiles.clientId, client_id as string));
    }
    
    if (session_id) {
  conditions.push(eq(digitalFiles.sessionId, session_id as string));
    }
    
    if (search_term) {
      // Search in file name and description
  const searchCondition = like(digitalFiles.fileName, `%${search_term}%`);
      conditions.push(searchCondition);
    }
    
    if (is_public !== undefined) {
  conditions.push(eq(digitalFiles.isPublic, is_public === 'true'));
    }

    const finalQuery = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;
    const files = await finalQuery
      .orderBy(desc(digitalFiles.uploadedAt))
      .limit(parseInt(limit as string));

    // Add thumbnailUrl and mimeType for each file
    const filesWithThumbnails = files.map((file: any) => {
      const fileExt = path.extname(file.file_name).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
      const isImage = file.file_type === 'image' || imageExts.includes(fileExt);
      
      // Check if thumbnail exists, otherwise fall back to original
      const thumbnailFilename = `${file.id}_thumb.webp`;
      const thumbnailPath = path.join(process.cwd(), 'uploads', thumbnailFilename);
      const hasThumbnail = fs.existsSync(thumbnailPath);
      
      return {
        id: file.id,
        fileName: file.file_name,
        fileSize: file.file_size,
        mimeType: isImage ? 'image/' + fileExt.substring(1) : 'application/octet-stream',
        thumbnailUrl: isImage 
          ? (hasThumbnail 
              ? `/api/files/serve/${thumbnailFilename}` 
              : `/api/files/serve/${file.id}${fileExt}`)
          : undefined,
        createdAt: file.created_at,
      };
    });

    res.json(filesWithThumbnails);
  } catch (error) {
    console.error('Failed to fetch digital files:', error);
    res.status(500).json({ error: 'Failed to fetch digital files' });
  }
});

// POST /api/files - Upload new file
router.post('/', async (req, res) => {
  try {
    const {
      folder_name,
      file_name,
      file_type,
      file_size,
      client_id,
      session_id,
      description = '',
      tags = [],
      is_public = false
    } = req.body;

    // Validate required fields
    if (!folder_name || !file_name || !file_type || !file_size) {
      return res.status(400).json({ 
        error: 'Missing required fields: folder_name, file_name, file_type, file_size' 
      });
    }

    const fileId = crypto.randomUUID();
    
    const [newFile] = await db.insert(digitalFiles).values({
      id: fileId,
      folderName: folder_name,
      fileName: file_name,
      fileType: file_type,
      fileSize: file_size,
      clientId: client_id || null,
      sessionId: session_id || null,
      description,
      tags: JSON.stringify(tags),
      isPublic: is_public,
      uploadedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Failed to upload file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// POST /api/files/upload - Upload file with multipart/form-data
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.session?.userId;
    if (!userId) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check user's storage subscription and limits
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    const subscriptions = await sql`
      SELECT id, tier, storage_limit, status
      FROM storage_subscriptions
      WHERE user_id = ${userId}
      AND status = 'active'
      LIMIT 1
    `;
    
    if (subscriptions.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'No active storage subscription' });
    }
    
    const subscription = subscriptions[0];
    
    // Check current usage
    const usage = await sql`
      SELECT current_storage_bytes
      FROM storage_usage
      WHERE subscription_id = ${subscription.id}
      LIMIT 1
    `;
    
    const currentBytes = usage.length > 0 ? Number(usage[0].current_storage_bytes) : 0;
    const limitBytes = Number(subscription.storage_limit);
    const fileSize = req.file.size;
    
    if (currentBytes + fileSize > limitBytes) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({ 
        error: 'Storage limit exceeded',
        current: currentBytes,
        limit: limitBytes,
        fileSize
      });
    }

    // Store file metadata in database
    const fileId = crypto.randomUUID();
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' :
                     req.file.mimetype.startsWith('video/') ? 'video' :
                     req.file.mimetype === 'application/pdf' ? 'document' : 'other';
    
    // Rename original file to use the fileId for easier retrieval
    const fileExt = path.extname(req.file.originalname);
    const newFilename = `${fileId}${fileExt}`;
    const newPath = path.join(path.dirname(req.file.path), newFilename);
    fs.renameSync(req.file.path, newPath);
    
    // Generate compressed thumbnail for images (300x300, quality 80)
    let thumbnailUrl: string | undefined;
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const thumbnailFilename = `${fileId}_thumb.webp`;
        const thumbnailPath = path.join(path.dirname(newPath), thumbnailFilename);
        
        await sharp(newPath)
          .resize(300, 300, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 80 })
          .toFile(thumbnailPath);
        
        thumbnailUrl = `/api/files/serve/${thumbnailFilename}`;
        console.log(`✅ Generated thumbnail for ${req.file.originalname}`);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        // Fallback to original image if thumbnail generation fails
        thumbnailUrl = `/api/files/serve/${newFilename}`;
      }
    }
    
    const [newFile] = await db.insert(digitalFiles).values({
      id: fileId,
      folderName: req.body.folderId || 'Home',
      fileName: req.file.originalname,
      fileType: fileType,
      fileSize: req.file.size,
      clientId: null,
      sessionId: null,
      description: '',
      tags: JSON.stringify([]),
      isPublic: false,
      uploadedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Update storage usage
    if (usage.length > 0) {
      await sql`
        UPDATE storage_usage
        SET current_storage_bytes = current_storage_bytes + ${fileSize},
            file_count = file_count + 1
        WHERE subscription_id = ${subscription.id}
      `;
    } else {
      await sql`
        INSERT INTO storage_usage (subscription_id, current_storage_bytes, file_count)
        VALUES (${subscription.id}, ${fileSize}, 1)
      `;
    }

    res.status(201).json({
      ...newFile,
      thumbnailUrl, // Include thumbnail URL for frontend
      mimeType: req.file.mimetype, // Include mimeType for icon selection
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Failed to upload file:', error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // File already deleted or moved
      }
    }
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// PUT /api/files/:id - Update file metadata
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove ID from update data
    delete updateData.id;
    
    // Convert tags to JSON string if provided
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = JSON.stringify(updateData.tags);
    }
    
    // Set updated timestamp
    updateData.updated_at = new Date();

    const [updatedFile] = await db
  .update(digitalFiles)
      .set(updateData)
  .where(eq(digitalFiles.id, id))
      .returning();

    if (!updatedFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(updatedFile);
  } catch (error) {
    console.error('Failed to update file:', error);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// GET /api/files/:id/download - Download original file
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get file metadata from database
    const [file] = await db.select()
      .from(digitalFiles)
      .where(eq(digitalFiles.id, id))
      .limit(1);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Construct original filename (not thumbnail)
    const fileExt = path.extname(file.fileName);
    const originalFilename = `${id}${fileExt}`;
    const downloadUrl = `/api/files/serve/${originalFilename}`;
    
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Error getting download URL:', error);
    res.status(500).json({ error: 'Failed to get download URL' });
  }
});

// DELETE /api/files/:id - Delete file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedFile] = await db
  .delete(digitalFiles)
  .where(eq(digitalFiles.id, id))
      .returning();

    if (!deletedFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ 
      message: 'File deleted successfully', 
      file: deletedFile 
    });
  } catch (error) {
    console.error('Failed to delete file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// GET /api/files/usage - Get storage usage statistics
router.get('/usage', async (req, res) => {
  try {
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.json({
        hasSubscription: false,
        currentUsage: 0,
        storageLimit: 0,
        fileCount: 0,
        percentUsed: '0',
        usageGB: '0',
        limitGB: '0'
      });
    }
    
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if user has a storage subscription
    const subscriptions = await sql`
      SELECT id, tier, status, storage_limit, current_period_end
      FROM storage_subscriptions
      WHERE user_id = ${userId}
      AND status = 'active'
      LIMIT 1
    `;
    
    if (subscriptions.length === 0) {
      return res.json({
        hasSubscription: false,
        currentUsage: 0,
        storageLimit: 0,
        fileCount: 0,
        percentUsed: '0',
        usageGB: '0',
        limitGB: '0'
      });
    }
    
    const subscription = subscriptions[0];
    
    // Get storage usage for this subscription
    const usage = await sql`
      SELECT current_storage_bytes, file_count
      FROM storage_usage
      WHERE subscription_id = ${subscription.id}
      LIMIT 1
    `;
    
    const currentBytes = usage.length > 0 ? Number(usage[0].current_storage_bytes) : 0;
    const fileCount = usage.length > 0 ? Number(usage[0].file_count) : 0;
    const limitBytes = Number(subscription.storage_limit);
    
    const currentGB = currentBytes / (1024 * 1024 * 1024);
    const limitGB = limitBytes / (1024 * 1024 * 1024);
    const percentUsed = limitBytes > 0 ? (currentBytes / limitBytes) * 100 : 0;
    
    res.json({
      hasSubscription: true,
      tier: subscription.tier,
      status: subscription.status,
      currentUsage: currentBytes,
      storageLimit: limitBytes,
      fileCount: fileCount,
      percentUsed: percentUsed.toFixed(2),
      usageGB: currentGB.toFixed(2),
      limitGB: limitGB.toFixed(2)
    });
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    res.status(500).json({ error: 'Failed to get storage usage' });
  }
});

// GET /api/files/folders - Get folder organization and statistics
router.get('/folders', async (req, res) => {
  try {
    const { folder_name } = req.query;

    // Get folder statistics
    let folderStatsQuery = `
      SELECT 
        folder_name,
        COUNT(*) as file_count,
        SUM(file_size) as total_size,
        COUNT(CASE WHEN file_type = 'image' THEN 1 END) as image_count,
        COUNT(CASE WHEN file_type = 'document' THEN 1 END) as document_count,
        COUNT(CASE WHEN file_type = 'video' THEN 1 END) as video_count,
        MAX(uploaded_at) as last_uploaded
      FROM digital_files
    `;

    const values = [];
    if (folder_name) {
      folderStatsQuery += ` WHERE folder_name = $1`;
      values.push(folder_name);
    }

    folderStatsQuery += ` GROUP BY folder_name ORDER BY file_count DESC`;

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    const folders = await sql(folderStatsQuery, values);

    // Get recent files
    const recentFiles = await sql`
      SELECT folder_name, file_name, file_type, uploaded_at
      FROM digital_files
      ORDER BY uploaded_at DESC
      LIMIT 10
    `;

    res.json({
      total_folders: folders.length,
      folders: folders.map((folder: any) => ({
        name: folder.folder_name,
        file_count: folder.file_count,
        total_size: `${(folder.total_size / 1024 / 1024).toFixed(2)} MB`,
        breakdown: {
          images: folder.image_count,
          documents: folder.document_count,
          videos: folder.video_count
        },
        last_uploaded: folder.last_uploaded
      })),
      recent_files: recentFiles.map((file: any) => ({
        folder: file.folder_name,
        name: file.file_name,
        type: file.file_type,
        uploaded: file.uploaded_at
      }))
    });
  } catch (error) {
    console.error('Failed to get folder organization:', error);
    res.status(500).json({ error: 'Failed to get folder organization' });
  }
});

// POST /api/files/folders - Create a new folder (stub for compatibility)
router.post('/folders', async (req, res) => {
  try {
    // For now, return a simple response since the old system doesn't use folders
    // TODO: Implement proper folder creation with archived_folders table
    res.json({
      success: true,
      message: 'Folder creation is not yet implemented in this version',
      folder: {
        id: Math.random().toString(36).substr(2, 9),
        name: req.body.name,
        parentId: req.body.parentId || null,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to create folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

export default router;
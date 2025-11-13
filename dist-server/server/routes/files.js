"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../shared/schema");
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// removed unused imports
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});
// Serve uploaded files
router.get('/serve/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path_1.default.join(process.cwd(), 'uploads', filename);
        // Security: prevent directory traversal
        if (!filePath.startsWith(path_1.default.join(process.cwd(), 'uploads'))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.sendFile(filePath);
    }
    catch (error) {
        console.error('Error serving file:', error);
        res.status(500).json({ error: 'Failed to serve file' });
    }
});
// GET /api/files - Retrieve digital files with filters
router.get('/', async (req, res) => {
    try {
        const { folder_name, file_type, client_id, session_id, search_term, is_public, limit = '20' } = req.query;
        const baseQuery = db_1.db.select({
            id: schema_1.digitalFiles.id,
            folder_name: schema_1.digitalFiles.folderName,
            file_name: schema_1.digitalFiles.fileName,
            file_type: schema_1.digitalFiles.fileType,
            file_size: schema_1.digitalFiles.fileSize,
            client_id: schema_1.digitalFiles.clientId,
            session_id: schema_1.digitalFiles.sessionId,
            description: schema_1.digitalFiles.description,
            tags: schema_1.digitalFiles.tags,
            is_public: schema_1.digitalFiles.isPublic,
            uploaded_at: schema_1.digitalFiles.uploadedAt,
            created_at: schema_1.digitalFiles.createdAt,
            updated_at: schema_1.digitalFiles.updatedAt
        }).from(schema_1.digitalFiles);
        // Apply filters
        const conditions = [];
        if (folder_name) {
            conditions.push((0, drizzle_orm_1.ilike)(schema_1.digitalFiles.folderName, `%${folder_name}%`));
        }
        if (file_type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.digitalFiles.fileType, file_type));
        }
        if (client_id) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.digitalFiles.clientId, client_id));
        }
        if (session_id) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.digitalFiles.sessionId, session_id));
        }
        if (search_term) {
            // Search in file name and description
            const searchCondition = (0, drizzle_orm_1.like)(schema_1.digitalFiles.fileName, `%${search_term}%`);
            conditions.push(searchCondition);
        }
        if (is_public !== undefined) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.digitalFiles.isPublic, is_public === 'true'));
        }
        const finalQuery = conditions.length > 0
            ? baseQuery.where((0, drizzle_orm_1.and)(...conditions))
            : baseQuery;
        const files = await finalQuery
            .orderBy((0, drizzle_orm_1.desc)(schema_1.digitalFiles.uploadedAt))
            .limit(parseInt(limit));
        // Add thumbnailUrl and mimeType for each file
        const filesWithThumbnails = files.map((file) => {
            const fileExt = path_1.default.extname(file.file_name).toLowerCase();
            const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
            const isImage = file.file_type === 'image' || imageExts.includes(fileExt);
            // Check if thumbnail exists, otherwise fall back to original
            const thumbnailFilename = `${file.id}_thumb.webp`;
            const thumbnailPath = path_1.default.join(process.cwd(), 'uploads', thumbnailFilename);
            const hasThumbnail = fs_1.default.existsSync(thumbnailPath);
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
    }
    catch (error) {
        console.error('Failed to fetch digital files:', error);
        res.status(500).json({ error: 'Failed to fetch digital files' });
    }
});
// POST /api/files - Upload new file
router.post('/', async (req, res) => {
    try {
        const { folder_name, file_name, file_type, file_size, client_id, session_id, description = '', tags = [], is_public = false } = req.body;
        // Validate required fields
        if (!folder_name || !file_name || !file_type || !file_size) {
            return res.status(400).json({
                error: 'Missing required fields: folder_name, file_name, file_type, file_size'
            });
        }
        const fileId = crypto.randomUUID();
        const [newFile] = await db_1.db.insert(schema_1.digitalFiles).values({
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
    }
    catch (error) {
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
            fs_1.default.unlinkSync(req.file.path);
            return res.status(401).json({ error: 'Not authenticated' });
        }
        // Check user's storage subscription and limits
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL);
        const subscriptions = await sql `
      SELECT id, tier, storage_limit, status
      FROM storage_subscriptions
      WHERE user_id = ${userId}
      AND status = 'active'
      LIMIT 1
    `;
        if (subscriptions.length === 0) {
            fs_1.default.unlinkSync(req.file.path);
            return res.status(403).json({ error: 'No active storage subscription' });
        }
        const subscription = subscriptions[0];
        // Check current usage
        const usage = await sql `
      SELECT current_storage_bytes
      FROM storage_usage
      WHERE subscription_id = ${subscription.id}
      LIMIT 1
    `;
        const currentBytes = usage.length > 0 ? Number(usage[0].current_storage_bytes) : 0;
        const limitBytes = Number(subscription.storage_limit);
        const fileSize = req.file.size;
        if (currentBytes + fileSize > limitBytes) {
            fs_1.default.unlinkSync(req.file.path);
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
        const fileExt = path_1.default.extname(req.file.originalname);
        const newFilename = `${fileId}${fileExt}`;
        const newPath = path_1.default.join(path_1.default.dirname(req.file.path), newFilename);
        fs_1.default.renameSync(req.file.path, newPath);
        // Generate compressed thumbnail for images (300x300, quality 80)
        let thumbnailUrl;
        if (req.file.mimetype.startsWith('image/')) {
            try {
                const thumbnailFilename = `${fileId}_thumb.webp`;
                const thumbnailPath = path_1.default.join(path_1.default.dirname(newPath), thumbnailFilename);
                await (0, sharp_1.default)(newPath)
                    .resize(300, 300, {
                    fit: 'cover',
                    position: 'center'
                })
                    .webp({ quality: 80 })
                    .toFile(thumbnailPath);
                thumbnailUrl = `/api/files/serve/${thumbnailFilename}`;
                console.log(`✅ Generated thumbnail for ${req.file.originalname}`);
            }
            catch (error) {
                console.error('Failed to generate thumbnail:', error);
                // Fallback to original image if thumbnail generation fails
                thumbnailUrl = `/api/files/serve/${newFilename}`;
            }
        }
        const [newFile] = await db_1.db.insert(schema_1.digitalFiles).values({
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
            await sql `
        UPDATE storage_usage
        SET current_storage_bytes = current_storage_bytes + ${fileSize},
            file_count = file_count + 1
        WHERE subscription_id = ${subscription.id}
      `;
        }
        else {
            await sql `
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
    }
    catch (error) {
        console.error('Failed to upload file:', error);
        if (req.file) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch (e) {
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
        const [updatedFile] = await db_1.db
            .update(schema_1.digitalFiles)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.digitalFiles.id, id))
            .returning();
        if (!updatedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json(updatedFile);
    }
    catch (error) {
        console.error('Failed to update file:', error);
        res.status(500).json({ error: 'Failed to update file' });
    }
});
// GET /api/files/:id/download - Download original file
router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        // Get file metadata from database
        const [file] = await db_1.db.select()
            .from(schema_1.digitalFiles)
            .where((0, drizzle_orm_1.eq)(schema_1.digitalFiles.id, id))
            .limit(1);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        // Construct original filename (not thumbnail)
        const fileExt = path_1.default.extname(file.fileName);
        const originalFilename = `${id}${fileExt}`;
        const downloadUrl = `/api/files/serve/${originalFilename}`;
        res.json({ downloadUrl });
    }
    catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({ error: 'Failed to get download URL' });
    }
});
// DELETE /api/files/:id - Delete file
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [deletedFile] = await db_1.db
            .delete(schema_1.digitalFiles)
            .where((0, drizzle_orm_1.eq)(schema_1.digitalFiles.id, id))
            .returning();
        if (!deletedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json({
            message: 'File deleted successfully',
            file: deletedFile
        });
    }
    catch (error) {
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
        const sql = neon(process.env.DATABASE_URL);
        // Check if user has a storage subscription
        const subscriptions = await sql `
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
        const usage = await sql `
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
    }
    catch (error) {
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
        const sql = neon(process.env.DATABASE_URL);
        const folders = await sql(folderStatsQuery, values);
        // Get recent files
        const recentFiles = await sql `
      SELECT folder_name, file_name, file_type, uploaded_at
      FROM digital_files
      ORDER BY uploaded_at DESC
      LIMIT 10
    `;
        res.json({
            total_folders: folders.length,
            folders: folders.map((folder) => ({
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
            recent_files: recentFiles.map((file) => ({
                folder: file.folder_name,
                name: file.file_name,
                type: file.file_type,
                uploaded: file.uploaded_at
            }))
        });
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Failed to create folder:', error);
        res.status(500).json({ error: 'Failed to create folder' });
    }
});
exports.default = router;

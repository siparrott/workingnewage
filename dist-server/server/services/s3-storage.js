"use strict";
/**
 * AWS S3 Storage Service
 * Handles file uploads, downloads, and management in Amazon S3
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = void 0;
exports.uploadFile = uploadFile;
exports.getPresignedDownloadUrl = getPresignedDownloadUrl;
exports.deleteFile = deleteFile;
exports.getFileMetadata = getFileMetadata;
exports.listFiles = listFiles;
exports.copyFile = copyFile;
exports.calculateStorageUsed = calculateStorageUsed;
exports.uploadLargeFile = uploadLargeFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
// Initialize S3 Client (compatible with AWS S3 and Backblaze B2)
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    // Support for Backblaze B2 S3-compatible API
    endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: process.env.AWS_S3_ENDPOINT ? true : false, // Required for B2
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET || '';
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL;
/**
 * Upload a file to S3
 */
async function uploadFile(file, originalName, mimeType, subscriptionId, folderId) {
    const fileExtension = path_1.default.extname(originalName);
    const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
    // Construct S3 key with folder structure
    const folderPath = folderId ? `${subscriptionId}/${folderId}` : subscriptionId;
    const key = `uploads/${folderPath}/${fileName}`;
    // Upload to S3
    const command = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: mimeType,
        // Set ACL to private - files are accessed via presigned URLs
        ACL: 'private',
        Metadata: {
            originalName,
            subscriptionId,
            ...(folderId && { folderId }),
        },
    });
    await s3Client.send(command);
    // Get file URL
    const url = getFileUrl(key);
    // Create thumbnail for images
    let thumbnailKey;
    let thumbnailUrl;
    if (mimeType.startsWith('image/')) {
        const thumbnailResult = await createThumbnail(file, key, mimeType);
        thumbnailKey = thumbnailResult.key;
        thumbnailUrl = thumbnailResult.url;
    }
    return {
        key,
        url,
        size: file.length,
        mimeType,
        thumbnailKey,
        thumbnailUrl,
    };
}
/**
 * Create thumbnail for image
 */
async function createThumbnail(imageBuffer, originalKey, mimeType) {
    try {
        // Generate thumbnail (300x300)
        const thumbnailBuffer = await (0, sharp_1.default)(imageBuffer)
            .resize(300, 300, {
            fit: 'cover',
            position: 'center',
        })
            .jpeg({ quality: 80 })
            .toBuffer();
        const thumbnailKey = originalKey.replace('/uploads/', '/thumbnails/').replace(path_1.default.extname(originalKey), '.jpg');
        const command = new client_s3_1.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: thumbnailKey,
            Body: thumbnailBuffer,
            ContentType: 'image/jpeg',
            ACL: 'private',
        });
        await s3Client.send(command);
        return {
            key: thumbnailKey,
            url: getFileUrl(thumbnailKey),
        };
    }
    catch (error) {
        console.error('Error creating thumbnail:', error);
        // Return original if thumbnail creation fails
        return {
            key: originalKey,
            url: getFileUrl(originalKey),
        };
    }
}
/**
 * Get file URL (CloudFront or S3 direct)
 */
function getFileUrl(key) {
    if (CLOUDFRONT_URL) {
        return `${CLOUDFRONT_URL}/${key}`;
    }
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
/**
 * Generate presigned URL for secure file download
 */
async function getPresignedDownloadUrl(key, expiresIn = 3600) {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
    return url;
}
/**
 * Delete a file from S3
 */
async function deleteFile(key) {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    await s3Client.send(command);
    // Also delete thumbnail if exists
    const thumbnailKey = key.replace('/uploads/', '/thumbnails/').replace(path_1.default.extname(key), '.jpg');
    try {
        const thumbnailCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: thumbnailKey,
        });
        await s3Client.send(thumbnailCommand);
    }
    catch (error) {
        // Thumbnail might not exist, that's okay
        console.log('No thumbnail to delete or error deleting thumbnail:', error);
    }
}
/**
 * Get file metadata from S3
 */
async function getFileMetadata(key) {
    const command = new client_s3_1.HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    const response = await s3Client.send(command);
    return {
        size: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata,
    };
}
/**
 * List files in a folder
 */
async function listFiles(subscriptionId, folderId) {
    const prefix = folderId
        ? `uploads/${subscriptionId}/${folderId}/`
        : `uploads/${subscriptionId}/`;
    const command = new client_s3_1.ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 1000,
    });
    const response = await s3Client.send(command);
    return response.Contents || [];
}
/**
 * Copy file (used for gallery transfers)
 */
async function copyFile(sourceKey, destinationSubscriptionId, destinationFolderId) {
    // Download source file
    const getCommand = new client_s3_1.GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: sourceKey,
    });
    const { Body, ContentType } = await s3Client.send(getCommand);
    if (!Body) {
        throw new Error('Failed to download source file');
    }
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of Body) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    // Upload to destination
    const fileExtension = path_1.default.extname(sourceKey);
    const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
    const folderPath = destinationFolderId
        ? `${destinationSubscriptionId}/${destinationFolderId}`
        : destinationSubscriptionId;
    const destinationKey = `uploads/${folderPath}/${fileName}`;
    const putCommand = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: destinationKey,
        Body: buffer,
        ContentType: ContentType || 'application/octet-stream',
        ACL: 'private',
        Metadata: {
            copiedFrom: sourceKey,
            destinationSubscriptionId,
        },
    });
    await s3Client.send(putCommand);
    return destinationKey;
}
/**
 * Calculate total storage used by subscription
 */
async function calculateStorageUsed(subscriptionId) {
    let totalSize = 0;
    let continuationToken;
    do {
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: `uploads/${subscriptionId}/`,
            MaxKeys: 1000,
            ContinuationToken: continuationToken,
        });
        const response = await s3Client.send(command);
        if (response.Contents) {
            totalSize += response.Contents.reduce((sum, obj) => sum + (obj.Size || 0), 0);
        }
        continuationToken = response.NextContinuationToken;
    } while (continuationToken);
    return totalSize;
}
/**
 * Multipart upload for large files (>100MB)
 */
async function uploadLargeFile(file, originalName, mimeType, subscriptionId, folderId, onProgress) {
    // For files smaller than 100MB, use regular upload
    if (file.length < 100 * 1024 * 1024) {
        return uploadFile(file, originalName, mimeType, subscriptionId, folderId);
    }
    // TODO: Implement multipart upload for large files
    // This is a placeholder - full implementation requires chunking and CreateMultipartUpload API
    console.log('Large file upload - using standard upload for now');
    return uploadFile(file, originalName, mimeType, subscriptionId, folderId);
}
exports.s3Service = {
    uploadFile,
    getPresignedDownloadUrl,
    deleteFile,
    getFileMetadata,
    listFiles,
    copyFile,
    calculateStorageUsed,
    uploadLargeFile,
};

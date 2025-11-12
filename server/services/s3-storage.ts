/**
 * AWS S3 Storage Service
 * Handles file uploads, downloads, and management in Amazon S3
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import sharp from 'sharp';

// Initialize S3 Client (compatible with AWS S3 and Backblaze B2)
const s3Client = new S3Client({
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

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnailKey?: string;
  thumbnailUrl?: string;
}

/**
 * Upload a file to S3
 */
export async function uploadFile(
  file: Buffer,
  originalName: string,
  mimeType: string,
  subscriptionId: string,
  folderId?: string
): Promise<UploadResult> {
  const fileExtension = path.extname(originalName);
  const fileName = `${uuidv4()}${fileExtension}`;
  
  // Construct S3 key with folder structure
  const folderPath = folderId ? `${subscriptionId}/${folderId}` : subscriptionId;
  const key = `uploads/${folderPath}/${fileName}`;

  // Upload to S3
  const command = new PutObjectCommand({
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
  let thumbnailKey: string | undefined;
  let thumbnailUrl: string | undefined;

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
async function createThumbnail(
  imageBuffer: Buffer,
  originalKey: string,
  mimeType: string
): Promise<{ key: string; url: string }> {
  try {
    // Generate thumbnail (300x300)
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailKey = originalKey.replace('/uploads/', '/thumbnails/').replace(path.extname(originalKey), '.jpg');

    const command = new PutObjectCommand({
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
  } catch (error) {
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
function getFileUrl(key: string): string {
  if (CLOUDFRONT_URL) {
    return `${CLOUDFRONT_URL}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Generate presigned URL for secure file download
 */
export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);

  // Also delete thumbnail if exists
  const thumbnailKey = key.replace('/uploads/', '/thumbnails/').replace(path.extname(key), '.jpg');
  try {
    const thumbnailCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: thumbnailKey,
    });
    await s3Client.send(thumbnailCommand);
  } catch (error) {
    // Thumbnail might not exist, that's okay
    console.log('No thumbnail to delete or error deleting thumbnail:', error);
  }
}

/**
 * Get file metadata from S3
 */
export async function getFileMetadata(key: string) {
  const command = new HeadObjectCommand({
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
export async function listFiles(subscriptionId: string, folderId?: string) {
  const prefix = folderId 
    ? `uploads/${subscriptionId}/${folderId}/`
    : `uploads/${subscriptionId}/`;

  const command = new ListObjectsV2Command({
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
export async function copyFile(
  sourceKey: string,
  destinationSubscriptionId: string,
  destinationFolderId?: string
): Promise<string> {
  // Download source file
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: sourceKey,
  });

  const { Body, ContentType } = await s3Client.send(getCommand);
  
  if (!Body) {
    throw new Error('Failed to download source file');
  }

  // Convert stream to buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of Body as any) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // Upload to destination
  const fileExtension = path.extname(sourceKey);
  const fileName = `${uuidv4()}${fileExtension}`;
  const folderPath = destinationFolderId 
    ? `${destinationSubscriptionId}/${destinationFolderId}`
    : destinationSubscriptionId;
  const destinationKey = `uploads/${folderPath}/${fileName}`;

  const putCommand = new PutObjectCommand({
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
export async function calculateStorageUsed(subscriptionId: string): Promise<number> {
  let totalSize = 0;
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
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
export async function uploadLargeFile(
  file: Buffer,
  originalName: string,
  mimeType: string,
  subscriptionId: string,
  folderId?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  // For files smaller than 100MB, use regular upload
  if (file.length < 100 * 1024 * 1024) {
    return uploadFile(file, originalName, mimeType, subscriptionId, folderId);
  }

  // TODO: Implement multipart upload for large files
  // This is a placeholder - full implementation requires chunking and CreateMultipartUpload API
  console.log('Large file upload - using standard upload for now');
  return uploadFile(file, originalName, mimeType, subscriptionId, folderId);
}

export const s3Service = {
  uploadFile,
  getPresignedDownloadUrl,
  deleteFile,
  getFileMetadata,
  listFiles,
  copyFile,
  calculateStorageUsed,
  uploadLargeFile,
};

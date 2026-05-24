import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
    region: process.env.AWS_REGION ?? 'eu-central-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.S3_BUCKET_NAME!;

export async function createPresignedPutUrl(
    fileType: 'pdf' | 'docx',
    fileSizeBytes: number,
): Promise<{ presignedUrl: string; s3Key: string }> {
    const contentType =
        fileType === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const s3Key = `documents/${randomUUID()}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        ContentType: contentType,
        ContentLength: fileSizeBytes,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return { presignedUrl, s3Key };
}

export async function createPresignedGetUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: s3Key });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
}

export async function deleteS3Object(s3Key: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key }));
}

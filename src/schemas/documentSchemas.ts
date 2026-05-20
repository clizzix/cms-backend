import { z } from 'zod';

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Ungültige ID');

export const fileTypeSchema = z.enum(['pdf', 'docx']);

export const createDocumentSchema = z.object({
    clientId: objectId,
    fileName: z.string().min(1, 'Dateiname wird benötigt'),
    fileType: fileTypeSchema.default('pdf'),
    fileSizeBytes: z.number().int().nonnegative(),
    s3Key: z.string().min(1),
    presignedUrl: z.string().url().optional(),
    description: z.string().optional(),
});

export const updateDocumentSchema = z
    .object({
        fileName: z.string().min(1).optional(),
        description: z.string().optional(),
    })
    .strict();

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

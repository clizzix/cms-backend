import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Ungültige ID');

export const fileTypeSchema = z.enum(['pdf', 'docx']);

// Frontend → Backend: "Ich will eine Datei hochladen"
// s3Key + presignedUrl werden server-seitig generiert, kommen nie vom Client
export const uploadUrlSchema = z.object({
    clientId: objectId,
    fileName: z.string().min(1, 'Dateiname wird benötigt'),
    fileType: fileTypeSchema,
    fileSizeBytes: z
        .number()
        .int()
        .positive()
        .max(10 * 1024 * 1024, 'Datei darf maximal 10 MB groß sein'),
    description: z.string().max(500).optional(),
});

// Metadaten-Update (Name, Beschreibung)
export const updateDocumentSchema = z
    .object({
        fileName: z.string().min(1).optional(),
        description: z.string().optional(),
    })
    .strict();

export type UploadUrlInput = z.infer<typeof uploadUrlSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

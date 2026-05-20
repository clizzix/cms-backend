import mongoose, { Document, Types, Schema } from 'mongoose';

export type FileType = 'pdf' | 'docx';

export interface IDocument extends Document {
    clientId: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    fileName: string;
    fileType: FileType;
    fileSizeBytes: number;
    s3Key: string;
    presignedUrl: string;
    description?: string;
}

const DocumentSchema = new Schema<IDocument>(
    {
        clientId: { type: Types.ObjectId, ref: 'Client' },
        uploadedBy: { type: Types.ObjectId, ref: 'User' },
        fileName: { type: String, required: true },
        fileType: { type: String, enum: ['pdf', 'docx'], default: 'pdf' },
        fileSizeBytes: { type: Number },
        s3Key: { type: String },
        presignedUrl: { type: String },
        description: { type: String },
    },
    { timestamps: true },
);

export default mongoose.model<IDocument>('Document', DocumentSchema);

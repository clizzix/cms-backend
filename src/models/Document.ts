import mongoose, { Document, Types, Schema } from 'mongoose';

export type FileType = 'pdf' | 'docx';

export interface IDocument extends Document {
    clientId: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    fileName: string;
    fileType: FileType;
    fileSizeBytes: number;
    s3Key: string;
    description?: string;
    confirmed: boolean;
    createdAt: Date;
}

const documentSchema = new Schema<IDocument>(
    {
        clientId: { type: Types.ObjectId, ref: 'Client' },
        uploadedBy: { type: Types.ObjectId, ref: 'User' },
        fileName: { type: String, required: true },
        fileType: { type: String, enum: ['pdf', 'docx'], default: 'pdf' },
        fileSizeBytes: { type: Number, required: true },
        s3Key: { type: String, required: true, unique: true },
        description: { type: String },
        confirmed: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.model<IDocument>('Document', documentSchema);

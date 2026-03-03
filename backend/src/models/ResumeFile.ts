import mongoose, { Schema, Document } from 'mongoose'

export interface IResumeFile extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  filename: string
  publicId: string
  url: string
  secureUrl?: string
  format: string
  mimeType: string
  size: number
  resourceType: string
  createdAt: Date
}

const ResumeFileSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'Resume' },
  filename: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  secureUrl: { type: String },
  format: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  resourceType: { type: String, default: 'raw' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IResumeFile>('ResumeFile', ResumeFileSchema)
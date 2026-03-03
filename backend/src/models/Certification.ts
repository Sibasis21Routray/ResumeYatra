import mongoose, { Schema, Document } from 'mongoose'

export interface ICertification extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  name: string
  issuer?: string
  date?: string
  url?: string
  createdAt: Date
}

const CertificationSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  name: { type: String, required: true },
  issuer: { type: String },
  date: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<ICertification>('Certification', CertificationSchema)
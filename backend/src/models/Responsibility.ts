import mongoose, { Schema, Document } from 'mongoose'

export interface IResponsibility extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  description: string
  createdAt: Date
}

const ResponsibilitySchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IResponsibility>('Responsibility', ResponsibilitySchema)
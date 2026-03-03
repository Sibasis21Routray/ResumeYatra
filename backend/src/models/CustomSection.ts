import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomSection extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  title: string
  isVisible: boolean
  order: number
  entries: mongoose.Types.ObjectId[]
  createdAt: Date
}

const CustomSectionSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  title: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  entries: [{ type: Schema.Types.ObjectId, ref: 'CustomSectionEntry' }],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<ICustomSection>('CustomSection', CustomSectionSchema)
import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomSectionEntry extends Document {
  _id: mongoose.Types.ObjectId
  customSectionId: mongoose.Types.ObjectId
  title?: string
  organization?: string
  date?: string
  description?: string
  order: number
  createdAt: Date
}

const CustomSectionEntrySchema: Schema = new Schema({
  customSectionId: { type: Schema.Types.ObjectId, required: true, ref: 'CustomSection' },
  title: { type: String },
  organization: { type: String },
  date: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<ICustomSectionEntry>('CustomSectionEntry', CustomSectionEntrySchema)
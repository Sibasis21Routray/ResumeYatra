import mongoose, { Schema, Document } from 'mongoose'

export interface IResume extends Document {
  _id: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  title: string
  candidateName?: string
  template: string
  createdAt: Date
  updatedAt: Date
  versions: mongoose.Types.ObjectId[]
  files: mongoose.Types.ObjectId[]
}

const ResumeSchema: Schema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  candidateName: { type: String },
  template: { type: String, default: 'modern' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  versions: [{ type: Schema.Types.ObjectId, ref: 'ResumeVersion' }],
  files: [{ type: Schema.Types.ObjectId, ref: 'ResumeFile' }]
})

export default mongoose.model<IResume>('Resume', ResumeSchema)
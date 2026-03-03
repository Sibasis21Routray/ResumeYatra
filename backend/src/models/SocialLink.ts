import mongoose, { Schema, Document } from 'mongoose'

export interface ISocialLink extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  resumeVersion: mongoose.Types.ObjectId
  text: string
  url: string
  createdAt: Date
  updatedAt: Date
}

const SocialLinkSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  resumeVersion: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  text: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model<ISocialLink>('SocialLink', SocialLinkSchema)
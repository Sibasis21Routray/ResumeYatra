import mongoose, { Schema, Document } from 'mongoose'

export interface IResume extends Document {
  _id: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId | null
  guestId?: string
  isDownloadPaid: boolean
  isAiPaid: boolean
  isParsed: boolean
  isAiEnhanced: boolean
  isDownloaded: boolean
  title: string
  candidateName?: string
  template: string
  createdAt: Date
  updatedAt: Date
  versions: mongoose.Types.ObjectId[]
  files: mongoose.Types.ObjectId[]
}

const ResumeSchema: Schema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  guestId: { type: String, index: true },

  //  PAYMENT FIELDS
  isDownloadPaid: { type: Boolean, default: false },
  isAiPaid: { type: Boolean, default: false },

  isParsed: { type: Boolean, default: false },

  // AI ENHANCEMENT TRACKING
  isAiEnhanced: { type: Boolean, default: false },
  isDownloaded: { type: Boolean, default: false },

  title: { type: String, required: true },
  candidateName: { type: String },
  template: { type: String, default: 'modern' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  versions: [{ type: Schema.Types.ObjectId, ref: 'ResumeVersion' }],
  files: [{ type: Schema.Types.ObjectId, ref: 'ResumeFile' }]
})

export default mongoose.model<IResume>('Resume', ResumeSchema)
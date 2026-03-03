import mongoose, { Schema, Document } from 'mongoose'

export interface IKeyAchievement extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  description: string
  createdAt: Date
}

const KeyAchievementSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IKeyAchievement>('KeyAchievement', KeyAchievementSchema)
import mongoose, { Schema, Document } from 'mongoose'

export interface IHobby extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  name: string
  description?: string
  createdAt: Date
}

const HobbySchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IHobby>('Hobby', HobbySchema)
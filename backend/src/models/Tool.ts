import mongoose, { Schema, Document } from 'mongoose'

export interface ITool extends Document {
  _id: mongoose.Types.ObjectId
  resumeId: mongoose.Types.ObjectId
  name: string
  createdAt: Date
}

const ToolSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'ResumeVersion' },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<ITool>('Tool', ToolSchema)
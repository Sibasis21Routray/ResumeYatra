import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  name?: string
  password: string
  role: string
  createdAt: Date
  resumes: mongoose.Types.ObjectId[]
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  resumes: [{ type: Schema.Types.ObjectId, ref: 'Resume' }]
})

export default mongoose.model<IUser>('User', UserSchema)
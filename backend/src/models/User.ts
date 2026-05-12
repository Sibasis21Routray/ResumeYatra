import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  name?: string
  password: string
  role: string
  subscriptionPlan: string
  subscriptionExpiry?: Date
  createdAt: Date
  resumes: mongoose.Types.ObjectId[]
  autoPay: boolean
  razorpaySubscriptionId?: string
  mobile?: string
  state?: string
  city?: string
  pin?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  subscriptionPlan: { type: String, enum: ['none', 'candidate', 'freelancer'], default: 'none' },
  subscriptionExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
  resumes: [{ type: Schema.Types.ObjectId, ref: 'Resume' }],
  autoPay: { type: Boolean, default: false },
  razorpaySubscriptionId: { type: String },
  mobile: { type: String },
  state: { type: String },
  city: { type: String },
  pin: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

})

export default mongoose.model<IUser>('User', UserSchema)
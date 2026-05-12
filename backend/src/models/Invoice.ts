import mongoose, { Schema, Document } from 'mongoose'

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId
  invoiceNumber: string
  userId?: mongoose.Types.ObjectId
  resumeId?: mongoose.Types.ObjectId
  type: 'download' | 'ai' | 'subscription_freelancer' | 'subscription_candidate'
  amount: number
  currency: string
  paymentId: string
  orderId?: string
  status: 'paid' | 'pending' | 'failed'
  userDetails: {
    name: string
    email: string
    address?: string
    phone?: string
  }
  pdfUrl?: string
  createdAt: Date
}

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentId: { type: String, required: true },
  orderId: { type: String },
  status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  userDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    phone: { type: String }
  },
  pdfUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema)

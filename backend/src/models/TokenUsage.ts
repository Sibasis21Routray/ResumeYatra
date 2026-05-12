import mongoose, { Schema, Document } from 'mongoose';

export interface ITokenUsage extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  aiModel: string;
  action: string;
  createdAt: Date;
}

const TokenUsageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  guestId: { type: String, required: false },
  promptTokens: { type: Number, required: true },
  completionTokens: { type: Number, required: true },
  totalTokens: { type: Number, required: true },
  aiModel: { type: String, required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITokenUsage>('TokenUsage', TokenUsageSchema);

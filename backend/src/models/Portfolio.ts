import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  category?: string;
  createdAt: Date;
}

const PortfolioSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  imageUrl: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

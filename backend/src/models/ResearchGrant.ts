import mongoose, { Schema, Document } from "mongoose";

export interface IResearchGrant extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  agency: string;
  amount?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  role?: string;
  createdAt: Date;
}

const ResearchGrantSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  agency: { type: String, required: true },
  amount: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  role: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResearchGrant>(
  "ResearchGrant",
  ResearchGrantSchema
);

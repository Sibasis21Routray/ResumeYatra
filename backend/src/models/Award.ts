import mongoose, { Schema, Document } from "mongoose";

export interface IAward extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  organization?: string;
  issueYear?: string;
  description?: string;
  createdAt: Date;
}

const AwardSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  organization: { type: String },
  issueYear: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAward>("Award", AwardSchema);

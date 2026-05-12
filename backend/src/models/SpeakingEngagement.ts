import mongoose, { Schema, Document } from "mongoose";

export interface ISpeakingEngagement extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  topic: string;
  eventName: string;
  organization?: string;
  date?: string;
  location?: string;
  description?: string;
  url?: string;
  createdAt: Date;
}

const SpeakingEngagementSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  topic: { type: String, required: true },
  eventName: { type: String, required: true },
  organization: { type: String },
  date: { type: String },
  location: { type: String },
  description: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISpeakingEngagement>(
  "SpeakingEngagement",
  SpeakingEngagementSchema
);

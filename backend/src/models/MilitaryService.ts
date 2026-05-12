import mongoose, { Schema, Document } from "mongoose";

export interface IMilitaryService extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  branch: string;
  rank?: string;
  unit?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string;
  honors?: string;
  createdAt: Date;
}

const MilitaryServiceSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  branch: { type: String, required: true },
  rank: { type: String },
  unit: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  location: { type: String },
  description: { type: String },
  achievements: { type: String },
  honors: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMilitaryService>(
  "MilitaryService",
  MilitaryServiceSchema
);

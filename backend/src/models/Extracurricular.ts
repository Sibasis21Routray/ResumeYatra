import mongoose, { Schema, Document } from "mongoose";

export interface IExtracurricular extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  activity: string;
  role?: string;
  organization?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string;
  createdAt: Date;
}

const ExtracurricularSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  activity: { type: String, required: true },
  role: { type: String },
  organization: { type: String },
  year: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  achievements: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IExtracurricular>(
  "Extracurricular",
  ExtracurricularSchema
);

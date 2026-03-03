import mongoose, { Schema, Document } from "mongoose";

export interface IInternship extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string;
  createdAt: Date;
}

const InternshipSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  achievements: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInternship>("Internship", InternshipSchema);

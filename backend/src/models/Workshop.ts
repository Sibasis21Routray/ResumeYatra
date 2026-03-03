import mongoose, { Schema, Document } from "mongoose";

export interface IWorkshop extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  instructor?: string;
  organization: string;
  date?: string;
  location?: string;
  description?: string;
  certificateUrl?: string;
  createdAt: Date;
}

const WorkshopSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  instructor: { type: String },
  organization: { type: String },
  date: { type: String },
  location: { type: String },
  description: { type: String },
  certificateUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWorkshop>("Workshop", WorkshopSchema);

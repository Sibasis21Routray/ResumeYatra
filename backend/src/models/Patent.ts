import mongoose, { Schema, Document } from "mongoose";

export interface IPatent extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  inventors?: string;
  patentNumber?: string;
  filingDate?: string;
  issueDate?: string;
  status?: string;
  description?: string;
  url?: string;
  createdAt: Date;
}

const PatentSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  inventors: { type: String },
  patentNumber: { type: String },
  filingDate: { type: String },
  issueDate: { type: String },
  status: { type: String },
  description: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPatent>("Patent", PatentSchema);

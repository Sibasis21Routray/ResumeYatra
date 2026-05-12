import mongoose, { Schema, Document } from "mongoose";

export interface IScholarship extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  provider?: string;
  year?: string;
  amount?: string;
  description?: string;
  createdAt: Date;
}

const ScholarshipSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  provider: { type: String },
  year: { type: String },
  amount: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IScholarship>("Scholarship", ScholarshipSchema);

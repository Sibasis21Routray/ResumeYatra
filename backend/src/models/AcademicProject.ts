import mongoose, { Schema, Document } from "mongoose";

export interface IAcademicProject extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  course?: string;
  institution?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  technologies?: string[];
  url?: string;
  createdAt: Date;
}

const AcademicProjectSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  course: { type: String },
  institution: { type: String },
  duration: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  technologies: [{ type: String }],
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAcademicProject>(
  "AcademicProject",
  AcademicProjectSchema
);

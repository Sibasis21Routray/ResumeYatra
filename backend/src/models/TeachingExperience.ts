import mongoose, { Schema, Document } from "mongoose";

export interface ITeachingExperience extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  institution: string;
  course?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string;
  createdAt: Date;
}

const TeachingExperienceSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  institution: { type: String, required: true },
  course: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  location: { type: String },
  description: { type: String },
  achievements: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITeachingExperience>(
  "TeachingExperience",
  TeachingExperienceSchema
);

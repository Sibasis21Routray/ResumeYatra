import mongoose, { Schema, Document } from "mongoose";

export interface IMentorshipExperience extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  menteeName?: string;
  menteeCount?: number;
  program?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string;
  createdAt: Date;
}

const MentorshipExperienceSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  menteeName: { type: String },
  menteeCount: { type: Number },
  program: { type: String },
  organization: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  achievements: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMentorshipExperience>(
  "MentorshipExperience",
  MentorshipExperienceSchema
);

import mongoose, { Schema, Document } from "mongoose";

export interface IIndustryExpertise extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  industry: string;
  yearsOfExperience?: number;
  keySkills?: string[];
  achievements?: string;
  createdAt: Date;
}

const IndustryExpertiseSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  industry: { type: String, required: true },
  yearsOfExperience: { type: Number },
  keySkills: [{ type: String }],
  achievements: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IIndustryExpertise>(
  "IndustryExpertise",
  IndustryExpertiseSchema
);

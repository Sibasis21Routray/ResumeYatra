import mongoose, { Schema, Document } from "mongoose";

export interface IProfessionalContext extends Document {
  resumeVersion?: mongoose.Types.ObjectId;
  totalExperience?: string;
  teamSize?: string;
  industry?: string;
  industryCustom?: string;
  functionalDomain?: string;
  functionalDomainCustom?: string;
  geographicScope?: string;
  revenueResponsibility?: string;
}

const ProfessionalContextSchema: Schema = new Schema({
  resumeVersion: { type: mongoose.Schema.Types.ObjectId, ref: "ResumeVersion", unique: true },
  totalExperience: { type: String },
  teamSize: { type: String },
  industry: { type: String },
  industryCustom: { type: String },
  functionalDomain: { type: String },
  functionalDomainCustom: { type: String },
  geographicScope: { type: String },
  revenueResponsibility: { type: String },
});

export default mongoose.model<IProfessionalContext>(
  "ProfessionalContext",
  ProfessionalContextSchema
);

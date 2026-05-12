import mongoose, { Schema, Document } from "mongoose";

export interface IResumeVersion extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  data: any;
  createdAt: Date;
  note?: string;
  languages: mongoose.Types.ObjectId[];
  hobbies: mongoose.Types.ObjectId[];
  certifications: mongoose.Types.ObjectId[];
  awards: mongoose.Types.ObjectId[];
  speakingEngagements: mongoose.Types.ObjectId[];
  memberships: mongoose.Types.ObjectId[];
  workshops: mongoose.Types.ObjectId[];
  keyAchievements: mongoose.Types.ObjectId[];
  responsibilities: mongoose.Types.ObjectId[];
  tools: mongoose.Types.ObjectId[];
  customSections: mongoose.Types.ObjectId[];
  // New sections
  clientProjects: mongoose.Types.ObjectId[];
  portfolio: mongoose.Types.ObjectId[];
  volunteering: mongoose.Types.ObjectId[];
  militaryService: mongoose.Types.ObjectId[];
  toolTechnologies: mongoose.Types.ObjectId[];
  methodologies: mongoose.Types.ObjectId[];
  industryExpertise: mongoose.Types.ObjectId[];
  references: mongoose.Types.ObjectId[];
  socialProfiles: mongoose.Types.ObjectId[];
  availabilityWorkAuth: mongoose.Types.ObjectId[];
  internships: mongoose.Types.ObjectId[];
  academicProjects: mongoose.Types.ObjectId[];
  leadershipPositions: mongoose.Types.ObjectId[];
  trainingPrograms: mongoose.Types.ObjectId[];
  scholarships: mongoose.Types.ObjectId[];
  coCurricular: mongoose.Types.ObjectId[];
  extracurricular: mongoose.Types.ObjectId[];
  careerObjective: mongoose.Types.ObjectId[];
  teachingExperience: mongoose.Types.ObjectId[];
  mentorshipExperience: mongoose.Types.ObjectId[];
  researchGrants: mongoose.Types.ObjectId[];
  testScores: mongoose.Types.ObjectId[];
  publications: mongoose.Types.ObjectId[];
  patents: mongoose.Types.ObjectId[];
  professionalContext: mongoose.Types.ObjectId[];
}

const ResumeVersionSchema: Schema = new Schema({
  resumeId: { type: Schema.Types.ObjectId, required: true, ref: "Resume" },
  data: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  note: { type: String },
  languages: [{ type: Schema.Types.ObjectId, ref: "Language" }],
  hobbies: [{ type: Schema.Types.ObjectId, ref: "Hobby" }],
  certifications: [{ type: Schema.Types.ObjectId, ref: "Certification" }],
  awards: [{ type: Schema.Types.ObjectId, ref: "Award" }],
  speakingEngagements: [
    { type: Schema.Types.ObjectId, ref: "SpeakingEngagement" },
  ],
  memberships: [{ type: Schema.Types.ObjectId, ref: "Membership" }],
  workshops: [{ type: Schema.Types.ObjectId, ref: "Workshop" }],
  keyAchievements: [{ type: Schema.Types.ObjectId, ref: "KeyAchievement" }],
  responsibilities: [{ type: Schema.Types.ObjectId, ref: "Responsibility" }],
  tools: [{ type: Schema.Types.ObjectId, ref: "Tool" }],
  customSections: [{ type: Schema.Types.ObjectId, ref: "CustomSection" }],
  // New sections
  clientProjects: [{ type: Schema.Types.ObjectId, ref: "ClientProject" }],
  portfolio: [{ type: Schema.Types.ObjectId, ref: "Portfolio" }],
  volunteering: [{ type: Schema.Types.ObjectId, ref: "Volunteering" }],
  militaryService: [{ type: Schema.Types.ObjectId, ref: "MilitaryService" }],
  toolTechnologies: [{ type: Schema.Types.ObjectId, ref: "ToolTechnology" }],
  methodologies: [{ type: Schema.Types.ObjectId, ref: "Methodology" }],
  industryExpertise: [
    { type: Schema.Types.ObjectId, ref: "IndustryExpertise" },
  ],
  references: [{ type: Schema.Types.ObjectId, ref: "Reference" }],
  socialProfiles: [{ type: Schema.Types.ObjectId, ref: "SocialProfile" }],
  availabilityWorkAuth: [
    { type: Schema.Types.ObjectId, ref: "AvailabilityWorkAuth" },
  ],
  internships: [{ type: Schema.Types.ObjectId, ref: "Internship" }],
  academicProjects: [{ type: Schema.Types.ObjectId, ref: "AcademicProject" }],
  leadershipPositions: [
    { type: Schema.Types.ObjectId, ref: "LeadershipPosition" },
  ],
  trainingPrograms: [{ type: Schema.Types.ObjectId, ref: "TrainingProgram" }],
  scholarships: [{ type: Schema.Types.ObjectId, ref: "Scholarship" }],
  coCurricular: [{ type: Schema.Types.ObjectId, ref: "CoCurricular" }],
  extracurricular: [{ type: Schema.Types.ObjectId, ref: "Extracurricular" }],
  careerObjective: [{ type: Schema.Types.ObjectId, ref: "CareerObjective" }],
  teachingExperience: [
    { type: Schema.Types.ObjectId, ref: "TeachingExperience" },
  ],
  mentorshipExperience: [
    { type: Schema.Types.ObjectId, ref: "MentorshipExperience" },
  ],
  researchGrants: [{ type: Schema.Types.ObjectId, ref: "ResearchGrant" }],
  testScores: [{ type: Schema.Types.ObjectId, ref: "TestScore" }],
  publications: [{ type: Schema.Types.ObjectId, ref: "Publication" }],
  patents: [{ type: Schema.Types.ObjectId, ref: "Patent" }],
  professionalContext: [
    { type: Schema.Types.ObjectId, ref: "ProfessionalContext" },
  ],
});

export default mongoose.model<IResumeVersion>(
  "ResumeVersion",
  ResumeVersionSchema
);

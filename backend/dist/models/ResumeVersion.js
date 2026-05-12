"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ResumeVersionSchema = new mongoose_1.Schema({
    resumeId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Resume" },
    data: { type: mongoose_1.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    note: { type: String },
    languages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Language" }],
    hobbies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Hobby" }],
    certifications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Certification" }],
    awards: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Award" }],
    speakingEngagements: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "SpeakingEngagement" },
    ],
    memberships: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Membership" }],
    workshops: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Workshop" }],
    keyAchievements: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "KeyAchievement" }],
    responsibilities: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Responsibility" }],
    tools: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Tool" }],
    customSections: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "CustomSection" }],
    // New sections
    clientProjects: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ClientProject" }],
    portfolio: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Portfolio" }],
    volunteering: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Volunteering" }],
    militaryService: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "MilitaryService" }],
    toolTechnologies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ToolTechnology" }],
    methodologies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Methodology" }],
    industryExpertise: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "IndustryExpertise" },
    ],
    references: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Reference" }],
    socialProfiles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "SocialProfile" }],
    availabilityWorkAuth: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "AvailabilityWorkAuth" },
    ],
    internships: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Internship" }],
    academicProjects: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "AcademicProject" }],
    leadershipPositions: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "LeadershipPosition" },
    ],
    trainingPrograms: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "TrainingProgram" }],
    scholarships: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Scholarship" }],
    coCurricular: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "CoCurricular" }],
    extracurricular: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Extracurricular" }],
    careerObjective: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "CareerObjective" }],
    teachingExperience: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "TeachingExperience" },
    ],
    mentorshipExperience: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "MentorshipExperience" },
    ],
    researchGrants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "ResearchGrant" }],
    testScores: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "TestScore" }],
    publications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Publication" }],
    patents: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Patent" }],
    professionalContext: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "ProfessionalContext" },
    ],
});
exports.default = mongoose_1.default.model("ResumeVersion", ResumeVersionSchema);

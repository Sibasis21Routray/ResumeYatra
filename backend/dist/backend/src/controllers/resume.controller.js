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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResume = createResume;
exports.listResumes = listResumes;
exports.getResume = getResume;
exports.updateResume = updateResume;
exports.deleteResume = deleteResume;
exports.generateFiles = generateFiles;
exports.getFiles = getFiles;
exports.downloadFile = downloadFile;
const User_1 = __importDefault(require("../models/User"));
const Resume_1 = __importDefault(require("../models/Resume"));
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const Language_1 = __importDefault(require("../models/Language"));
const Hobby_1 = __importDefault(require("../models/Hobby"));
const KeyAchievement_1 = __importDefault(require("../models/KeyAchievement"));
const Responsibility_1 = __importDefault(require("../models/Responsibility"));
const Tool_1 = __importDefault(require("../models/Tool"));
const SocialLink_1 = __importDefault(require("../models/SocialLink"));
const Certification_1 = __importDefault(require("../models/Certification"));
const Award_1 = __importDefault(require("../models/Award"));
const SpeakingEngagement_1 = __importDefault(require("../models/SpeakingEngagement"));
const Membership_1 = __importDefault(require("../models/Membership"));
const Workshop_1 = __importDefault(require("../models/Workshop"));
const CustomSection_1 = __importDefault(require("../models/CustomSection"));
const CustomSectionEntry_1 = __importDefault(require("../models/CustomSectionEntry"));
const ResumeFile_1 = __importDefault(require("../models/ResumeFile"));
const resumeService = __importStar(require("../services/resume.service"));
const mongoose_1 = __importDefault(require("mongoose"));
// New model imports for sub-sections
const ClientProject_1 = __importDefault(require("../models/ClientProject"));
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const Volunteering_1 = __importDefault(require("../models/Volunteering"));
const MilitaryService_1 = __importDefault(require("../models/MilitaryService"));
const ToolTechnology_1 = __importDefault(require("../models/ToolTechnology"));
const Methodology_1 = __importDefault(require("../models/Methodology"));
const IndustryExpertise_1 = __importDefault(require("../models/IndustryExpertise"));
const Reference_1 = __importDefault(require("../models/Reference"));
const SocialProfile_1 = __importDefault(require("../models/SocialProfile"));
const AvailabilityWorkAuth_1 = __importDefault(require("../models/AvailabilityWorkAuth"));
const Internship_1 = __importDefault(require("../models/Internship"));
const AcademicProject_1 = __importDefault(require("../models/AcademicProject"));
const LeadershipPosition_1 = __importDefault(require("../models/LeadershipPosition"));
const TrainingProgram_1 = __importDefault(require("../models/TrainingProgram"));
const Scholarship_1 = __importDefault(require("../models/Scholarship"));
const CoCurricular_1 = __importDefault(require("../models/CoCurricular"));
const Extracurricular_1 = __importDefault(require("../models/Extracurricular"));
const CareerObjective_1 = __importDefault(require("../models/CareerObjective"));
const TeachingExperience_1 = __importDefault(require("../models/TeachingExperience"));
const MentorshipExperience_1 = __importDefault(require("../models/MentorshipExperience"));
const ResearchGrant_1 = __importDefault(require("../models/ResearchGrant"));
const TestScore_1 = __importDefault(require("../models/TestScore"));
const Publication_1 = __importDefault(require("../models/Publication"));
const Patent_1 = __importDefault(require("../models/Patent"));
const ProfessionalContext_1 = __importDefault(require("../models/ProfessionalContext"));
// Helper function to extract string from params (handles array case)
function getStringParam(param) {
    if (Array.isArray(param)) {
        return param[0];
    }
    return param;
}
// Common default export:
// import {ResumeModel} from '../models/resume.model'
// If the model is a named export:
// import { ResumeModel } from '../models/resume.model'
// or
const Resume_2 = __importDefault(require("../models/Resume"));
async function createResume(req, res) {
    try {
        // Prefer `req.userId` set by auth.middleware; fall back to older `req.user` shape if present
        const userId = req.userId || req.user?.id || req.user?.userId;
        if (!userId) {
            console.log("[createResume] Missing user id on request");
            return res.status(401).json({ message: "Unauthorized: missing user" });
        }
        // Minimal default resume data (do not add unwanted sections here)
        const defaultData = {
            title: req.body?.title || "Untitled Resume",
            personal: {
                name: "",
                email: "",
                phone: "",
                alternatePhone: "",
                location: "",
                pinCode: "",
                country: "",
                dob: "",
                maritalStatus: "",
                gender: "",
                fathersName: "",
                image: "",
                middleName: "",
            },
            summary: "",
            experience: [],
            projects: [],
            education: [],
            skills: [],
            customSections: [],
            professionalContext: {},
        };
        // Ensure required schema fields are provided: ownerId and title (some schemas use ownerId)
        const resumePayload = {
            // use the schema's expected owner field name — ownerId here per validation error
            ownerId: userId,
            title: defaultData.title,
            template: req.body?.template || "modern", // Default to modern if no template specified
            data: defaultData,
        };
        const resume = await Resume_2.default.create(resumePayload);
        return res.status(201).json(resume);
    }
    catch (err) {
        console.error("createResume error:", err);
        return res
            .status(500)
            .json({ message: "Failed to create resume", error: err });
    }
}
async function listResumes(req, res) {
    try {
        const userId = req.userId;
        console.log("[listResumes] userId:", userId);
        if (!userId) {
            console.log("[listResumes] No userId found in request");
            return res.status(401).json({ error: "not authenticated" });
        }
        const items = await resumeService.list(userId);
        console.log("[listResumes] Found resumes:", items.length);
        console.log("[listResumes] Resume data sample:", items.slice(0, 2)); // Log first 2 items
        // Validate the response structure
        if (!Array.isArray(items)) {
            console.error("[listResumes] Service returned non-array:", typeof items);
            return res
                .status(500)
                .json({ error: "Invalid response format from service" });
        }
        // Check for any invalid items
        const validItems = items.filter((item) => {
            const isValid = item &&
                typeof item === "object" &&
                item.id &&
                typeof item.id === "string";
            if (!isValid) {
                console.warn("[listResumes] Filtering out invalid item:", item);
            }
            return isValid;
        });
        if (validItems.length !== items.length) {
            console.warn(`[listResumes] Filtered ${items.length - validItems.length} invalid items`);
        }
        console.log("[listResumes] Returning valid resumes:", validItems.length);
        res.json(validItems);
    }
    catch (err) {
        console.error("listResumes error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function getResume(req, res) {
    try {
        const id = getStringParam(req.params.id);
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: "not authenticated" });
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Check ownership or admin access
        const resume = await Resume_1.default.findById(id);
        if (!resume)
            return res.status(404).json({ error: "Resume not found" });
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const item = await resumeService.get(id, resume.ownerId.toString()); // Use actual owner for data retrieval
        if (!item)
            return res.status(404).json({ error: "not found" });
        // Include languages and hobbies in the response
        const latestVersion = item.versions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        if (latestVersion) {
            console.log("[getResume] Latest version data keys:", Object.keys(latestVersion.data || {}));
            console.log("[getResume] Certifications in data:", latestVersion.data?.certifications);
            console.log("[getResume] CustomSections in data:", latestVersion.data?.customSections);
            const languages = await Language_1.default.find({
                resumeId: latestVersion._id,
            }).select("name proficiency capability");
            const hobbies = await Hobby_1.default.find({ resumeId: latestVersion._id }).select("name");
            const keyAchievements = await KeyAchievement_1.default.find({
                resumeId: latestVersion._id,
            }).select("description");
            const responsibilities = await Responsibility_1.default.find({
                resumeId: latestVersion._id,
            }).select("description");
            const tools = await Tool_1.default.find({ resumeId: latestVersion._id }).select("name");
            const socialLinks = await SocialLink_1.default.find({
                resumeId: latestVersion._id,
            }).select("text url");
            console.log("[getResume] fetched socialLinks count:", socialLinks.length);
            const certifications = await Certification_1.default.find({
                resumeId: latestVersion._id,
            }).select("name issuer date url");
            const awards = await Award_1.default.find({
                resumeId: latestVersion._id,
            }).select("title organization issueYear description");
            const speakingEngagements = await SpeakingEngagement_1.default.find({
                resumeId: latestVersion._id,
            }).select("topic eventName organization date location description url");
            const memberships = await Membership_1.default.find({
                resumeId: latestVersion._id,
            }).select("organization membershipType startDate endDate description url");
            const workshops = await Workshop_1.default.find({
                resumeId: latestVersion._id,
            }).select("title instructor organization date location description certificateUrl");
            const customSections = await CustomSection_1.default.find({
                resumeId: latestVersion._id,
            }).populate("entries");
            // Fetch new sub-section data
            const clientProjects = await ClientProject_1.default.find({
                resumeId: latestVersion._id,
            });
            const portfolio = await Portfolio_1.default.find({
                resumeId: latestVersion._id,
            });
            const volunteering = await Volunteering_1.default.find({
                resumeId: latestVersion._id,
            });
            const militaryService = await MilitaryService_1.default.find({
                resumeId: latestVersion._id,
            });
            const toolTechnologies = await ToolTechnology_1.default.find({
                resumeId: latestVersion._id,
            });
            const methodologies = await Methodology_1.default.find({
                resumeId: latestVersion._id,
            });
            const industryExpertise = await IndustryExpertise_1.default.find({
                resumeId: latestVersion._id,
            });
            const references = await Reference_1.default.find({
                resumeId: latestVersion._id,
            });
            const socialProfiles = await SocialProfile_1.default.find({
                resumeId: latestVersion._id,
            });
            const availabilityWorkAuth = await AvailabilityWorkAuth_1.default.find({
                resumeId: latestVersion._id,
            });
            const internships = await Internship_1.default.find({
                resumeId: latestVersion._id,
            });
            const academicProjects = await AcademicProject_1.default.find({
                resumeId: latestVersion._id,
            });
            const leadershipPositions = await LeadershipPosition_1.default.find({
                resumeId: latestVersion._id,
            });
            const trainingPrograms = await TrainingProgram_1.default.find({
                resumeId: latestVersion._id,
            });
            const scholarships = await Scholarship_1.default.find({
                resumeId: latestVersion._id,
            });
            const coCurricular = await CoCurricular_1.default.find({
                resumeId: latestVersion._id,
            });
            const extracurricular = await Extracurricular_1.default.find({
                resumeId: latestVersion._id,
            });
            const careerObjective = await CareerObjective_1.default.find({
                resumeId: latestVersion._id,
            });
            const teachingExperience = await TeachingExperience_1.default.find({
                resumeId: latestVersion._id,
            });
            const mentorshipExperience = await MentorshipExperience_1.default.find({
                resumeId: latestVersion._id,
            });
            const researchGrants = await ResearchGrant_1.default.find({
                resumeId: latestVersion._id,
            });
            const testScores = await TestScore_1.default.find({
                resumeId: latestVersion._id,
            });
            const publications = await Publication_1.default.find({
                resumeId: latestVersion._id,
            });
            const patents = await Patent_1.default.find({
                resumeId: latestVersion._id,
            });
            const professionalContext = await ProfessionalContext_1.default.findOne({
                resumeVersion: latestVersion._id,
            });
            // Add all data to the response
            if (latestVersion.data && typeof latestVersion.data === "object") {
                latestVersion.data.languages = languages.map((l) => ({
                    language: l.name,
                    level: l.proficiency || "Intermediate",
                    capability: l.capability || "",
                }));
                latestVersion.data.hobbies = hobbies.map((h) => h.name);
                latestVersion.data.keyAchievements = keyAchievements.map((k) => k.description);
                latestVersion.data.responsibilities = responsibilities.map((r) => r.description);
                latestVersion.data.tools = tools.map((t) => t.name);
                latestVersion.data.socialLinks = socialLinks.map((l) => ({
                    urlText: l.text,
                    url: l.url,
                }));
                latestVersion.data.certifications = certifications.map((c) => ({
                    id: c._id.toString(),
                    name: c.name,
                    issuer: c.issuer,
                    date: c.date,
                    url: c.url,
                }));
                latestVersion.data.awards = awards.map((a) => ({
                    id: a._id.toString(),
                    title: a.title,
                    organization: a.organization,
                    issueYear: a.issueYear,
                    description: a.description,
                }));
                latestVersion.data.speakingEngagements =
                    speakingEngagements.map((s) => ({
                        id: s._id.toString(),
                        topic: s.topic,
                        eventName: s.eventName,
                        organization: s.organization,
                        date: s.date,
                        location: s.location,
                        description: s.description,
                        url: s.url,
                    }));
                latestVersion.data.memberships = memberships.map((m) => ({
                    id: m._id.toString(),
                    organization: m.organization,
                    membershipType: m.membershipType,
                    startDate: m.startDate,
                    endDate: m.endDate,
                    description: m.description,
                    url: m.url,
                }));
                latestVersion.data.workshops = workshops.map((w) => ({
                    id: w._id.toString(),
                    title: w.title,
                    instructor: w.instructor,
                    organization: w.organization,
                    date: w.date,
                    location: w.location,
                    description: w.description,
                    certificateUrl: w.certificateUrl,
                }));
                latestVersion.data.customSections = customSections.map((cs) => ({
                    heading: cs.title,
                    isVisible: cs.isVisible,
                    entries: cs.entries.map((entry) => ({
                        title: entry.title,
                        organization: entry.organization,
                        date: entry.date,
                        description: entry.description,
                        isVisible: entry.isVisible,
                    })),
                }));
                // Add new sub-section data to response
                latestVersion.data.clientProjects = clientProjects.map((p) => ({
                    id: p._id.toString(),
                    name: p.name,
                    client: p.client,
                    role: p.role,
                    startDate: p.startDate,
                    endDate: p.endDate,
                    description: p.description,
                    technologies: p.technologies,
                    url: p.url,
                }));
                latestVersion.data.portfolio = portfolio.map((p) => ({
                    id: p._id.toString(),
                    title: p.title,
                    description: p.description,
                    url: p.url,
                    imageUrl: p.imageUrl,
                }));
                latestVersion.data.volunteering = volunteering.map((v) => ({
                    id: v._id.toString(),
                    organization: v.organization,
                    role: v.role,
                    startDate: v.startDate,
                    endDate: v.endDate,
                    description: v.description,
                }));
                latestVersion.data.militaryService = militaryService.map((m) => ({
                    id: m._id.toString(),
                    branch: m.branch,
                    rank: m.rank,
                    unit: m.unit,
                    startDate: m.startDate,
                    endDate: m.endDate,
                    description: m.description,
                }));
                latestVersion.data.toolTechnologies = toolTechnologies.map((t) => ({
                    id: t._id.toString(),
                    name: t.name,
                    category: t.category,
                }));
                latestVersion.data.methodologies = methodologies.map((m) => ({
                    id: m._id.toString(),
                    name: m.name,
                    description: m.description,
                }));
                latestVersion.data.industryExpertise = industryExpertise.map((i) => ({
                    id: i._id.toString(),
                    industry: i.industry,
                    years: i.years,
                    description: i.description,
                }));
                latestVersion.data.references = references.map((r) => ({
                    id: r._id.toString(),
                    name: r.name,
                    title: r.title,
                    company: r.company,
                    email: r.email,
                    phone: r.phone,
                    relationship: r.relationship,
                }));
                latestVersion.data.socialProfiles = socialProfiles.map((s) => ({
                    id: s._id.toString(),
                    platform: s.platform,
                    url: s.url,
                }));
                latestVersion.data.availabilityWorkAuth =
                    availabilityWorkAuth.map((a) => ({
                        id: a._id.toString(),
                        status: a.status,
                        noticePeriod: a.noticePeriod,
                        workLocation: a.workLocation,
                        visaStatus: a.visaStatus,
                    }));
                latestVersion.data.internships = internships.map((i) => ({
                    id: i._id.toString(),
                    title: i.title,
                    company: i.company,
                    startDate: i.startDate,
                    endDate: i.endDate,
                    location: i.location,
                    description: i.description,
                }));
                latestVersion.data.academicProjects = academicProjects.map((p) => ({
                    id: p._id.toString(),
                    name: p.title,
                    course: p.course,
                    institution: p.institution,
                    duration: p.duration,
                    startDate: p.startDate,
                    endDate: p.endDate,
                    description: p.description,
                    technologies: Array.isArray(p.technologies) ? p.technologies : [],
                    url: p.url,
                }));
                latestVersion.data.leadershipPositions =
                    leadershipPositions.map((l) => ({
                        id: l._id.toString(),
                        position: l.title, // Map "title" (DB) to "position" (frontend)
                        organization: l.organization,
                        startDate: l.startDate,
                        endDate: l.endDate,
                        description: l.description,
                    }));
                latestVersion.data.trainingPrograms = trainingPrograms.map((t) => ({
                    id: t._id.toString(),
                    name: t.name,
                    provider: t.organization,
                    completionDate: t.completionDate,
                    duration: t.duration,
                    description: t.description,
                }));
                latestVersion.data.scholarships = scholarships.map((s) => ({
                    id: s._id.toString(),
                    name: s.name,
                    provider: s.provider,
                    organization: s.provider,
                    year: s.year,
                    amount: s.amount,
                    description: s.description,
                }));
                latestVersion.data.coCurricular = coCurricular.map((c) => ({
                    id: c._id.toString(),
                    activity: c.activity,
                    role: c.role,
                    organization: c.organization,
                    year: c.year,
                    startDate: c.startDate,
                    endDate: c.endDate,
                    description: c.description,
                }));
                latestVersion.data.extracurricular = extracurricular.map((e) => ({
                    id: e._id.toString(),
                    activity: e.activity,
                    role: e.role,
                    organization: e.organization,
                    year: e.year,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    description: e.description,
                }));
                latestVersion.data.careerObjective =
                    careerObjective.length > 0 ? careerObjective[0].objective : "";
                latestVersion.data.teachingExperience = teachingExperience.map((t) => ({
                    id: t._id.toString(),
                    title: t.title,
                    institution: t.institution,
                    course: t.course,
                    startDate: t.startDate,
                    endDate: t.endDate,
                    description: t.description,
                }));
                latestVersion.data.mentorshipExperience =
                    mentorshipExperience.map((m) => ({
                        id: m._id.toString(),
                        menteeName: m.menteeName,
                        menteeCount: m.menteeCount,
                        program: m.program,
                        organization: m.organization,
                        startDate: m.startDate,
                        endDate: m.endDate,
                        description: m.description,
                    }));
                latestVersion.data.researchGrants = researchGrants.map((r) => ({
                    id: r._id.toString(),
                    title: r.title,
                    agency: r.agency,
                    amount: r.amount,
                    startDate: r.startDate,
                    endDate: r.endDate,
                    description: r.description,
                }));
                latestVersion.data.testScores = testScores.map((t) => ({
                    id: t._id.toString(),
                    testName: t.testName,
                    score: t.score,
                    maxScore: t.maxScore,
                    date: t.date,
                }));
                latestVersion.data.publications = publications.map((p) => ({
                    id: p._id.toString(),
                    title: p.title,
                    authors: p.authors,
                    journal: p.journal,
                    conference: p.conference,
                    publicationDate: p.publicationDate,
                    doi: p.doi,
                    url: p.url,
                }));
                latestVersion.data.patents = patents.map((p) => ({
                    id: p._id.toString(),
                    title: p.title,
                    inventors: p.inventors,
                    patentNumber: p.patentNumber,
                    filingDate: p.filingDate,
                    issueDate: p.issueDate,
                    status: p.status,
                }));
                // Add professionalContext to response
                latestVersion.data.professionalContext =
                    professionalContext
                        ? {
                            id: professionalContext._id.toString(),
                            totalExperience: professionalContext.totalExperience,
                            teamSize: professionalContext.teamSize,
                            industry: professionalContext.industry,
                            industryCustom: professionalContext.industryCustom,
                            functionalDomain: professionalContext.functionalDomain,
                            functionalDomainCustom: professionalContext.functionalDomainCustom,
                            geographicScope: professionalContext.geographicScope,
                            revenueResponsibility: professionalContext.revenueResponsibility,
                        }
                        : {};
            }
            console.log("[getResume] Final data keys:", Object.keys(latestVersion.data || {}));
        }
        res.json(item);
    }
    catch (err) {
        console.error("getResume error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function updateResume(req, res) {
    try {
        const id = getStringParam(req.params.id);
        const userId = req.userId;
        const { data, template, title } = req.body;
        console.log("[updateResume] Received data keys:", Object.keys(data || {}));
        console.log("[updateResume] Certifications in data:", data?.certifications);
        console.log("[updateResume] CustomSections in data:", data?.customSections);
        if (!userId)
            return res.status(401).json({ error: "not authenticated" });
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!data && !template && !title)
            return res
                .status(400)
                .json({ error: "data, template, or title required" });
        // Verify resume ownership
        const resume = await Resume_1.default.findOne({ _id: id, ownerId: userId });
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Update template if provided
        if (template) {
            resume.template = template;
            await resume.save();
        }
        // Update title if provided
        if (title) {
            resume.title = title;
            await resume.save();
        }
        // Update candidateName if personal.name is provided
        if (data?.personal?.name) {
            resume.candidateName = data.personal.name;
            await resume.save();
        }
        // Create new version if data is provided
        if (data) {
            const version = new ResumeVersion_1.default({
                resumeId: id,
                resume: id,
                data,
            });
            await version.save();
            resume.versions.push(version._id);
            await resume.save();
            console.log("[updateResume] Created version with data keys:", Object.keys(version.data));
            console.log("[updateResume] careerObjective in data:", data.careerObjective);
            // Handle languages if provided
            if (data.languages && Array.isArray(data.languages)) {
                // Delete existing languages for this version
                await Language_1.default.deleteMany({ resumeId: version._id });
                // Create new languages
                if (data.languages.length > 0) {
                    const langDocs = data.languages.map((lang) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        name: lang.language,
                        proficiency: lang.level,
                        capability: lang.capability,
                    }));
                    await Language_1.default.insertMany(langDocs);
                }
            }
            // Handle hobbies if provided
            if (data.hobbies && Array.isArray(data.hobbies)) {
                // Delete existing hobbies for this version
                await Hobby_1.default.deleteMany({ resumeId: version._id });
                // Create new hobbies
                if (data.hobbies.length > 0) {
                    const hobbyDocs = data.hobbies.map((hobby) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        name: hobby,
                    }));
                    await Hobby_1.default.insertMany(hobbyDocs);
                }
            }
            // Handle keyAchievements if provided
            if (data.keyAchievements && Array.isArray(data.keyAchievements)) {
                // Delete existing keyAchievements for this version
                await KeyAchievement_1.default.deleteMany({ resumeId: version._id });
                // Create new keyAchievements
                if (data.keyAchievements.length > 0) {
                    const achDocs = data.keyAchievements.map((achievement) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        description: achievement,
                    }));
                    await KeyAchievement_1.default.insertMany(achDocs);
                }
            }
            // Handle responsibilities if provided
            if (data.responsibilities && Array.isArray(data.responsibilities)) {
                // Delete existing responsibilities for this version
                await Responsibility_1.default.deleteMany({ resumeId: version._id });
                // Create new responsibilities
                if (data.responsibilities.length > 0) {
                    const respDocs = data.responsibilities.map((responsibility) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        description: responsibility,
                    }));
                    await Responsibility_1.default.insertMany(respDocs);
                }
            }
            // Handle tools if provided
            if (data.tools && Array.isArray(data.tools)) {
                // Delete existing tools for this version
                await Tool_1.default.deleteMany({ resumeId: version._id });
                // Create new tools
                if (data.tools.length > 0) {
                    const toolDocs = data.tools.map((tool) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        name: tool,
                    }));
                    await Tool_1.default.insertMany(toolDocs);
                }
            }
            // Handle socialLinks if provided
            if (data.socialLinks && Array.isArray(data.socialLinks)) {
                console.log("[updateResume] socialLinks data:", data.socialLinks);
                // Delete existing socialLinks for this version
                await SocialLink_1.default.deleteMany({ resumeId: version._id });
                // Filter out social links with empty URLs before saving
                const validSocialLinks = data.socialLinks.filter((link) => link.urlText && link.url && link.url.trim() !== "");
                // Create new socialLinks
                if (validSocialLinks.length > 0) {
                    const socialLinkDocs = validSocialLinks.map((link) => {
                        console.log("[updateResume] processing link:", link);
                        return {
                            resumeId: version._id,
                            resumeVersion: version._id,
                            text: link.urlText,
                            url: link.url,
                        };
                    });
                    console.log("[updateResume] socialLinkDocs to insert:", socialLinkDocs);
                    await SocialLink_1.default.insertMany(socialLinkDocs);
                    console.log("[updateResume] socialLinks inserted successfully");
                }
            }
            else {
                console.log("[updateResume] no socialLinks in data or not array");
            }
            // Handle certifications if provided
            if (data.certifications && Array.isArray(data.certifications)) {
                // Delete existing certifications for this version
                await Certification_1.default.deleteMany({ resumeId: version._id });
                // Create new certifications
                if (data.certifications.length > 0) {
                    const certDocs = data.certifications.map((cert) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        name: cert.name,
                        issuer: cert.issuer,
                        date: cert.date,
                        url: cert.url,
                    }));
                    await Certification_1.default.insertMany(certDocs);
                }
            }
            // Handle customSections if provided
            if (data.customSections && Array.isArray(data.customSections)) {
                console.log("[updateResume] customSections data:", data.customSections);
                // Delete existing customSections for this version
                await CustomSection_1.default.deleteMany({ resumeId: version._id });
                // Create new customSections
                if (data.customSections.length > 0) {
                    for (const section of data.customSections) {
                        console.log("[updateResume] processing section:", section);
                        const sectionDoc = new CustomSection_1.default({
                            resumeId: version._id,
                            resumeVersion: version._id,
                            title: section.heading,
                            isVisible: section.isVisible,
                        });
                        await sectionDoc.save();
                        // Handle entries for this section
                        if (section.entries && Array.isArray(section.entries)) {
                            const entryDocs = section.entries.map((entry) => ({
                                customSectionId: sectionDoc._id,
                                resumeId: version._id,
                                resumeVersion: version._id,
                                title: entry.title,
                                organization: entry.organization,
                                date: entry.date,
                                description: entry.description,
                                isVisible: entry.isVisible,
                            }));
                            await CustomSectionEntry_1.default.insertMany(entryDocs);
                        }
                    }
                }
            }
            // Handle clientProjects if provided
            if (data.clientProjects && Array.isArray(data.clientProjects)) {
                await ClientProject_1.default.deleteMany({ resumeId: version._id });
                if (data.clientProjects.length > 0) {
                    const docs = data.clientProjects.map((item) => ({
                        resumeId: version._id,
                        name: item.name,
                        client: item.client,
                        role: item.role,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                        technologies: item.technologies,
                        url: item.url,
                    }));
                    await ClientProject_1.default.insertMany(docs);
                }
            }
            // Handle portfolio if provided
            if (data.portfolio && Array.isArray(data.portfolio)) {
                await Portfolio_1.default.deleteMany({ resumeId: version._id });
                if (data.portfolio.length > 0) {
                    const docs = data.portfolio.map((item) => ({
                        resumeId: version._id,
                        title: item.title,
                        description: item.description,
                        url: item.url,
                        imageUrl: item.imageUrl,
                    }));
                    await Portfolio_1.default.insertMany(docs);
                }
            }
            // Handle volunteering if provided
            if (data.volunteering && Array.isArray(data.volunteering)) {
                await Volunteering_1.default.deleteMany({ resumeId: version._id });
                if (data.volunteering.length > 0) {
                    const docs = data.volunteering.map((item) => ({
                        resumeId: version._id,
                        organization: item.organization,
                        role: item.role,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await Volunteering_1.default.insertMany(docs);
                }
            }
            // Handle militaryService if provided
            if (data.militaryService && Array.isArray(data.militaryService)) {
                await MilitaryService_1.default.deleteMany({ resumeId: version._id });
                if (data.militaryService.length > 0) {
                    const docs = data.militaryService.map((item) => ({
                        resumeId: version._id,
                        branch: item.branch,
                        rank: item.rank,
                        unit: item.unit,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await MilitaryService_1.default.insertMany(docs);
                }
            }
            // Handle toolTechnologies if provided
            if (data.toolTechnologies && Array.isArray(data.toolTechnologies)) {
                await ToolTechnology_1.default.deleteMany({ resumeId: version._id });
                if (data.toolTechnologies.length > 0) {
                    const docs = data.toolTechnologies.map((item) => ({
                        resumeId: version._id,
                        name: item.name,
                        category: item.category,
                    }));
                    await ToolTechnology_1.default.insertMany(docs);
                }
            }
            // Handle methodologies if provided
            if (data.methodologies && Array.isArray(data.methodologies)) {
                await Methodology_1.default.deleteMany({ resumeId: version._id });
                if (data.methodologies.length > 0) {
                    const docs = data.methodologies.map((item) => ({
                        resumeId: version._id,
                        name: item.name,
                        description: item.description,
                    }));
                    await Methodology_1.default.insertMany(docs);
                }
            }
            // Handle industryExpertise if provided
            if (data.industryExpertise && Array.isArray(data.industryExpertise)) {
                await IndustryExpertise_1.default.deleteMany({ resumeId: version._id });
                if (data.industryExpertise.length > 0) {
                    const docs = data.industryExpertise.map((item) => ({
                        resumeId: version._id,
                        industry: item.industry,
                        years: item.years,
                        description: item.description,
                    }));
                    await IndustryExpertise_1.default.insertMany(docs);
                }
            }
            // Handle references if provided
            if (data.references && Array.isArray(data.references)) {
                await Reference_1.default.deleteMany({ resumeId: version._id });
                if (data.references.length > 0) {
                    const docs = data.references.map((item) => ({
                        resumeId: version._id,
                        name: item.name,
                        title: item.title,
                        company: item.company,
                        email: item.email,
                        phone: item.phone,
                        relationship: item.relationship,
                    }));
                    await Reference_1.default.insertMany(docs);
                }
            }
            // Handle socialProfiles if provided
            if (data.socialProfiles && Array.isArray(data.socialProfiles)) {
                await SocialProfile_1.default.deleteMany({ resumeId: version._id });
                if (data.socialProfiles.length > 0) {
                    const docs = data.socialProfiles.map((item) => ({
                        resumeId: version._id,
                        platform: item.platform,
                        url: item.url,
                    }));
                    await SocialProfile_1.default.insertMany(docs);
                }
            }
            // Handle availabilityWorkAuth if provided
            if (data.availabilityWorkAuth &&
                Array.isArray(data.availabilityWorkAuth)) {
                await AvailabilityWorkAuth_1.default.deleteMany({ resumeId: version._id });
                if (data.availabilityWorkAuth.length > 0) {
                    const docs = data.availabilityWorkAuth.map((item) => ({
                        resumeId: version._id,
                        status: item.status,
                        noticePeriod: item.noticePeriod,
                        workLocation: item.workLocation,
                        visaStatus: item.visaStatus,
                    }));
                    await AvailabilityWorkAuth_1.default.insertMany(docs);
                }
            }
            // Handle internships if provided
            if (data.internships && Array.isArray(data.internships)) {
                await Internship_1.default.deleteMany({ resumeId: version._id });
                if (data.internships.length > 0) {
                    const docs = data.internships.map((item) => ({
                        resumeId: version._id,
                        title: item.title,
                        company: item.company,
                        location: item.location,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await Internship_1.default.insertMany(docs);
                }
            }
            // Handle academicProjects if provided
            if (data.academicProjects && Array.isArray(data.academicProjects)) {
                console.log("[updateResume] academicProjects received:", JSON.stringify(data.academicProjects));
                await AcademicProject_1.default.deleteMany({ resumeId: version._id });
                if (data.academicProjects.length > 0) {
                    console.log("[updateResume] Saving academicProjects:", data.academicProjects.length, "items");
                    const docs = data.academicProjects.map((item) => ({
                        resumeId: version._id,
                        title: item.name || item.title,
                        course: item.course,
                        institution: item.institution,
                        duration: item.duration,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                        technologies: Array.isArray(item.technologies)
                            ? item.technologies
                            : [],
                        url: item.url,
                    }));
                    console.log("[updateResume] academicProjects docs to insert:", JSON.stringify(docs));
                    await AcademicProject_1.default.insertMany(docs);
                    console.log("[updateResume] academicProjects inserted successfully");
                }
            }
            else {
                console.log("[updateResume] No academicProjects in data or not array");
            }
            // Handle leadershipPositions if provided
            if (data.leadershipPositions && Array.isArray(data.leadershipPositions)) {
                await LeadershipPosition_1.default.deleteMany({ resumeId: version._id });
                if (data.leadershipPositions.length > 0) {
                    const docs = data.leadershipPositions.map((item) => ({
                        resumeId: version._id,
                        title: item.position || item.title, // Support both "position" (frontend) and "title" (backend)
                        organization: item.organization,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await LeadershipPosition_1.default.insertMany(docs);
                }
            }
            // Handle trainingPrograms if provided
            if (data.trainingPrograms && Array.isArray(data.trainingPrograms)) {
                await TrainingProgram_1.default.deleteMany({ resumeId: version._id });
                if (data.trainingPrograms.length > 0) {
                    const docs = data.trainingPrograms.map((item) => ({
                        resumeId: version._id,
                        name: item.name,
                        organization: item.provider, // Map frontend "provider" to database "organization"
                        completionDate: item.completionDate,
                        duration: item.duration,
                        description: item.description,
                    }));
                    await TrainingProgram_1.default.insertMany(docs);
                }
            }
            // Handle scholarships if provided
            if (data.scholarships && Array.isArray(data.scholarships)) {
                await Scholarship_1.default.deleteMany({ resumeId: version._id });
                if (data.scholarships.length > 0) {
                    const docs = data.scholarships.map((item) => ({
                        resumeId: version._id,
                        name: item.name,
                        provider: item.provider, // Use provider for "Awarding Body"
                        year: item.year,
                        amount: item.amount,
                        description: item.description,
                    }));
                    await Scholarship_1.default.insertMany(docs);
                }
            }
            // Handle coCurricular if provided
            if (data.coCurricular && Array.isArray(data.coCurricular)) {
                await CoCurricular_1.default.deleteMany({ resumeId: version._id });
                if (data.coCurricular.length > 0) {
                    const docs = data.coCurricular.map((item) => ({
                        resumeId: version._id,
                        activity: item.activity,
                        role: item.role,
                        organization: item.organization,
                        year: item.year,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await CoCurricular_1.default.insertMany(docs);
                }
            }
            // Handle extracurricular if provided
            if (data.extracurricular && Array.isArray(data.extracurricular)) {
                await Extracurricular_1.default.deleteMany({ resumeId: version._id });
                if (data.extracurricular.length > 0) {
                    const docs = data.extracurricular.map((item) => ({
                        resumeId: version._id,
                        activity: item.activity,
                        role: item.role,
                        organization: item.organization,
                        year: item.year,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await Extracurricular_1.default.insertMany(docs);
                }
            }
            // Handle careerObjective if provided
            if (data.careerObjective && typeof data.careerObjective === "string") {
                console.log("[updateResume] Handling careerObjective:", data.careerObjective);
                await CareerObjective_1.default.deleteMany({ resumeId: version._id });
                if (data.careerObjective.trim()) {
                    const doc = new CareerObjective_1.default({
                        resumeId: version._id,
                        objective: data.careerObjective,
                    });
                    await doc.save();
                    console.log("[updateResume] CareerObjective saved successfully");
                }
                else {
                    console.log("[updateResume] careerObjective is empty, not saving to collection");
                }
            }
            else {
                console.log("[updateResume] No careerObjective in data or wrong type");
            }
            // Handle teachingExperience if provided
            if (data.teachingExperience && Array.isArray(data.teachingExperience)) {
                await TeachingExperience_1.default.deleteMany({ resumeId: version._id });
                if (data.teachingExperience.length > 0) {
                    const docs = data.teachingExperience.map((item) => ({
                        resumeId: version._id,
                        title: item.title,
                        institution: item.institution,
                        course: item.course,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await TeachingExperience_1.default.insertMany(docs);
                }
            }
            // Handle mentorshipExperience if provided
            if (data.mentorshipExperience &&
                Array.isArray(data.mentorshipExperience)) {
                await MentorshipExperience_1.default.deleteMany({ resumeId: version._id });
                if (data.mentorshipExperience.length > 0) {
                    const docs = data.mentorshipExperience.map((item) => ({
                        resumeId: version._id,
                        menteeName: item.menteeName,
                        menteeCount: item.menteeCount,
                        program: item.program,
                        organization: item.organization,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await MentorshipExperience_1.default.insertMany(docs);
                }
            }
            // Handle researchGrants if provided
            if (data.researchGrants && Array.isArray(data.researchGrants)) {
                await ResearchGrant_1.default.deleteMany({ resumeId: version._id });
                if (data.researchGrants.length > 0) {
                    const docs = data.researchGrants.map((item) => ({
                        resumeId: version._id,
                        title: item.title,
                        agency: item.agency,
                        amount: item.amount,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        description: item.description,
                    }));
                    await ResearchGrant_1.default.insertMany(docs);
                }
            }
            // Handle testScores if provided
            if (data.testScores && Array.isArray(data.testScores)) {
                await TestScore_1.default.deleteMany({ resumeId: version._id });
                if (data.testScores.length > 0) {
                    const docs = data.testScores.map((item) => ({
                        resumeId: version._id,
                        testName: item.testName,
                        score: item.score,
                        maxScore: item.maxScore,
                        date: item.date,
                    }));
                    await TestScore_1.default.insertMany(docs);
                }
            }
            // Handle publications if provided
            if (data.publications && Array.isArray(data.publications)) {
                await Publication_1.default.deleteMany({ resumeId: version._id });
                if (data.publications.length > 0) {
                    const docs = data.publications.map((item) => ({
                        resumeId: version._id,
                        title: item.title,
                        authors: item.authors,
                        journal: item.journal,
                        conference: item.conference,
                        publicationDate: item.publicationDate,
                        doi: item.doi,
                        url: item.url,
                    }));
                    await Publication_1.default.insertMany(docs);
                }
            }
            // Handle patents if provided
            if (data.patents && Array.isArray(data.patents)) {
                await Patent_1.default.deleteMany({ resumeId: version._id });
                if (data.patents.length > 0) {
                    const docs = data.patents.map((item) => ({
                        resumeId: version._id,
                        title: item.title,
                        inventors: item.inventors,
                        patentNumber: item.patentNumber,
                        filingDate: item.filingDate,
                        issueDate: item.issueDate,
                        status: item.status,
                    }));
                    await Patent_1.default.insertMany(docs);
                }
            }
            // Handle professionalContext if provided
            if (data.professionalContext &&
                typeof data.professionalContext === "object") {
                console.log("[updateResume] Handling professionalContext:", data.professionalContext);
                await ProfessionalContext_1.default.deleteMany({ resumeVersion: version._id });
                const { totalExperience, teamSize, industry, industryCustom, functionalDomain, functionalDomainCustom, geographicScope, revenueResponsibility, } = data.professionalContext;
                if (totalExperience ||
                    teamSize ||
                    industry ||
                    industryCustom ||
                    functionalDomain ||
                    functionalDomainCustom ||
                    geographicScope ||
                    revenueResponsibility) {
                    const doc = new ProfessionalContext_1.default({
                        resumeVersion: version._id,
                        totalExperience,
                        teamSize,
                        industry,
                        industryCustom,
                        functionalDomain,
                        functionalDomainCustom,
                        geographicScope,
                        revenueResponsibility,
                    });
                    await doc.save();
                    console.log("[updateResume] ProfessionalContext saved successfully");
                }
                else {
                    console.log("[updateResume] professionalContext is empty, not saving to collection");
                }
            }
            else {
                console.log("[updateResume] No professionalContext in data or wrong type");
            }
            res.json(version);
        }
        else {
            res.json({ success: true });
        }
    }
    catch (err) {
        console.error("updateResume error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function deleteResume(req, res) {
    try {
        const id = getStringParam(req.params.id);
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: "not authenticated" });
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        const deleted = await resumeService.remove(id, userId);
        res.json(deleted);
    }
    catch (err) {
        console.error("deleteResume error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function generateFiles(req, res) {
    try {
        const id = getStringParam(req.params.id);
        const userId = req.userId;
        const { data, template } = req.body;
        if (!userId)
            return res.status(401).json({ error: "not authenticated" });
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume ownership
        const resume = await Resume_1.default.findOne({ _id: id, ownerId: userId });
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Generate and save files to Cloudinary
        const result = await resumeService.generateAndSaveFiles(id, data, template);
        res.json(result);
    }
    catch (err) {
        console.error("generateFiles error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function getFiles(req, res) {
    try {
        const id = getStringParam(req.params.id);
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: "not authenticated" });
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume ownership
        const resume = await Resume_1.default.findOne({ _id: id, ownerId: userId });
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Get files from database
        const files = await ResumeFile_1.default.find({ resumeId: id }).sort({
            createdAt: -1,
        });
        res.json(files);
    }
    catch (err) {
        console.error("getFiles error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function downloadFile(req, res) {
    try {
        const fileId = getStringParam(req.params.fileId);
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: "not authenticated" });
        if (!fileId || fileId === "undefined")
            return res.status(400).json({ error: "Invalid file ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(fileId))
            return res.status(400).json({ error: "Invalid file ID" });
        // Get file info and verify ownership
        const file = await ResumeFile_1.default.findById(fileId).populate("resumeId");
        if (!file || !file.resumeId) {
            return res.status(404).json({ error: "file not found" });
        }
        // Check ownership by getting the resume
        const resume = await Resume_1.default.findById(file.resumeId);
        if (!resume || resume.ownerId.toString() !== userId) {
            return res.status(404).json({ error: "file not found" });
        }
        // Redirect to Cloudinary URL for download
        const downloadUrl = file.secureUrl || file.url;
        res.json({
            downloadUrl,
            filename: file.filename,
            format: file.format,
            size: file.size,
        });
    }
    catch (err) {
        console.error("downloadFile error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}

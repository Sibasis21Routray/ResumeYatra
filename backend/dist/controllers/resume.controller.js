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
exports.markPaid = markPaid;
exports.markDownloaded = markDownloaded;
exports.renameResume = renameResume;
const User_1 = __importDefault(require("../models/User"));
const Resume_1 = __importDefault(require("../models/Resume"));
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const Language_1 = __importDefault(require("../models/Language"));
const Hobby_1 = __importDefault(require("../models/Hobby"));
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
const Methodology_1 = __importDefault(require("../models/Methodology"));
const IndustryExpertise_1 = __importDefault(require("../models/IndustryExpertise"));
const Reference_1 = __importDefault(require("../models/Reference"));
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
// Helper function to extract guestId from headers (handles array case)
function getGuestId(headers) {
    const guestId = headers["x-guest-id"];
    if (Array.isArray(guestId)) {
        return guestId[0] || null;
    }
    return guestId || null;
}
const Resume_2 = __importDefault(require("../models/Resume"));
async function createResume(req, res) {
    try {
        // Prefer `req.userId` set by auth.middleware; fall back to older `req.user` shape if present
        const userId = req.userId || null;
        let guestId = null;
        if (!userId) {
            // Only allow guestId if NOT logged in
            guestId = getGuestId(req.headers);
        }
        if (!userId && !guestId) {
            return res.status(400).json({ error: "Missing user or guest" });
        }
        // No creation limits — users can create unlimited resumes.
        // Plan limits only control how many are DISPLAYED on the dashboard.
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
        // Ensure required schema fields are provided: ownerId and title
        const resumePayload = {
            ownerId: userId || null, // Explicitly set to null for guests
            guestId: guestId || null,
            title: defaultData.title,
            template: req.body?.template || "modern",
            data: defaultData,
        };
        const resume = await Resume_2.default.create(resumePayload);
        // add to user's resumes array if user
        if (userId) {
            await User_1.default.findByIdAndUpdate(userId, { $push: { resumes: resume._id } });
        }
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        console.log("[listResumes] userId:", userId, "guestId:", guestId);
        if (!userId && !guestId) {
            console.log("[listResumes] No userId or guestId found");
            return res.status(401).json({ error: "not authenticated" });
        }
        const items = await resumeService.list(userId, guestId);
        console.log("[listResumes] Found resumes:", items.length);
        // Auto-link any guest-owned resumes to this user if they are logged in
        if (userId && guestId) {
            // Find guest resumes for this id
            const guestResumes = items.filter(item => !item.ownerId && item.id);
            if (guestResumes.length > 0) {
                const guestIds = guestResumes.map(r => r.id);
                // Update in DB: Assign owner and CLEAR guestId to prevent leakage
                await Resume_1.default.updateMany({ _id: { $in: guestIds } }, {
                    $set: { ownerId: userId, guestId: null }
                });
                // Also ensure they are in the user's resumes array
                await User_1.default.findByIdAndUpdate(userId, { $addToSet: { resumes: { $each: guestIds } } });
            }
        }
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        if (!userId && !guestId) {
            return res.status(401).json({ error: "not authenticated" });
        }
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Check for admin access first
        if (userId) {
            const user = await User_1.default.findById(userId);
            if (user && user.role === "admin") {
                // Admin can access any resume
                const adminResume = await Resume_1.default.findById(id);
                if (!adminResume) {
                    return res.status(404).json({ error: "Resume not found" });
                }
                const item = await resumeService.get(id, null, null);
                if (!item)
                    return res.status(404).json({ error: "not found" });
                // Get the latest version and populate data
                const latestVersion = item.versions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                if (latestVersion) {
                    await populateVersionData(latestVersion);
                }
                return res.json(item);
            }
        }
        // Regular user/guest access - use service with proper auth
        const item = await resumeService.get(id, userId, guestId);
        if (!item)
            return res.status(404).json({ error: "not found" });
        // Auto-link ownerId if the user is authenticated but the resume only has a guestId
        if (userId && !item.ownerId) {
            await Resume_1.default.findByIdAndUpdate(id, {
                $set: { ownerId: userId, guestId: null }
            });
            // Also update user's resumes array
            await User_1.default.findByIdAndUpdate(userId, { $addToSet: { resumes: id } });
        }
        // Get the latest version
        const latestVersion = item.versions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        if (latestVersion) {
            await populateVersionData(latestVersion);
        }
        res.json(item);
    }
    catch (err) {
        console.error("getResume error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
// Helper function to populate version data
async function populateVersionData(latestVersion) {
    // console.log(
    //   "[getResume] Latest version data keys:",
    //   Object.keys(latestVersion.data || {})
    // );
    // Languages
    if (latestVersion.languages && latestVersion.languages.length > 0) {
        const languages = await Language_1.default.find({
            _id: { $in: latestVersion.languages }
        }).select("name proficiency capability");
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.languages = languages.map((l) => ({
            language: l.name,
            level: l.proficiency || "Intermediate",
            capability: l.capability || "",
        }));
    }
    // Hobbies
    if (latestVersion.hobbies && latestVersion.hobbies.length > 0) {
        const hobbies = await Hobby_1.default.find({
            _id: { $in: latestVersion.hobbies }
        }).select("name");
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.hobbies = hobbies.map((h) => h.name);
    }
    // Certifications
    if (latestVersion.certifications && latestVersion.certifications.length > 0) {
        const certifications = await Certification_1.default.find({
            _id: { $in: latestVersion.certifications }
        }).select("name issuer date url");
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.certifications = certifications.map((c) => ({
            id: c._id.toString(),
            name: c.name,
            issuer: c.issuer,
            date: c.date,
            url: c.url,
        }));
    }
    // Awards
    if (latestVersion.awards && latestVersion.awards.length > 0) {
        const awards = await Award_1.default.find({
            _id: { $in: latestVersion.awards }
        }).select("title organization issueYear description");
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.awards = awards.map((a) => ({
            id: a._id.toString(),
            title: a.title,
            organization: a.organization,
            issueYear: a.issueYear,
            description: a.description,
        }));
    }
    // Speaking Engagements
    if (latestVersion.speakingEngagements && latestVersion.speakingEngagements.length > 0) {
        const speakingEngagements = await SpeakingEngagement_1.default.find({
            _id: { $in: latestVersion.speakingEngagements }
        }).select("topic eventName organization date location description url");
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.speakingEngagements = speakingEngagements.map((s) => ({
            id: s._id.toString(),
            topic: s.topic,
            eventName: s.eventName,
            organization: s.organization,
            date: s.date,
            location: s.location,
            description: s.description,
            url: s.url,
        }));
    }
    // Memberships
    if (latestVersion.memberships && latestVersion.memberships.length > 0) {
        const memberships = await Membership_1.default.find({
            _id: { $in: latestVersion.memberships }
        }).select("organization membershipType startDate endDate description url");
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.memberships = memberships.map((m) => ({
            id: m._id.toString(),
            organization: m.organization,
            membershipType: m.membershipType,
            startDate: m.startDate,
            endDate: m.endDate,
            description: m.description,
            url: m.url,
        }));
    }
    // Workshops
    if (latestVersion.workshops && latestVersion.workshops.length > 0) {
        const workshops = await Workshop_1.default.find({
            _id: { $in: latestVersion.workshops }
        }).select("title instructor organization date location description certificateUrl");
        if (!latestVersion.data)
            latestVersion.data = {};
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
    }
    // Custom Sections with entries
    if (latestVersion.customSections && latestVersion.customSections.length > 0) {
        const customSections = await CustomSection_1.default.find({
            _id: { $in: latestVersion.customSections }
        }).populate("entries");
        if (!latestVersion.data)
            latestVersion.data = {};
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
    }
    // Internships
    if (latestVersion.internships && latestVersion.internships.length > 0) {
        const internships = await Internship_1.default.find({
            _id: { $in: latestVersion.internships }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.internships = internships.map((i) => ({
            id: i._id.toString(),
            title: i.title,
            company: i.company,
            location: i.location,
            startDate: i.startDate,
            endDate: i.endDate,
            description: i.description,
            duration: i.duration
        }));
    }
    // References
    if (latestVersion.references && latestVersion.references.length > 0) {
        const references = await Reference_1.default.find({
            _id: { $in: latestVersion.references }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.references = references.map((r) => ({
            id: r._id.toString(),
            name: r.name,
            title: r.title,
            company: r.company,
            email: r.email,
            phone: r.phone,
            relationship: r.relationship,
            designationRelationship: r.designationRelationship,
            contactInformation: r.contactInformation
        }));
    }
    // Client Projects
    if (latestVersion.clientProjects && latestVersion.clientProjects.length > 0) {
        const clientProjects = await ClientProject_1.default.find({
            _id: { $in: latestVersion.clientProjects }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
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
            clientOrganization: p.clientOrganization,
            duration: p.duration,
            toolsTechnologies: p.toolsTechnologies,
            projectUrl: p.projectUrl
        }));
    }
    // Portfolio
    if (latestVersion.portfolio && latestVersion.portfolio.length > 0) {
        const portfolio = await Portfolio_1.default.find({
            _id: { $in: latestVersion.portfolio }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.portfolio = portfolio.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            type: p.type,
            platform: p.platform,
            description: p.description,
            url: p.url
        }));
    }
    // Methodologies
    if (latestVersion.methodologies && latestVersion.methodologies.length > 0) {
        const methodologies = await Methodology_1.default.find({
            _id: { $in: latestVersion.methodologies }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.methodologies = methodologies.map((m) => ({
            id: m._id.toString(),
            name: m.name,
            description: m.description,
            certification: m.certification,
            experienceDuration: m.experienceDuration
        }));
    }
    // Industry Expertise
    if (latestVersion.industryExpertise && latestVersion.industryExpertise.length > 0) {
        const industryExpertise = await IndustryExpertise_1.default.find({
            _id: { $in: latestVersion.industryExpertise }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.industryExpertise = industryExpertise.map((i) => ({
            id: i._id.toString(),
            industry: i.industry,
            years: i.years,
            description: i.description,
            domainArea: i.domainArea,
            experienceDuration: i.experienceDuration
        }));
    }
    // Volunteering
    if (latestVersion.volunteering && latestVersion.volunteering.length > 0) {
        const volunteering = await Volunteering_1.default.find({
            _id: { $in: latestVersion.volunteering }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.volunteering = volunteering.map((v) => ({
            id: v._id.toString(),
            organization: v.organization,
            role: v.role,
            startDate: v.startDate,
            endDate: v.endDate,
            description: v.description,
            causeArea: v.causeArea,
            duration: v.duration
        }));
    }
    // Military Service
    if (latestVersion.militaryService && latestVersion.militaryService.length > 0) {
        const militaryService = await MilitaryService_1.default.find({
            _id: { $in: latestVersion.militaryService }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.militaryService = militaryService.map((m) => ({
            id: m._id.toString(),
            branch: m.branch,
            rank: m.rank,
            unit: m.unit,
            startDate: m.startDate,
            endDate: m.endDate,
            description: m.description,
            duration: m.duration,
            specialization: m.specialization
        }));
    }
    // Teaching Experience
    if (latestVersion.teachingExperience && latestVersion.teachingExperience.length > 0) {
        const teachingExperience = await TeachingExperience_1.default.find({
            _id: { $in: latestVersion.teachingExperience }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.teachingExperience = teachingExperience.map((t) => ({
            id: t._id.toString(),
            title: t.title,
            institution: t.institution,
            course: t.course,
            startDate: t.startDate,
            endDate: t.endDate,
            description: t.description,
            subjectCourseTaught: t.subjectCourseTaught,
            duration: t.duration
        }));
    }
    // Mentorship Experience
    if (latestVersion.mentorshipExperience && latestVersion.mentorshipExperience.length > 0) {
        const mentorshipExperience = await MentorshipExperience_1.default.find({
            _id: { $in: latestVersion.mentorshipExperience }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.mentorshipExperience = mentorshipExperience.map((m) => ({
            id: m._id.toString(),
            menteeName: m.menteeName,
            menteeCount: m.menteeCount,
            program: m.program,
            organization: m.organization,
            startDate: m.startDate,
            endDate: m.endDate,
            description: m.description,
            mentorshipArea: m.mentorshipArea,
            organizationPlatform: m.organizationPlatform,
            menteeLevel: m.menteeLevel,
            duration: m.duration
        }));
    }
    // Research Grants
    if (latestVersion.researchGrants && latestVersion.researchGrants.length > 0) {
        const researchGrants = await ResearchGrant_1.default.find({
            _id: { $in: latestVersion.researchGrants }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.researchGrants = researchGrants.map((r) => ({
            id: r._id.toString(),
            title: r.title,
            agency: r.agency,
            amount: r.amount,
            startDate: r.startDate,
            endDate: r.endDate,
            description: r.description,
            year: r.year
        }));
    }
    // Test Scores
    if (latestVersion.testScores && latestVersion.testScores.length > 0) {
        const testScores = await TestScore_1.default.find({
            _id: { $in: latestVersion.testScores }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.testScores = testScores.map((t) => ({
            id: t._id.toString(),
            testName: t.testName,
            score: t.score,
            maxScore: t.maxScore,
            date: t.date,
            percentileRank: t.percentileRank,
            year: t.year
        }));
    }
    // Patents
    if (latestVersion.patents && latestVersion.patents.length > 0) {
        const patents = await Patent_1.default.find({
            _id: { $in: latestVersion.patents }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.patents = patents.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            inventors: p.inventors,
            patentNumber: p.patentNumber,
            filingDate: p.filingDate,
            issueDate: p.issueDate,
            status: p.status,
            issuingAuthority: p.issuingAuthority,
            year: p.year
        }));
    }
    // Publications
    if (latestVersion.publications && latestVersion.publications.length > 0) {
        const publications = await Publication_1.default.find({
            _id: { $in: latestVersion.publications }
        });
        if (!latestVersion.data)
            latestVersion.data = {};
        latestVersion.data.publications = publications.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            journalPublisher: p.journal,
            publicationType: p.conference,
            year: p.publicationDate,
            urlDoi: p.doi,
            authors: p.authors,
        }));
    }
    // Professional Context
    if (latestVersion.professionalContext && latestVersion.professionalContext.length > 0) {
        const professionalContext = await ProfessionalContext_1.default.find({
            _id: { $in: latestVersion.professionalContext }
        });
        if (professionalContext.length > 0 && !latestVersion.data) {
            latestVersion.data = {};
        }
        if (professionalContext.length > 0) {
            const pc = professionalContext[0];
            latestVersion.data.professionalContext = {
                id: pc._id.toString(),
                totalExperience: pc.totalExperience,
                teamSize: pc.teamSize,
                industry: pc.industry,
                industryCustom: pc.industryCustom,
                functionalDomain: pc.functionalDomain,
                functionalDomainCustom: pc.functionalDomainCustom,
                geographicScope: pc.geographicScope,
                revenueResponsibility: pc.revenueResponsibility,
            };
        }
    }
    // console.log(
    //   "[getResume] Final data keys:",
    //   Object.keys(latestVersion.data || {})
    // );
}
async function updateResume(req, res) {
    try {
        const id = getStringParam(req.params.id);
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        const { data, template, title } = req.body;
        console.log("[updateResume] Received data keys:", Object.keys(data || {}));
        if (!userId && !guestId) {
            return res.status(401).json({ error: "not authenticated" });
        }
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!data && !template && !title)
            return res
                .status(400)
                .json({ error: "data, template, or title required" });
        // Verify resume ownership - use single field based on auth type
        let query = { _id: id };
        if (userId && guestId) {
            query.$or = [{ ownerId: userId }, { guestId: guestId }];
        }
        else if (userId) {
            query.ownerId = userId;
        }
        else if (guestId) {
            query.guestId = guestId;
        }
        const resume = await Resume_1.default.findOne(query);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Auto-link ownerId if the user is authenticated but the resume only has a guestId
        if (userId && !resume.ownerId) {
            resume.ownerId = new mongoose_1.default.Types.ObjectId(userId);
            await resume.save();
        }
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
            // IMPORTANT: Do NOT merge with previous data
            // Instead, use the incoming data as the complete source of truth
            // This ensures deletions are properly handled
            const newData = { ...data };
            const version = new ResumeVersion_1.default({
                resumeId: id,
                resume: id,
                data: newData,
            });
            await version.save();
            resume.versions.push(version._id);
            await resume.save();
            console.log("[updateResume] Created version with data keys:", Object.keys(version.data));
            // Handle all the sub-documents (languages, hobbies, etc.)
            // IMPORTANT: Delete all existing sub-documents for this version
            // and recreate them from the incoming data
            // Languages
            await Language_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.languages && Array.isArray(newData.languages) && newData.languages.length > 0) {
                const langDocs = newData.languages.map((lang) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    name: lang.language,
                    proficiency: lang.level,
                    capability: lang.capability,
                }));
                await Language_1.default.insertMany(langDocs);
            }
            // Hobbies
            await Hobby_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.hobbies && Array.isArray(newData.hobbies) && newData.hobbies.length > 0) {
                const hobbyDocs = newData.hobbies.map((hobby) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    name: hobby,
                }));
                await Hobby_1.default.insertMany(hobbyDocs);
            }
            // Certifications
            await Certification_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.certifications && Array.isArray(newData.certifications) && newData.certifications.length > 0) {
                const certDocs = newData.certifications.map((cert) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    name: cert.name,
                    issuer: cert.issuer,
                    date: cert.date,
                    url: cert.url,
                }));
                await Certification_1.default.insertMany(certDocs);
            }
            // Awards
            await Award_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.awards && Array.isArray(newData.awards) && newData.awards.length > 0) {
                const awardDocs = newData.awards.map((award) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    title: award.title,
                    organization: award.organization,
                    issueYear: award.issueYear,
                    description: award.description,
                }));
                await Award_1.default.insertMany(awardDocs);
            }
            // Speaking Engagements
            await SpeakingEngagement_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.speakingEngagements && Array.isArray(newData.speakingEngagements) && newData.speakingEngagements.length > 0) {
                const docs = newData.speakingEngagements.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    topic: item.topic,
                    eventName: item.eventName,
                    organization: item.organization,
                    date: item.date,
                    location: item.location,
                    description: item.description,
                    url: item.url,
                }));
                await SpeakingEngagement_1.default.insertMany(docs);
            }
            // Memberships
            await Membership_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.memberships && Array.isArray(newData.memberships) && newData.memberships.length > 0) {
                const docs = newData.memberships.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    organization: item.organization,
                    membershipType: item.membershipType,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    description: item.description,
                    url: item.url,
                }));
                await Membership_1.default.insertMany(docs);
            }
            // Workshops
            await Workshop_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.workshops && Array.isArray(newData.workshops) && newData.workshops.length > 0) {
                const docs = newData.workshops.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    title: item.title,
                    instructor: item.instructor,
                    organization: item.organization,
                    date: item.date,
                    location: item.location,
                    description: item.description,
                    certificateUrl: item.certificateUrl,
                }));
                await Workshop_1.default.insertMany(docs);
            }
            // Social Links
            await SocialLink_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.socialLinks && Array.isArray(newData.socialLinks) && newData.socialLinks.length > 0) {
                const validSocialLinks = newData.socialLinks.filter((link) => link.urlText && link.url && link.url.trim() !== "");
                if (validSocialLinks.length > 0) {
                    const socialLinkDocs = validSocialLinks.map((link) => ({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        text: link.urlText,
                        url: link.url,
                    }));
                    await SocialLink_1.default.insertMany(socialLinkDocs);
                }
            }
            // Custom Sections
            await CustomSection_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.customSections && Array.isArray(newData.customSections) && newData.customSections.length > 0) {
                for (const section of newData.customSections) {
                    const sectionDoc = new CustomSection_1.default({
                        resumeId: version._id,
                        resumeVersion: version._id,
                        title: section.heading,
                        isVisible: section.isVisible,
                    });
                    await sectionDoc.save();
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
            // Internships
            await Internship_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.internships && Array.isArray(newData.internships) && newData.internships.length > 0) {
                const docs = newData.internships.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    title: item.title,
                    company: item.company,
                    location: item.location,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    description: item.description,
                    duration: item.duration,
                }));
                await Internship_1.default.insertMany(docs);
            }
            // Academic Projects
            await AcademicProject_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.academicProjects && Array.isArray(newData.academicProjects) && newData.academicProjects.length > 0) {
                const docs = newData.academicProjects.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    title: item.name || item.title,
                    course: item.course,
                    institution: item.institution,
                    duration: item.duration,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    description: item.description,
                    technologies: Array.isArray(item.technologies) ? item.technologies : [],
                    url: item.url,
                }));
                await AcademicProject_1.default.insertMany(docs);
            }
            // Leadership Positions
            await LeadershipPosition_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.leadershipPositions && Array.isArray(newData.leadershipPositions) && newData.leadershipPositions.length > 0) {
                const docs = newData.leadershipPositions.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    title: item.position || item.title,
                    organization: item.organization,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    description: item.description,
                }));
                await LeadershipPosition_1.default.insertMany(docs);
            }
            // Training Programs
            await TrainingProgram_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.trainingPrograms && Array.isArray(newData.trainingPrograms) && newData.trainingPrograms.length > 0) {
                const docs = newData.trainingPrograms.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    name: item.name,
                    organization: item.provider,
                    completionDate: item.completionDate,
                    duration: item.duration,
                    description: item.description,
                }));
                await TrainingProgram_1.default.insertMany(docs);
            }
            // Scholarships
            await Scholarship_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.scholarships && Array.isArray(newData.scholarships) && newData.scholarships.length > 0) {
                const docs = newData.scholarships.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    name: item.name,
                    provider: item.provider,
                    year: item.year,
                    amount: item.amount,
                    description: item.description,
                }));
                await Scholarship_1.default.insertMany(docs);
            }
            // Co-curricular
            await CoCurricular_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.coCurricular && Array.isArray(newData.coCurricular) && newData.coCurricular.length > 0) {
                const docs = newData.coCurricular.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
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
            // Extracurricular
            await Extracurricular_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.extracurricular && Array.isArray(newData.extracurricular) && newData.extracurricular.length > 0) {
                const docs = newData.extracurricular.map((item) => ({
                    resumeId: version._id,
                    resumeVersion: version._id,
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
            // Career Objective
            await CareerObjective_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.careerObjective && typeof newData.careerObjective === "string" && newData.careerObjective.trim()) {
                const doc = new CareerObjective_1.default({
                    resumeId: version._id,
                    resumeVersion: version._id,
                    objective: newData.careerObjective,
                });
                await doc.save();
            }
            // Professional Context
            await ProfessionalContext_1.default.deleteMany({ resumeVersion: version._id });
            if (newData.professionalContext && typeof newData.professionalContext === "object") {
                const { totalExperience, teamSize, industry, industryCustom, functionalDomain, functionalDomainCustom, geographicScope, revenueResponsibility, } = newData.professionalContext;
                if (totalExperience || teamSize || industry || industryCustom ||
                    functionalDomain || functionalDomainCustom || geographicScope || revenueResponsibility) {
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
                }
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        if (!userId && !guestId) {
            return res.status(401).json({ error: "not authenticated" });
        }
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        const deleted = await resumeService.remove(id, userId, guestId);
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        const { data, template } = req.body;
        if (!userId && !guestId) {
            return res.status(401).json({ error: "not authenticated" });
        }
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume ownership - use single field based on auth type
        let query = { _id: id };
        if (userId) {
            query.ownerId = userId;
        }
        else if (guestId) {
            query.guestId = guestId;
        }
        const resume = await Resume_1.default.findOne(query);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check if resume is paid
        if (!resume.isDownloadPaid) {
            return res.status(402).json({ error: "Payment required to generate files", type: "download" });
        }
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        if (!userId && !guestId) {
            return res.status(401).json({ error: "not authenticated" });
        }
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume ownership - use single field based on auth type
        let query = { _id: id };
        if (userId) {
            query.ownerId = userId;
        }
        else if (guestId) {
            query.guestId = guestId;
        }
        const resume = await Resume_1.default.findOne(query);
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        if (!userId && !guestId) {
            return res.status(401).json({ error: "not authenticated" });
        }
        if (!fileId || fileId === "undefined")
            return res.status(400).json({ error: "Invalid file ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(fileId))
            return res.status(400).json({ error: "Invalid file ID" });
        // Get file info and verify ownership
        const file = await ResumeFile_1.default.findById(fileId).populate("resumeId");
        if (!file || !file.resumeId) {
            return res.status(404).json({ error: "file not found" });
        }
        // Check ownership - use single field based on auth type
        let query = { _id: file.resumeId };
        if (userId) {
            query.ownerId = userId;
        }
        else if (guestId) {
            query.guestId = guestId;
        }
        const resume = await Resume_1.default.findOne(query);
        if (!resume) {
            return res.status(404).json({ error: "file not found" });
        }
        // Check if resume is paid
        if (!resume.isDownloadPaid) {
            return res.status(402).json({ error: "Payment required to download files", type: "download" });
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
async function markPaid(req, res) {
    try {
        const id = req.params.id || req.body.id;
        const { type } = req.body; // "download" or "ai"
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        console.log(`[markPaid] START - id: ${id}, userId: ${userId}, guestId: ${guestId}, type: ${type}`);
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!type || !["download", "ai"].includes(type))
            return res.status(400).json({ error: "Invalid payment type" });
        // 1. Fetch resume by ID ONLY (first)
        const resume = await Resume_1.default.findById(id);
        if (!resume) {
            console.warn(`[markPaid] Resume not found for ID: ${id}`);
            return res.status(404).json({ error: "resume not found" });
        }
        // 2. Ownership & Branding Check
        // If user is logged in, they can pay for their own or a guest resume (to take ownership)
        const isOwner = (userId && resume.ownerId && resume.ownerId.toString() === userId.toString());
        const isGuestOwner = (guestId && resume.guestId === guestId);
        if (!isOwner && !isGuestOwner) {
            // If resume is unowned (guest) and user is logged in, link them now!
            if (!resume.ownerId && userId) {
                console.log(`[markPaid] Linking guest resume ${id} to user ${userId}`);
                resume.ownerId = new mongoose_1.default.Types.ObjectId(userId);
            }
            else {
                console.warn(`[markPaid] ACCESS DENIED: Identity mismatch for resume ${id}`);
                return res.status(401).json({ error: "Not authenticated/Access denied" });
            }
        }
        console.log(`[markPaid] Found Resume: ${resume._id}. Initial DownloadPaid: ${resume.isDownloadPaid}, AI Paid: ${resume.isAiPaid}`);
        if (type === "download") {
            resume.isDownloadPaid = true;
        }
        else if (type === "ai") {
            resume.isAiPaid = true;
        }
        await resume.save();
        res.json({ success: true, isDownloadPaid: resume.isDownloadPaid, isAiPaid: resume.isAiPaid });
    }
    catch (err) {
        console.error("markPaid error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function markDownloaded(req, res) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        if (!id || id === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        const query = { _id: id };
        if (userId && guestId) {
            query.$or = [{ ownerId: userId }, { guestId }];
        }
        else if (userId) {
            query.ownerId = userId;
        }
        else if (guestId) {
            query.guestId = guestId;
        }
        else {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const resume = await Resume_1.default.findOne(query);
        if (!resume)
            return res.status(404).json({ error: "Resume not found or access denied" });
        resume.isDownloaded = true;
        await resume.save();
        console.log(`[markDownloaded] Resume ${id} marked as downloaded`);
        return res.json({ success: true, isDownloaded: true });
    }
    catch (err) {
        console.error("markDownloaded error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
//rename resume title
async function renameResume(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { id } = req.params;
        const { title } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        // Get user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        //  Plan check
        if (user.subscriptionPlan !== "freelancer") {
            return res.status(403).json({
                error: "Only freelancer plan can rename resume",
            });
        }
        // Update resume (ownership check included)
        const resume = await Resume_1.default.findOneAndUpdate({ _id: id, ownerId: userId }, { title: title.trim() }, { new: true });
        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }
        return res.json({
            message: "Title updated successfully",
            resume,
        });
    }
    catch (err) {
        console.error("renameResume error:", err);
        res.status(500).json({ error: err.message || "Internal error" });
    }
}

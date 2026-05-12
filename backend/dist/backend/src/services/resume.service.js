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
exports.create = create;
exports.list = list;
exports.get = get;
exports.remove = remove;
exports.saveHtmlVersion = saveHtmlVersion;
exports.savePdfVersion = savePdfVersion;
exports.generateAndSaveFiles = generateAndSaveFiles;
const Resume_1 = __importDefault(require("../models/Resume"));
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const ResumeFile_1 = __importDefault(require("../models/ResumeFile"));
const SocialLink_1 = __importDefault(require("../models/SocialLink"));
const cloudinaryService = __importStar(require("./cloudinary.service"));
const templateService = __importStar(require("./template.service"));
const pdfService = __importStar(require("./pdf.service"));
function transformDates(obj) {
    if (typeof obj === "string") {
        const date = new Date(obj);
        if (!isNaN(date.getTime())) {
            const options = {
                year: "numeric",
                month: "long",
            };
            return date.toLocaleDateString("en-US", options).toLowerCase();
        }
        return obj;
    }
    else if (Array.isArray(obj)) {
        return obj.map(transformDates);
    }
    else if (obj && typeof obj === "object") {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = transformDates(obj[key]);
        }
        return newObj;
    }
    return obj;
}
async function create(payload, ownerId) {
    const resumeData = {
        title: payload.title || "Untitled",
        template: payload.template || "modern",
        ownerId,
    };
    // Extract candidateName from initial data if provided
    if (payload.data?.personal?.name) {
        resumeData.candidateName = payload.data.personal.name;
    }
    const r = new Resume_1.default(resumeData);
    await r.save();
    // Always create an initial version with default data
    const initialData = payload.data
        ? transformDates(payload.data)
        : {
            personal: {
                name: "Your Name",
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
                fullAddress: "",
                image: "",
                middleName: "",
            },
            summary: "Brief professional summary highlighting your key skills and experience.",
            careerObjective: "",
            experience: [
                {
                    id: "exp-1",
                    title: "Software Engineer",
                    company: "Example Company",
                    domain: "Technology",
                    location: "San Francisco, CA",
                    startDate: "2022-01",
                    endDate: "Present",
                    isCurrent: true,
                    description: "Leading development of scalable web applications using React and Node.js.",
                    achievements: "• Increased user engagement by 25%\n• Led team of 5 developers\n• Implemented CI/CD pipeline reducing deployment time by 40%",
                },
            ],
            projects: [],
            education: [],
            skills: ["Skill 1", "Skill 2", "Skill 3"],
            languages: [],
            hobbies: [],
            keyAchievements: [],
            responsibilities: [],
            tools: [],
            socialLinks: [],
            certifications: [],
            awards: [],
            fontSize: 16,
            fontFamily: "Arial, sans-serif",
        };
    const version = new ResumeVersion_1.default({
        resumeId: r._id,
        resume: r._id,
        data: initialData,
    });
    await version.save();
    r.versions.push(version._id);
    await r.save();
    return r;
}
async function list(ownerId) {
    console.log("[resumeService.list] Starting query for ownerId:", ownerId);
    try {
        // First, count resumes without population for debugging
        const count = await Resume_1.default.countDocuments({ ownerId });
        console.log("[resumeService.list] Found", count, "resumes for ownerId:", ownerId);
        if (count === 0) {
            console.log("[resumeService.list] No resumes found, returning empty array");
            return [];
        }
        // Now fetch with population
        console.log("[resumeService.list] Fetching resumes with population...");
        const resumes = await Resume_1.default.find({ ownerId })
            .populate({
            path: "versions",
            options: { sort: { createdAt: -1 }, limit: 1 }, // Only get latest version
        })
            .populate("files")
            .sort({ updatedAt: -1 }); // Sort by most recently updated
        console.log("[resumeService.list] Successfully fetched", resumes.length, "resumes");
        // Transform the data to match frontend expectations
        const transformed = resumes.map((resume) => ({
            id: resume._id.toString(),
            title: resume.title,
            candidateName: resume.candidateName || "Unknown Candidate",
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
            template: resume.template,
            versions: resume.versions,
            files: resume.files,
        }));
        console.log("[resumeService.list] Transformed", transformed.length, "resumes");
        return transformed;
    }
    catch (error) {
        console.error("[resumeService.list] Error:", error);
        throw error;
    }
}
async function get(id, ownerId) {
    return Resume_1.default.findOne({ _id: id, ownerId })
        .populate("versions")
        .populate("files");
}
async function remove(id, ownerId) {
    // Get resume files to delete from Cloudinary
    const files = await ResumeFile_1.default.find({ resumeId: id });
    // Delete files from Cloudinary
    for (const file of files) {
        if (file.publicId) {
            try {
                await cloudinaryService.deleteFile(file.publicId);
            }
            catch (error) {
                console.error(`Failed to delete Cloudinary file ${file.publicId}:`, error);
            }
        }
    }
    // Get version ids to delete socialLinks
    const versions = await ResumeVersion_1.default.find({ resumeId: id }).select("_id");
    // Delete associated files, socialLinks, and versions first
    await ResumeFile_1.default.deleteMany({ resumeId: id });
    await SocialLink_1.default.deleteMany({
        resumeId: { $in: versions.map((v) => v._id) },
    });
    await ResumeVersion_1.default.deleteMany({ resumeId: id });
    return Resume_1.default.findByIdAndDelete(id);
}
async function saveHtmlVersion(resumeId, htmlContent, filename) {
    try {
        const uploadResult = await cloudinaryService.uploadHTML(htmlContent, resumeId, "html");
        // Save file metadata to database
        const file = new ResumeFile_1.default({
            resumeId,
            resume: resumeId,
            filename: filename || `resume-${resumeId}-${Date.now()}.html`,
            publicId: uploadResult.public_id,
            url: uploadResult.url,
            secureUrl: uploadResult.secure_url,
            format: "html",
            mimeType: "text/html",
            size: uploadResult.bytes,
            resourceType: uploadResult.resource_type,
        });
        await file.save();
        return file;
    }
    catch (error) {
        console.error("Failed to save HTML version:", error);
        throw error;
    }
}
async function savePdfVersion(resumeId, pdfBuffer, filename) {
    try {
        const uploadResult = await cloudinaryService.uploadPDF(pdfBuffer, resumeId);
        // Save file metadata to database
        const file = new ResumeFile_1.default({
            resumeId,
            resume: resumeId,
            filename: filename || `resume-${resumeId}-${Date.now()}.pdf`,
            publicId: uploadResult.public_id,
            url: uploadResult.url,
            secureUrl: uploadResult.secure_url,
            format: "pdf",
            mimeType: "application/pdf",
            size: uploadResult.bytes,
            resourceType: uploadResult.resource_type,
        });
        await file.save();
        return file;
    }
    catch (error) {
        console.error("Failed to save PDF version:", error);
        throw error;
    }
}
async function generateAndSaveFiles(resumeId, data, template) {
    try {
        // Generate HTML
        const htmlContent = await templateService.renderResumeHtml(resumeId, template, undefined, data);
        await saveHtmlVersion(resumeId, htmlContent);
        // Generate and save PDF
        const pdfBuffer = await pdfService.generatePdfBuffer(htmlContent);
        await savePdfVersion(resumeId, pdfBuffer);
        return { success: true };
    }
    catch (error) {
        console.error("Failed to generate and save files:", error);
        throw error;
    }
}

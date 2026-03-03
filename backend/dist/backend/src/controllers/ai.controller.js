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
exports.enhanceResume = enhanceResume;
exports.getSuggestions = getSuggestions;
exports.suggestSkills = suggestSkills;
exports.getAutoSuggestions = getAutoSuggestions;
exports.suggestSkillsByJobTitle = suggestSkillsByJobTitle;
exports.suggestHobbies = suggestHobbies;
exports.suggestDescriptionParagraphs = suggestDescriptionParagraphs;
exports.suggestSummaryParagraphs = suggestSummaryParagraphs;
exports.suggestKeyAchievements = suggestKeyAchievements;
exports.translateText = translateText;
const aiService = __importStar(require("../services/ai.service"));
const Resume_1 = __importDefault(require("../models/Resume"));
const User_1 = __importDefault(require("../models/User"));
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const mongoose_1 = __importDefault(require("mongoose"));
async function enhanceResume(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { section, tone = "professional", maxLength } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!section)
            return res.status(400).json({ error: "section text required" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const enhanced = await aiService.enhanceText(section, tone, maxLength);
        res.json({ original: section, enhanced, tone });
    }
    catch (err) {
        console.error("enhance error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function getSuggestions(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { section } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!section)
            return res.status(400).json({ error: "section text required" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const suggestions = await aiService.suggestImprovements(section);
        res.json({ suggestions });
    }
    catch (err) {
        console.error("suggestions error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function suggestSkills(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { summary } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume exists and get the latest version
        const resume = await Resume_1.default.findById(resumeId).populate({
            path: "versions",
            options: { sort: { createdAt: -1 }, limit: 1 },
        });
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const latestVersion = resume.versions[0];
        const resumeData = latestVersion?.data;
        const summaryToUse = summary || resumeData?.summary;
        if (!summaryToUse) {
            return res.status(400).json({
                error: "No professional summary found to suggest skills from",
            });
        }
        const suggestedSkills = await aiService.suggestSkills(summaryToUse);
        res.json({ suggestions: suggestedSkills });
    }
    catch (err) {
        console.error("suggest skills error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function getAutoSuggestions(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { text, context, metadata } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!text)
            return res.status(400).json({ error: "text is required" });
        if (!context)
            return res.status(400).json({ error: "context is required" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        // Validate context - strict validation with logging
        const validContexts = ["summary", "experience", "project", "skills"];
        if (!validContexts.includes(context)) {
            console.error(`[AI Controller] Invalid context received: "${context}". Valid contexts: ${validContexts.join(", ")}`);
            return res.status(400).json({
                error: `Invalid context: "${context}". Must be one of: ${validContexts.join(", ")}`,
            });
        }
        // For summary or skills context, calculate experience data
        let enhancedMetadata = metadata || {};
        if (context === "summary" || context === "skills") {
            try {
                // Get the latest resume version to access experience data
                const latestVersion = await ResumeVersion_1.default.findOne({
                    resumeId: resumeId,
                }).sort({ createdAt: -1 });
                const resumeData = latestVersion?.data || {};
                // Calculate total years of experience
                let totalYears = 0;
                const currentDate = new Date();
                if (resumeData.experience && Array.isArray(resumeData.experience)) {
                    for (const exp of resumeData.experience) {
                        if (exp.startDate) {
                            const start = new Date(exp.startDate);
                            const end = exp.endDate ? new Date(exp.endDate) : currentDate;
                            const years = (end.getTime() - start.getTime()) /
                                (1000 * 60 * 60 * 24 * 365.25);
                            totalYears += Math.max(0, years);
                        }
                    }
                }
                totalYears = Math.round(totalYears);
                // Extract key experience information
                const experienceSummary = resumeData.experience && Array.isArray(resumeData.experience)
                    ? resumeData.experience
                        .slice(0, 3)
                        .map((exp) => `${exp.title || "Role"} at ${exp.company || "Company"}`)
                        .join(", ")
                    : "";
                // Extract key achievements from experience descriptions
                const keyAchievements = resumeData.experience && Array.isArray(resumeData.experience)
                    ? resumeData.experience
                        .slice(0, 2)
                        .map((exp) => {
                        const desc = exp.description || "";
                        // Extract first sentence or key phrases
                        const sentences = desc
                            .split(/[.!?]+/)
                            .filter((s) => s.trim().length > 10);
                        return sentences.slice(0, 2).join(". ").trim();
                    })
                        .filter((ach) => ach.length > 0)
                        .join("; ")
                    : "";
                // Extract tech stack from skills and projects
                const techStackSet = new Set();
                if (resumeData.skills && Array.isArray(resumeData.skills)) {
                    resumeData.skills.forEach((skill) => {
                        if (typeof skill === "string") {
                            techStackSet.add(skill);
                        }
                        else if (skill.name) {
                            techStackSet.add(skill.name);
                        }
                    });
                }
                if (resumeData.projects && Array.isArray(resumeData.projects)) {
                    resumeData.projects.forEach((project) => {
                        if (project.technologies && Array.isArray(project.technologies)) {
                            project.technologies.forEach((tech) => techStackSet.add(tech));
                        }
                    });
                }
                const techStack = Array.from(techStackSet).slice(0, 10).join(", "); // Limit to 10
                enhancedMetadata = {
                    ...enhancedMetadata,
                    totalYears,
                    experienceSummary,
                    keyAchievements,
                    experienceCount: resumeData.experience?.length || 0,
                    techStack,
                };
            }
            catch (error) {
                console.warn("[AI Controller] Failed to calculate experience data:", error);
            }
        }
        const suggestions = await aiService.getAutoSuggestions(text, context, enhancedMetadata, undefined // numSuggestions
        );
        res.json({ suggestions });
    }
    catch (err) {
        console.error("auto suggestions error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function suggestSkillsByJobTitle(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { jobTitle, industry, experienceData } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!jobTitle)
            return res.status(400).json({ error: "job title is required" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const suggestedSkills = await aiService.suggestSkillsByCategories(jobTitle, industry, experienceData // Pass experience data for context-aware skill generation
        );
        res.json({ suggestions: suggestedSkills });
    }
    catch (err) {
        console.error("suggest skills by job title error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function suggestHobbies(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { jobTitle, industry } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume exists and get the latest version
        const resume = await Resume_1.default.findById(resumeId).populate({
            path: "versions",
            options: { sort: { createdAt: -1 }, limit: 1 },
        });
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const latestVersion = resume.versions[0];
        const resumeData = latestVersion?.data;
        const existingHobbies = resumeData?.hobbies || [];
        const suggestedHobbies = await aiService.suggestHobbies(jobTitle, industry, existingHobbies);
        res.json({ suggestions: suggestedHobbies });
    }
    catch (err) {
        console.error("suggest hobbies error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function suggestDescriptionParagraphs(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { context, currentDescription, metadata } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!context)
            return res.status(400).json({ error: "context is required" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const suggestedParagraphs = await aiService.suggestDescriptionParagraphs(context, currentDescription || "", { ...metadata, type: "description" });
        res.json({ suggestions: suggestedParagraphs });
    }
    catch (err) {
        console.error("suggest description paragraphs error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function suggestSummaryParagraphs(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { currentSummary, jobTitle, industry, keywords } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume exists and get the latest version
        const resume = await Resume_1.default.findById(resumeId).populate({
            path: "versions",
            options: { sort: { createdAt: -1 }, limit: 1 },
        });
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        // Get the latest resume data
        const latestVersion = resume.versions[0];
        const resumeData = latestVersion?.data;
        // Extract experience data for context
        const experience = resumeData?.experience || [];
        const projects = resumeData?.projects || [];
        // Build detailed context from resume data
        const experienceSummary = experience.length > 0
            ? experience
                .map((exp) => {
                const title = exp.title || "Professional";
                const company = exp.company || "Company";
                const duration = exp.duration || "";
                const description = exp.description
                    ? exp.description.substring(0, 100) + "..."
                    : "";
                return `${title} at ${company}${duration ? ` (${duration})` : ""}${description ? `: ${description}` : ""}`;
            })
                .join("; ")
            : "";
        const projectSummary = projects.length > 0
            ? projects
                .map((p) => {
                const name = p.name || "Project";
                const technologies = p.technologies
                    ? Array.isArray(p.technologies)
                        ? ` (${p.technologies.join(", ")})`
                        : ` (${p.technologies})`
                    : "";
                const description = p.description
                    ? `: ${p.description.substring(0, 80)}...`
                    : "";
                return `${name}${technologies}${description}`;
            })
                .join("; ")
            : "";
        const suggestedParagraphs = await aiService.suggestSummaryParagraphs(currentSummary || "", jobTitle, industry, keywords, experienceSummary, projectSummary, experience.length);
        res.json({ suggestions: suggestedParagraphs });
    }
    catch (err) {
        console.error("suggest summary paragraphs error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function suggestKeyAchievements(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { jobTitle, industry, existingAchievements, company, domain, duration, } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId) {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        // Verify resume exists and get the latest version
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ error: "resume not found" });
        }
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        // Pass metadata for context-aware achievement generation
        const metadata = { company, domain, duration, type: "achievements" };
        const suggestions = await aiService.suggestKeyAchievements(jobTitle, industry, existingAchievements, metadata);
        res.json({ suggestions });
    }
    catch (err) {
        console.error("suggest key achievements error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function translateText(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const { text, targetLanguage } = req.body;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!text)
            return res.status(400).json({ error: "text required" });
        if (!targetLanguage)
            return res.status(400).json({ error: "targetLanguage required" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        // Translation feature is temporarily disabled
        res.status(501).json({
            error: "Translation feature is not available",
            message: "Please try again later",
        });
    }
    catch (err) {
        console.error("translate error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}

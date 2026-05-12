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
exports.parseDocxHtml = parseDocxHtml;
// docx.parser.ts
const mammoth_1 = __importDefault(require("mammoth"));
const cheerio = __importStar(require("cheerio"));
const section_extractor_1 = require("./section-extractor");
const text_parser_1 = require("./text.parser");
// Define proper return type
async function parseDocxHtml(docxBuffer) {
    try {
        const { value: html } = await mammoth_1.default.convertToHtml({ buffer: docxBuffer });
        // Enhance HTML with data-section attributes for better parsing
        const enhancedHtml = enhanceDocxHtml(html);
        const $ = cheerio.load(enhancedHtml);
        // Get all text for personal info extraction
        const allText = $("body")
            .find("p, div, li, h1, h2, h3, h4, h5, h6, br")
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(Boolean)
            .join("\n");
        // Extract sections
        const sections = (0, section_extractor_1.extractSections)($);
        console.log("Parsed DOCX Sections:", Object.keys(sections));
        // Parse each section using the same logic as text.parser
        const parsed = {
            personal: (0, text_parser_1.extractPersonalInfo)(allText),
            summary: sections.summary || null,
            skills: (0, text_parser_1.parseSkillsImproved)(sections.skills || ""),
            experience: (0, text_parser_1.parseExperienceImproved)(sections.experience || ""),
            education: (0, text_parser_1.parseEducationImproved)(sections.education || ""),
            projects: (0, text_parser_1.parseProjectsImproved)(sections.projects || ""),
            certifications: parseCertificationsImproved(sections.certifications || ""),
            languages: parseLanguagesImproved(sections.languages || ""),
            hobbies: parseHobbiesImproved(sections.hobbies || ""),
            socialLinks: [],
            keyAchievements: [],
            responsibilities: [],
            tools: [],
            customSections: [],
        };
        return parsed;
    }
    catch (error) {
        console.error("DOCX parsing failed:", error);
        throw error;
    }
}
// Helper functions with proper typing
function parseCertificationsImproved(text) {
    const certifications = [];
    const lines = text.split("\n").filter((line) => line.trim());
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length < 5)
            continue;
        // Look for certification patterns
        if (/\b(certified|certification|certificate|aws|azure|google|pmp|scrum)\b/i.test(trimmed)) {
            certifications.push({
                name: trimmed,
                issuer: undefined,
                date: undefined,
                url: undefined,
            });
        }
    }
    return certifications;
}
function parseLanguagesImproved(text) {
    const languages = [];
    const candidates = text
        .split(/[,;•\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 30);
    const languageKeywords = [
        "english",
        "hindi",
        "spanish",
        "french",
        "german",
        "chinese",
        "japanese",
        "arabic",
        "russian",
        "portuguese",
        "italian",
    ];
    for (const candidate of candidates) {
        const lower = candidate.toLowerCase();
        if (languageKeywords.some((lang) => lower.includes(lang))) {
            languages.push(candidate);
        }
        else if (/\b(native|fluent|proficient|intermediate|basic)\b/i.test(lower)) {
            // Likely a language proficiency statement
            languages.push(candidate);
        }
    }
    return [...new Set(languages)];
}
function parseHobbiesImproved(text) {
    const hobbies = [];
    const candidates = text
        .split(/[,;•\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 50);
    const hobbyKeywords = [
        "reading",
        "writing",
        "music",
        "sports",
        "travel",
        "photography",
        "cooking",
        "gaming",
        "hiking",
        "cycling",
        "swimming",
        "yoga",
        "painting",
        "drawing",
        "gardening",
        "volunteering",
    ];
    for (const candidate of candidates) {
        const lower = candidate.toLowerCase();
        if (hobbyKeywords.some((hobby) => lower.includes(hobby))) {
            hobbies.push(candidate);
        }
        else if (!/\b(skills|experience|education|work|professional)\b/i.test(lower)) {
            // Avoid including section headers
            hobbies.push(candidate);
        }
    }
    return [...new Set(hobbies)];
}
// Enhance DOCX HTML with data-section attributes for better parsing
function enhanceDocxHtml(html) {
    // This is a simplified version. In a real implementation, you might use
    // more sophisticated heuristics to identify sections based on headings,
    // styles, etc. For now, we'll wrap it in a basic HTML structure if needed
    if (!html.includes("<html>")) {
        html = `<html><body>${html}</body></html>`;
    }
    // Basic enhancement: add data-section attributes based on common patterns
    // This is a placeholder - you might need more sophisticated logic
    const $ = cheerio.load(html);
    // Try to identify headings and add data-section attributes
    $("h1, h2, h3, h4, strong, b").each((_, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text.includes("summary") ||
            text.includes("profile") ||
            text.includes("objective")) {
            $(el).attr("data-section", "summary");
        }
        else if (text.includes("experience") || text.includes("work")) {
            $(el).attr("data-section", "experience");
        }
        else if (text.includes("education") || text.includes("academic")) {
            $(el).attr("data-section", "education");
        }
        else if (text.includes("skills") || text.includes("expertise")) {
            $(el).attr("data-section", "skills");
        }
        else if (text.includes("projects")) {
            $(el).attr("data-section", "projects");
        }
    });
    return $.html();
}

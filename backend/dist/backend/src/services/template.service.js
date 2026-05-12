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
exports.renderResume = renderResume;
exports.renderResumeHtml = renderResumeHtml;
exports.renderTemplateSample = renderTemplateSample;
exports.clearPreviewCache = clearPreviewCache;
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const pdfService = __importStar(require("./pdf.service"));
const storageService = __importStar(require("./storage.service"));
const modern_1 = require("../templates/modern");
const photographic_1 = require("../templates/photographic");
const creative_1 = require("../templates/creative");
const professional_1 = require("../templates/professional");
const azurill_1 = require("../templates/azurill");
const gengar_1 = require("../templates/gengar");
const minimal_1 = require("../templates/minimal");
const executive_1 = require("../templates/executive");
const pikachu_1 = require("../templates/pikachu");
const charizard_1 = require("../templates/charizard");
const blastoise_1 = require("../templates/blastoise");
const dragonite_1 = require("../templates/dragonite");
const venusaur_1 = require("../templates/venusaur");
const alakazam_1 = require("../templates/alakazam");
const mewtwo_1 = require("../templates/mewtwo");
const squirtle_1 = require("../templates/squirtle");
const bulbasaur_1 = require("../templates/bulbasaur");
const eevee_1 = require("../templates/eevee");
const machamp_1 = require("../templates/machamp");
const classic_professional_1 = require("../templates/classic-professional");
const skills_first_1 = require("../templates/skills-first");
const metrics_driven_1 = require("../templates/metrics-driven");
const leadership_managerial_1 = require("../templates/leadership-managerial");
const tech_it_1 = require("../templates/tech-it");
const fresher_entry_level_1 = require("../templates/fresher-entry-level");
const consultant_freelancer_1 = require("../templates/consultant-freelancer");
const operations_support_1 = require("../templates/operations-support");
const senior_individual_contributor_1 = require("../templates/senior-individual-contributor");
const minimal_ats_1 = require("../templates/minimal-ats");
const cosmos_1 = require("../templates/cosmos");
const nova_1 = require("../templates/nova");
const stellar_1 = require("../templates/stellar");
const orion_1 = require("../templates/orion");
const nebula_1 = require("../templates/nebula");
const saanvi_patel_1 = require("../templates/saanvi-patel");
const modern_executive_1 = require("../templates/modern-executive");
// Simple in-memory cache for template previews
const previewCache = {};
const PREVIEW_TTL_MS = 1000 * 60 * 60; // 1 hour
// Cache for processed images (base64 encoded)
const imageCache = {};
const IMAGE_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
async function renderResume(resumeId, templateId, theme) {
    const template = templateId || "modern";
    // Only fetch latest version from database
    const latestVersion = await ResumeVersion_1.default.findOne({ resumeId })
        .sort({ createdAt: -1 })
        .select("data")
        .lean();
    const data = latestVersion?.data || {};
    const processedData = await processImageForTemplate(data);
    const html = buildHtml(processedData, template, theme);
    return pdfService.generatePdf(html);
}
async function renderResumeHtml(resumeId, templateId, theme, currentData) {
    const template = templateId || "modern";
    console.log("[renderResumeHtml] Called with:", {
        resumeId,
        template,
        hasTheme: !!theme,
        hasCurrentData: !!currentData,
        currentDataKeys: currentData ? Object.keys(currentData) : null,
    });
    let data = {};
    if (currentData) {
        // Use currentData if provided (for live preview from frontend)
        data = currentData;
        console.log("[renderResumeHtml] Using provided currentData");
    }
    else {
        // Only fetch latest version from database when no currentData provided
        console.log("[renderResumeHtml] Fetching from database for resumeId:", resumeId);
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId })
            .sort({ createdAt: -1 })
            .select("data")
            .lean();
        if (latestVersion?.data) {
            data = latestVersion.data;
            console.log("[renderResumeHtml] Loaded from database, data keys:", Object.keys(data));
        }
        else {
            console.warn("[renderResumeHtml] No version found for resumeId:", resumeId);
        }
    }
    const processedData = template === "photographic" ? await processImageForTemplate(data) : data;
    console.log("[renderResumeHtml] Building HTML for template:", template);
    const html = buildHtml(processedData, template, theme);
    console.log("[renderResumeHtml] Generated HTML length:", html.length);
    return html;
}
// Render a sample resume for a given template (public, used for thumbnails/previews)
async function renderTemplateSample(templateId, theme) {
    const template = templateId || "modern";
    console.log("[TemplateService] renderTemplateSample called for template:", template);
    // Use cache key based on template and theme
    const cacheKey = `${template}:${theme ? JSON.stringify(theme) : "default"}`;
    const now = Date.now();
    const cached = previewCache[cacheKey];
    if (cached && cached.expiresAt > now) {
        console.log("[TemplateService] returning cached preview for", cacheKey);
        return cached.url;
    }
    // Minimal sample data used for public previews
    const sampleData = {
        personal: {
            name: "John Doe",
            email: "email@example.com",
            phone: "(555) 123-4567",
            location: "San Francisco, CA",
            linkedin: "https://linkedin.com/in/johndoe",
            github: "https://github.com/johndoe",
            portfolioUrl: "https://johndoe.com",
            image: undefined,
        },
        summary: "Experienced software engineer with 5+ years of expertise in full-stack development, cloud technologies, and agile methodologies.",
        experience: [
            {
                id: "exp1",
                title: "Senior Software Engineer",
                company: "TechCorp Inc.",
                startDate: "Jan 2022",
                endDate: "Present",
                description: "Led development of microservices architecture serving large user bases.",
            },
        ],
        projects: [
            {
                id: "proj1",
                name: "E-commerce Platform",
                description: "Built a scalable e-commerce platform handling 10k+ daily transactions.",
                technologies: "React, Node.js, MongoDB, AWS",
                url: "https://github.com/johndoe/ecommerce",
            },
        ],
        education: [
            {
                id: "edu1",
                degree: "B.Sc. Computer Science",
                school: "University of Somewhere",
                field: "Computer Science",
                graduationDate: "May 2020",
            },
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS"],
        languages: [
            { language: "English", level: "Native" },
            { language: "Spanish", level: "Intermediate" },
        ],
        hobbies: ["Photography", "Hiking", "Reading"],
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
    };
    // Add default image for photographic template if missing
    if (template === "photographic" && !sampleData.personal?.image) {
        sampleData.personal.image = "https://via.placeholder.com/150x150.jpg";
    }
    // Clear cache for photographic to force update
    if (template === "photographic") {
        clearPreviewCache(template, theme);
    }
    const processedData = template === "photographic"
        ? await processImageForTemplate(sampleData)
        : sampleData;
    const html = buildHtml(processedData, template, theme);
    // Upload HTML to Cloudinary
    const buffer = Buffer.from(html, "utf-8");
    const filename = `${template}-preview-${Date.now()}.html`;
    const uploadResult = await storageService.uploadBufferToCloudinary(buffer, filename, "templates");
    // Store URL in cache
    const url = uploadResult.secure_url || uploadResult.url;
    previewCache[cacheKey] = { url, expiresAt: Date.now() + PREVIEW_TTL_MS };
    return url;
}
function clearPreviewCache(templateId, theme) {
    if (!templateId) {
        // clear all
        for (const k of Object.keys(previewCache))
            delete previewCache[k];
        return;
    }
    const cacheKey = `${templateId}:${theme ? JSON.stringify(theme) : "default"}`;
    delete previewCache[cacheKey];
}
async function processImageForTemplate(data) {
    if (data.personal?.image &&
        typeof data.personal.image === "string" &&
        data.personal.image.startsWith("http")) {
        const imageUrl = data.personal.image;
        const now = Date.now();
        const cached = imageCache[imageUrl];
        if (cached && cached.expiresAt > now) {
            console.log("Using cached image for:", imageUrl);
            data.personal.image = cached.base64;
            return data;
        }
        try {
            console.log("Processing image for template:", imageUrl);
            // Try to fetch the image and convert to base64
            const https = require("https");
            const url = new URL(imageUrl);
            const options = {
                hostname: url.hostname,
                path: url.pathname + url.search,
                method: "GET",
                headers: {
                    "User-Agent": "ResumeMaker/1.0",
                },
            };
            const response = await new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    if (res.statusCode !== 200) {
                        reject(new Error(`HTTP ${res.statusCode}`));
                        return;
                    }
                    const chunks = [];
                    res.on("data", (chunk) => chunks.push(chunk));
                    res.on("end", () => {
                        const buffer = Buffer.concat(chunks);
                        resolve({
                            buffer,
                            contentType: res.headers["content-type"] || "image/jpeg",
                        });
                    });
                });
                req.on("error", reject);
                req.setTimeout(10000, () => reject(new Error("Image download timeout")));
                req.end();
            });
            const base64Data = `data:${response.contentType};base64,${response.buffer.toString("base64")}`;
            data.personal.image = base64Data;
            // Cache the processed image
            imageCache[imageUrl] = {
                base64: base64Data,
                expiresAt: Date.now() + IMAGE_CACHE_TTL_MS,
            };
            console.log("Successfully processed and cached image");
        }
        catch (error) {
            console.error("Failed to process image:", error);
            // Keep the original URL if conversion fails
        }
    }
    return data;
}
function buildHtml(data, template, theme) {
    switch (template) {
        case "operations-support":
            return (0, operations_support_1.buildOperationsSupportTemplate)(data, theme);
        case "senior-individual-contributor":
            return (0, senior_individual_contributor_1.buildSeniorIndividualContributorTemplate)(data, theme);
        case "minimal-ats":
            return (0, minimal_ats_1.buildMinimalAtsTemplate)(data, theme);
        case "cosmos":
            return (0, cosmos_1.buildCosmosTemplate)(data, theme);
        case "modern-executive":
            return (0, modern_executive_1.buildModernExecutiveTemplate)(data, theme);
        case "nova":
            return (0, nova_1.buildNovaTemplate)(data, theme);
        case "stellar":
            return (0, stellar_1.buildStellarTemplate)(data, theme);
        case "orion":
            return (0, orion_1.buildOrionTemplate)(data, theme);
        case "nebula":
            return (0, nebula_1.buildNebulaTemplate)(data, theme);
        case "saanvi-patel":
            return (0, saanvi_patel_1.buildSaanviPatelTemplate)(data, theme);
        case "modern":
            return (0, modern_1.buildModernTemplate)(data, theme);
        case "photographic":
            return (0, photographic_1.buildPhotographicTemplate)(data, theme);
        case "creative":
            return (0, creative_1.buildCreativeTemplate)(data, theme);
        case "professional":
            return (0, professional_1.buildProfessionalTemplate)(data, theme);
        case "azurill":
            return (0, azurill_1.buildAzurillTemplate)(data, theme);
        case "gengar":
            return (0, gengar_1.buildGengarTemplate)(data, theme);
        case "minimal":
            return (0, minimal_1.buildMinimalTemplate)(data, theme);
        case "executive":
            return (0, executive_1.buildExecutiveTemplate)(data, theme);
        case "pikachu":
            return (0, pikachu_1.buildPikachuTemplate)(data, theme);
        case "charizard":
            return (0, charizard_1.buildCharizardTemplate)(data, theme);
        case "blastoise":
            return (0, blastoise_1.buildBlastoiseTemplate)(data, theme);
        case "dragonite":
            return (0, dragonite_1.buildDragoniteTemplate)(data, theme);
        case "venusaur":
            return (0, venusaur_1.buildVenusaurTemplate)(data, theme);
        case "alakazam":
            return (0, alakazam_1.buildAlakazamTemplate)(data, theme);
        case "mewtwo":
            return (0, mewtwo_1.buildMewtwoTemplate)(data, theme);
        case "squirtle":
            return (0, squirtle_1.buildSquirtleTemplate)(data, theme);
        case "bulbasaur":
            return (0, bulbasaur_1.buildBulbasaurTemplate)(data, theme);
        case "eevee":
            return (0, eevee_1.buildEeveeTemplate)(data, theme);
        case "machamp":
            return (0, machamp_1.buildMachampTemplate)(data, theme);
        case "classic-professional":
            return (0, classic_professional_1.buildClassicProfessionalTemplate)(data, theme);
        case "skills-first":
            return (0, skills_first_1.buildSkillsFirstTemplate)(data, theme);
        case "metrics-driven":
            return (0, metrics_driven_1.buildMetricsDrivenTemplate)(data, theme);
        case "leadership-managerial":
            return (0, leadership_managerial_1.buildLeadershipManagerialTemplate)(data, theme);
        case "tech-it":
            return (0, tech_it_1.buildTechItTemplate)(data, theme);
        case "fresher-entry-level":
            return (0, fresher_entry_level_1.buildFresherEntryLevelTemplate)(data, theme);
        case "consultant-freelancer":
            return (0, consultant_freelancer_1.buildConsultantFreelancerTemplate)(data, theme);
        default:
            return (0, modern_1.buildModernTemplate)(data, theme);
    }
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.clearPreviewCache = exports.renderTemplateSample = exports.renderResumeHtml = exports.renderResume = void 0;
var ResumeVersion_1 = require("../models/ResumeVersion");
var pdfService = require("./pdf.service");
var storageService = require("./storage.service");
var modern_1 = require("../templates/modern");
var photographic_1 = require("../templates/photographic");
var creative_1 = require("../templates/creative");
var professional_1 = require("../templates/professional");
var azurill_1 = require("../templates/azurill");
var gengar_1 = require("../templates/gengar");
var minimal_1 = require("../templates/minimal");
var modern_sidebar_1 = require("../templates/modern-sidebar");
var formal_indian_cv_1 = require("../templates/formal-indian-cv");
var photo_minimal_1 = require("../templates/photo-minimal");
var photo_modern_pro_1 = require("../templates/photo-modern-pro");
var dragonite_1 = require("../templates/dragonite");
var venusaur_1 = require("../templates/venusaur");
var alakazam_1 = require("../templates/alakazam");
var mewtwo_1 = require("../templates/mewtwo");
var squirtle_1 = require("../templates/squirtle");
var bulbasaur_1 = require("../templates/bulbasaur");
var eevee_1 = require("../templates/eevee");
var machamp_1 = require("../templates/machamp");
var classic_professional_1 = require("../templates/classic-professional");
var skills_first_1 = require("../templates/skills-first");
var metrics_driven_1 = require("../templates/metrics-driven");
var leadership_managerial_1 = require("../templates/leadership-managerial");
var tech_it_1 = require("../templates/tech-it");
var fresher_entry_level_1 = require("../templates/fresher-entry-level");
var consultant_freelancer_1 = require("../templates/consultant-freelancer");
var operations_support_1 = require("../templates/operations-support");
var compact_classic_1 = require("../templates/compact-classic");
var minimal_ats_1 = require("../templates/minimal-ats");
var cosmos_1 = require("../templates/cosmos");
var nova_1 = require("../templates/nova");
var stellar_1 = require("../templates/stellar");
var orion_1 = require("../templates/orion");
var nebula_1 = require("../templates/nebula");
var ats_classic_1 = require("../templates/ats-classic");
var modern_executive_1 = require("../templates/modern-executive");
var impactResume_1 = require("../templates/impactResume");
var startup_Tech_1 = require("../templates/startup&Tech");
var modernCorporate_1 = require("../templates/modernCorporate");
var seniorLeadership_1 = require("../templates/seniorLeadership");
var corporateStandard_1 = require("../templates/corporateStandard");
// Simple in-memory cache for template previews
var previewCache = {};
var PREVIEW_TTL_MS = 1000 * 60 * 60; // 1 hour
// Cache for processed images (base64 encoded)
var imageCache = {};
var IMAGE_CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
function renderResume(resumeId, templateId, theme) {
    return __awaiter(this, void 0, void 0, function () {
        var template, latestVersion, data, processedData, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    template = templateId || "modern";
                    return [4 /*yield*/, ResumeVersion_1["default"].findOne({ resumeId: resumeId })
                            .sort({ createdAt: -1 })
                            .select("data")
                            .lean()];
                case 1:
                    latestVersion = _a.sent();
                    data = (latestVersion === null || latestVersion === void 0 ? void 0 : latestVersion.data) || {};
                    return [4 /*yield*/, processImageForTemplate(data)];
                case 2:
                    processedData = _a.sent();
                    html = buildHtml(processedData, template, theme);
                    return [2 /*return*/, pdfService.generatePdf(html)];
            }
        });
    });
}
exports.renderResume = renderResume;
function renderResumeHtml(resumeId, templateId, theme, currentData) {
    return __awaiter(this, void 0, void 0, function () {
        var template, data, latestVersion, processedData, _a, html;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    template = templateId || "modern";
                    data = {};
                    if (!currentData) return [3 /*break*/, 1];
                    // Use currentData if provided (for live preview from frontend)
                    data = currentData;
                    console.log("[renderResumeHtml] Using provided currentData");
                    return [3 /*break*/, 3];
                case 1:
                    // Only fetch latest version from database when no currentData provided
                    console.log("[renderResumeHtml] Fetching from database for resumeId:", resumeId);
                    return [4 /*yield*/, ResumeVersion_1["default"].findOne({ resumeId: resumeId })
                            .sort({ createdAt: -1 })
                            .select("data")
                            .lean()];
                case 2:
                    latestVersion = _b.sent();
                    if (latestVersion === null || latestVersion === void 0 ? void 0 : latestVersion.data) {
                        data = latestVersion.data;
                        console.log("[renderResumeHtml] Loaded from database, data keys:", Object.keys(data));
                    }
                    else {
                        console.warn("[renderResumeHtml] No version found for resumeId:", resumeId);
                    }
                    _b.label = 3;
                case 3:
                    if (!(template === "photographic")) return [3 /*break*/, 5];
                    return [4 /*yield*/, processImageForTemplate(data)];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = data;
                    _b.label = 6;
                case 6:
                    processedData = _a;
                    console.log("[renderResumeHtml] Building HTML for template:", template);
                    html = buildHtml(processedData, template, theme);
                    console.log("[renderResumeHtml] Generated HTML length:", html.length);
                    return [2 /*return*/, html];
            }
        });
    });
}
exports.renderResumeHtml = renderResumeHtml;
// Render a sample resume for a given template (public, used for thumbnails/previews)
function renderTemplateSample(templateId, theme) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var template, cacheKey, now, cached, sampleData, processedData, _b, html, buffer, filename, uploadResult, url;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    template = templateId || "modern";
                    console.log("[TemplateService] renderTemplateSample called for template:", template);
                    cacheKey = template + ":" + (theme ? JSON.stringify(theme) : "default");
                    now = Date.now();
                    cached = previewCache[cacheKey];
                    if (cached && cached.expiresAt > now) {
                        console.log("[TemplateService] returning cached preview for", cacheKey);
                        return [2 /*return*/, cached.url];
                    }
                    sampleData = {
                        personal: {
                            name: "Ajaya Dugar",
                            email: "ajaya@gmail.com",
                            phone: "+91 98765 43210",
                            location: "Kolkata, West Bengal, India",
                            linkedin: "https://linkedin.com/in/ajayadugar",
                            github: "https://github.com/ajayadugar",
                            portfolioUrl: "https://ajayadugar.dev",
                            image: undefined
                        },
                        summary: "Results-driven Full Stack Developer with 6+ years of experience designing and developing scalable web applications. Skilled in React, Node.js, TypeScript, cloud technologies, and modern software development practices. Strong background in delivering high-performance solutions and collaborating with cross-functional teams.",
                        experience: [
                            {
                                id: "exp1",
                                title: "Senior Software Engineer",
                                company: "Infosys Limited",
                                startDate: "Jan 2022",
                                endDate: "Present",
                                description: "\n      Led development of enterprise-grade web applications using React and Node.js.\n      Improved application performance by 40% through code optimization and caching strategies.\n      Collaborated with product managers and designers to deliver customer-focused features.\n      Mentored junior developers and conducted code reviews.\n      Integrated third-party APIs and cloud services to improve scalability.\n      "
                            },
                            {
                                id: "exp2",
                                title: "Software Engineer",
                                company: "Tata Consultancy Services (TCS)",
                                startDate: "Jun 2019",
                                endDate: "Dec 2021",
                                description: "\n       Developed and maintained client-facing applications using JavaScript and React.\n        Implemented RESTful APIs and backend services using Node.js.\n        Participated in Agile sprint planning, development, and deployment activities.\n        Reduced production bugs through comprehensive testing and quality assurance.\n        Worked closely with stakeholders to gather requirements and deliver solutions.\n      "
                            },
                            {
                                id: "exp3",
                                title: "Junior Software Developer",
                                company: "Webskitters Technology Solutions",
                                startDate: "Jul 2018",
                                endDate: "May 2019",
                                description: "\n        Built responsive websites using HTML, CSS, JavaScript, and Bootstrap.\n        Assisted in database design and backend integration.\n        Fixed bugs and enhanced existing application features.\n        Collaborated with senior developers on multiple client projects.\n      "
                            },
                        ],
                        projects: [
                            {
                                id: "proj1",
                                name: "E-Commerce Marketplace",
                                description: "Developed a scalable multi-vendor e-commerce platform supporting secure payments, product management, and order tracking.",
                                technologies: "React, Node.js, MongoDB, AWS",
                                url: "https://github.com/ajayadugar/ecommerce-platform"
                            },
                            {
                                id: "proj2",
                                name: "Hospital Management System",
                                description: "Built a comprehensive healthcare management system for patient records, appointments, billing, and reporting.",
                                technologies: "React, Express.js, PostgreSQL",
                                url: "https://github.com/ajayadugar/hospital-management"
                            },
                            {
                                id: "proj3",
                                name: "Employee Attendance Portal",
                                description: "Designed and developed a cloud-based attendance and leave management portal with real-time reporting.",
                                technologies: "TypeScript, React, Firebase",
                                url: "https://github.com/ajayadugar/attendance-portal"
                            },
                        ],
                        education: [
                            {
                                id: "edu1",
                                degree: "Master of Computer Applications (MCA)",
                                school: "University of Calcutta",
                                field: "Computer Applications",
                                graduationDate: "2020"
                            },
                            {
                                id: "edu2",
                                degree: "Bachelor of Computer Applications (BCA)",
                                school: "Techno India University, Kolkata",
                                field: "Computer Applications",
                                graduationDate: "2018"
                            },
                            {
                                id: "edu3",
                                degree: "Higher Secondary Education",
                                school: "St. Xavier's Collegiate School, Kolkata",
                                field: "Science",
                                graduationDate: "2015"
                            },
                        ],
                        skills: [
                            "JavaScript",
                            "TypeScript",
                            "React",
                            "Node.js",
                            "Express.js",
                            "MongoDB",
                            "PostgreSQL",
                            "AWS",
                            "Git",
                            "REST APIs",
                            "HTML",
                            "CSS",
                        ],
                        languages: [
                            { language: "English", level: "Professional" },
                            { language: "Hindi", level: "Native" },
                            { language: "Bengali", level: "Native" },
                        ],
                        hobbies: [
                            "Photography",
                            "Traveling",
                            "Reading",
                            "Cricket",
                            "Technology Blogging",
                        ],
                        fontSize: 16,
                        fontFamily: "Arial, sans-serif"
                    };
                    // Add default image for photographic template if missing
                    if (template === "photographic" && !((_a = sampleData.personal) === null || _a === void 0 ? void 0 : _a.image)) {
                        sampleData.personal.image = "https://via.placeholder.com/150x150.jpg";
                    }
                    // Clear cache for photographic to force update
                    if (template === "photographic") {
                        clearPreviewCache(template, theme);
                    }
                    if (!(template === "photographic")) return [3 /*break*/, 2];
                    return [4 /*yield*/, processImageForTemplate(sampleData)];
                case 1:
                    _b = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _b = sampleData;
                    _c.label = 3;
                case 3:
                    processedData = _b;
                    html = buildHtml(processedData, template, theme);
                    buffer = Buffer.from(html, "utf-8");
                    filename = template + "-preview-" + Date.now() + ".html";
                    return [4 /*yield*/, storageService.uploadBufferToCloudinary(buffer, filename, "templates")];
                case 4:
                    uploadResult = _c.sent();
                    url = uploadResult.secure_url || uploadResult.url;
                    previewCache[cacheKey] = { url: url, expiresAt: Date.now() + PREVIEW_TTL_MS };
                    return [2 /*return*/, url];
            }
        });
    });
}
exports.renderTemplateSample = renderTemplateSample;
function clearPreviewCache(templateId, theme) {
    if (!templateId) {
        // clear all
        for (var _i = 0, _a = Object.keys(previewCache); _i < _a.length; _i++) {
            var k = _a[_i];
            delete previewCache[k];
        }
        return;
    }
    var cacheKey = templateId + ":" + (theme ? JSON.stringify(theme) : "default");
    delete previewCache[cacheKey];
}
exports.clearPreviewCache = clearPreviewCache;
function processImageForTemplate(data) {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var imageUrl, now, cached, https_1, url, options_1, response, base64Data, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(((_a = data.personal) === null || _a === void 0 ? void 0 : _a.image) &&
                        typeof data.personal.image === "string" &&
                        data.personal.image.startsWith("http"))) return [3 /*break*/, 4];
                    imageUrl = data.personal.image;
                    now = Date.now();
                    cached = imageCache[imageUrl];
                    if (cached && cached.expiresAt > now) {
                        console.log("Using cached image for:", imageUrl);
                        data.personal.image = cached.base64;
                        return [2 /*return*/, data];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    console.log("Processing image for template:", imageUrl);
                    https_1 = require("https");
                    url = new URL(imageUrl);
                    options_1 = {
                        hostname: url.hostname,
                        path: url.pathname + url.search,
                        method: "GET",
                        headers: {
                            "User-Agent": "ResumeMaker/1.0"
                        }
                    };
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var req = https_1.request(options_1, function (res) {
                                if (res.statusCode !== 200) {
                                    reject(new Error("HTTP " + res.statusCode));
                                    return;
                                }
                                var chunks = [];
                                res.on("data", function (chunk) { return chunks.push(chunk); });
                                res.on("end", function () {
                                    var buffer = Buffer.concat(chunks);
                                    resolve({
                                        buffer: buffer,
                                        contentType: res.headers["content-type"] || "image/jpeg"
                                    });
                                });
                            });
                            req.on("error", reject);
                            req.setTimeout(10000, function () {
                                return reject(new Error("Image download timeout"));
                            });
                            req.end();
                        })];
                case 2:
                    response = _b.sent();
                    base64Data = "data:" + response.contentType + ";base64," + response.buffer.toString("base64");
                    data.personal.image = base64Data;
                    // Cache the processed image
                    imageCache[imageUrl] = {
                        base64: base64Data,
                        expiresAt: Date.now() + IMAGE_CACHE_TTL_MS
                    };
                    console.log("Successfully processed and cached image");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error("Failed to process image:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, data];
            }
        });
    });
}
function buildHtml(data, template, theme) {
    switch (template) {
        case "operations-support":
            return operations_support_1.buildOperationsSupportTemplate(data, theme);
        case "compact-classic":
            return compact_classic_1.buildCompactClassicTemplate(data, theme);
        case "minimal-ats":
            return minimal_ats_1.buildMinimalAtsTemplate(data, theme);
        case "cosmos":
            return cosmos_1.buildCosmosTemplate(data, theme);
        case "modern-executive":
            return modern_executive_1.buildModernExecutiveTemplate(data, theme);
        case "nova":
            return nova_1.buildNovaTemplate(data, theme);
        case "stellar":
            return stellar_1.buildStellarTemplate(data, theme);
        case "orion":
            return orion_1.buildOrionTemplate(data, theme);
        case "nebula":
            return nebula_1.buildNebulaTemplate(data, theme);
        case "impact-resume":
            return impactResume_1.buildImpactResumeTemplate(data, theme);
        case "startup-tech":
            return startup_Tech_1.buildStartupAndTechTemplate(data, theme);
        case "modern-corporate":
            return modernCorporate_1.buildModernCorporateTemplate(data, theme);
        case "senior-leadership":
            return seniorLeadership_1.buildSeniorLeadershipTemplate(data, theme);
        case "corporate-standard":
            return corporateStandard_1.buildCorporateStandardTemplate(data, theme);
        case "ats-classic":
            return ats_classic_1.buildAtsClassicTemplate(data, theme);
        case "modern":
            return modern_1.buildModernTemplate(data, theme);
        case "photographic":
            return photographic_1.buildPhotographicTemplate(data, theme);
        case "creative":
            return creative_1.buildCreativeTemplate(data, theme);
        case "professional":
            return professional_1.buildProfessionalTemplate(data, theme);
        case "azurill":
            return azurill_1.buildAzurillTemplate(data, theme);
        case "gengar":
            return gengar_1.buildGengarTemplate(data, theme);
        case "minimal":
            return minimal_1.buildMinimalTemplate(data, theme);
        case "modern-sidebar":
            return modern_sidebar_1.buildModernSidebarTemplate(data, theme);
        case "formal-indian-cv":
            return formal_indian_cv_1.buildFormalIndianCvTemplate(data, theme);
        case "photo-minimal":
            return photo_minimal_1.buildPhotoMinimalTemplate(data, theme);
        case "photo-modern-pro":
            return photo_modern_pro_1.buildPhotoModernProTemplate(data, theme);
        case "dragonite":
            return dragonite_1.buildDragoniteTemplate(data, theme);
        case "venusaur":
            return venusaur_1.buildVenusaurTemplate(data, theme);
        case "alakazam":
            return alakazam_1.buildAlakazamTemplate(data, theme);
        case "mewtwo":
            return mewtwo_1.buildMewtwoTemplate(data, theme);
        case "squirtle":
            return squirtle_1.buildSquirtleTemplate(data, theme);
        case "bulbasaur":
            return bulbasaur_1.buildBulbasaurTemplate(data, theme);
        case "eevee":
            return eevee_1.buildEeveeTemplate(data, theme);
        case "machamp":
            return machamp_1.buildMachampTemplate(data, theme);
        case "classic-professional":
            return classic_professional_1.buildClassicProfessionalTemplate(data, theme);
        case "skills-first":
            return skills_first_1.buildSkillsFirstTemplate(data, theme);
        case "metrics-driven":
            return metrics_driven_1.buildMetricsDrivenTemplate(data, theme);
        case "leadership-managerial":
            return leadership_managerial_1.buildLeadershipManagerialTemplate(data, theme);
        case "tech-it":
            return tech_it_1.buildTechItTemplate(data, theme);
        case "fresher-entry-level":
            return fresher_entry_level_1.buildFresherEntryLevelTemplate(data, theme);
        case "consultant-freelancer":
            return consultant_freelancer_1.buildConsultantFreelancerTemplate(data, theme);
        default:
            return modern_1.buildModernTemplate(data, theme);
    }
}

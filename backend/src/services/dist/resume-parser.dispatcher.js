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
// resume-parser.dispatcher.ts
var fs_1 = require("fs");
var path_1 = require("path");
var openai_1 = require("openai");
var normalizeParsedResume_1 = require("../utils/normalizeParsedResume");
var mammoth_1 = require("mammoth");
var pdf_parse_1 = require("pdf-parse");
var TokenUsage_1 = require("../models/TokenUsage");
// DeepInfra configuration
var deepinfra = new openai_1["default"]({
    baseURL: "https://api.deepinfra.com/v1/openai",
    apiKey: process.env.DEEPINFRA_API_KEY
});
// Performance optimizations
var API_TIMEOUT = 120000; // 120 seconds timeout
var MAX_TEXT_LENGTH = 40000; // Max characters to send to AI (approx 10,000 tokens)
// Cache for processed data to avoid re-processing
var processedCache = new Map();
// ---------- TOKEN COUNTING ----------
function countTokens(text) {
    // Simple estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
}
// ---------- FILE TYPE DETECTION ----------
function detectFileType(filePath) {
    var ext = path_1["default"].extname(filePath).toLowerCase();
    if (ext === ".pdf")
        return "pdf";
    if (ext === ".docx")
        return "docx";
    return "unknown";
}
// ---------- DOCX TO TEXT CONVERSION (mammoth) ----------
function extractTextFromDocx(filePath) {
    return __awaiter(this, void 0, Promise, function () {
        var result, text, messages, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🔄 Extracting text from DOCX using mammoth...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mammoth_1["default"].extractRawText({ path: filePath })];
                case 2:
                    result = _a.sent();
                    text = result.value;
                    messages = result.messages;
                    if (messages.length > 0) {
                        console.log("⚠️ Conversion warnings:", messages);
                    }
                    if (!text || text.trim().length === 0) {
                        throw new Error("No text content found in DOCX file");
                    }
                    console.log("\uD83D\uDCDD Extracted " + text.length + " characters from DOCX");
                    return [2 /*return*/, text];
                case 3:
                    err_1 = _a.sent();
                    console.error("DOCX text extraction error:", err_1.message);
                    throw new Error("Failed to extract text from DOCX: " + err_1.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ---------- PDF TO TEXT EXTRACTION (pdf-parse) ----------
function extractTextFromPDF(filePath) {
    return __awaiter(this, void 0, Promise, function () {
        var dataBuffer, data, text, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🔄 Extracting text from PDF using pdf-parse...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    dataBuffer = fs_1["default"].readFileSync(filePath);
                    return [4 /*yield*/, pdf_parse_1["default"](dataBuffer, {
                            max: 0,
                            version: 'v1.10.100'
                        })];
                case 2:
                    data = _a.sent();
                    text = data.text;
                    if (!text || text.trim().length === 0) {
                        throw new Error("No text content found in PDF file");
                    }
                    console.log("\uD83D\uDCDD Extracted " + text.length + " characters from PDF (" + data.numpages + " pages)");
                    return [2 /*return*/, text];
                case 3:
                    err_2 = _a.sent();
                    console.error("PDF text extraction error:", err_2.message);
                    throw new Error("Failed to extract text from PDF: " + err_2.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ---------- ENHANCED JSON FIXING FUNCTION ----------
function fixMalformedJSON(text) {
    // Remove markdown code blocks
    var cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    // Try to extract JSON object if there's other text
    var jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }
    // Fix common JSON errors
    cleaned = cleaned
        .replace(/\}\s*\{/g, '},{')
        .replace(/"\s*"/g, '","')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
        .replace(/\s+/g, ' ')
        .replace(/\[\s*\]/g, '[]')
        .replace(/\{\s*\}/g, '{}');
    // Fix trailing commas
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    // Quick brace count and fix
    var openBraces = (cleaned.match(/{/g) || []).length;
    var closeBraces = (cleaned.match(/}/g) || []).length;
    if (openBraces > closeBraces) {
        cleaned = cleaned + '}'.repeat(openBraces - closeBraces);
    }
    return cleaned;
}
// ---------- POST-PROCESSING FUNCTIONS (Preserved from original) ----------
function fixSkillsExtraction(data) {
    if (!data)
        return data;
    if (!data.skills)
        return data;
    console.log("🔧 Fixing skills extraction...");
    if (Array.isArray(data.skills)) {
        var cleanedSkills = data.skills
            .map(function (skill) {
            if (typeof skill === 'string') {
                return skill.trim();
            }
            else if (typeof skill === 'object' && skill !== null) {
                return skill.name || skill.skill || skill.skillName || null;
            }
            return null;
        })
            .filter(function (skill) { return skill && skill !== '' && skill !== 'undefined'; })
            .filter(function (skill, index, self) {
            return self.findIndex(function (s) { return s.toLowerCase() === skill.toLowerCase(); }) === index;
        });
        if (cleanedSkills.length > 0) {
            data.skills = cleanedSkills;
            console.log("\u2705 Extracted " + cleanedSkills.length + " unique skills");
        }
        else {
            delete data.skills;
        }
        return data;
    }
    if (typeof data.skills === 'object') {
        if (data.skills.list && Array.isArray(data.skills.list)) {
            data.skills = data.skills.list;
            return fixSkillsExtraction(data);
        }
        if (data.skills.skills && Array.isArray(data.skills.skills)) {
            data.skills = data.skills.skills;
            return fixSkillsExtraction(data);
        }
        if (data.skills.technical && Array.isArray(data.skills.technical)) {
            data.skills = data.skills.technical;
            return fixSkillsExtraction(data);
        }
        var skillValues = Object.values(data.skills).filter(function (v) { return typeof v === 'string' && v.length > 0; });
        if (skillValues.length > 0) {
            data.skills = skillValues;
            return fixSkillsExtraction(data);
        }
    }
    return data;
}
function fixCoreCompetenciesExtraction(data) {
    if (!data)
        return data;
    if (!data.coreCompetencies)
        return data;
    if (Array.isArray(data.coreCompetencies)) {
        var cleaned = data.coreCompetencies
            .map(function (item) {
            if (typeof item === "string")
                return item.trim();
            if (typeof item === "object" && item !== null) {
                return item.name || item.competency || null;
            }
            return null;
        })
            .filter(Boolean);
        data.coreCompetencies = cleaned;
    }
    return data;
}
function fixSummaryFormat(data) {
    if (!data)
        return data;
    if (data.summary) {
        if (typeof data.summary === 'object' && data.summary !== null) {
            if (data.summary.description) {
                data.careerObjective = data.summary.description;
                delete data.summary;
            }
            else if (data.summary.text) {
                data.careerObjective = data.summary.text;
                delete data.summary;
            }
        }
        else if (typeof data.summary === 'string') {
            data.careerObjective = data.summary;
            delete data.summary;
        }
    }
    if (data.careerObjective && typeof data.careerObjective === 'object') {
        data.careerObjective = data.careerObjective.description || data.careerObjective.text || data.careerObjective;
    }
    return data;
}
function fixEducationDates(data) {
    if (!data.education || !Array.isArray(data.education))
        return data;
    data.education = data.education.map(function (edu) {
        if (edu.startDate && typeof edu.startDate === 'string' && edu.startDate.includes('-')) {
            var _a = edu.startDate.split('-').map(function (s) { return s.trim(); }), start = _a[0], end = _a[1];
            edu.startDate = start;
            if (!edu.graduationDate || edu.graduationDate === '') {
                edu.graduationDate = end;
            }
        }
        if ((!edu.graduationDate || edu.graduationDate === '') && edu.endDate) {
            if (typeof edu.endDate === 'string' && edu.endDate !== 'undefined') {
                edu.graduationDate = edu.endDate;
            }
            delete edu.endDate;
        }
        if (edu.graduationDate && typeof edu.graduationDate === 'string' && edu.graduationDate.includes('-') && (!edu.startDate || edu.startDate === '')) {
            var _b = edu.graduationDate.split('-').map(function (s) { return s.trim(); }), start = _b[0], end = _b[1];
            edu.startDate = start;
            edu.graduationDate = end;
        }
        delete edu.endDate;
        delete edu.duration;
        return edu;
    });
    return data;
}
function cleanupEducation(data) {
    if (!data.education || !Array.isArray(data.education))
        return data;
    data.education = data.education.map(function (edu) {
        var cleanedEdu = {};
        cleanedEdu.id = edu.id || "edu-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
        cleanedEdu.school = edu.school || edu.institution || edu.college || edu.university;
        if (cleanedEdu.school && cleanedEdu.school !== 'undefined') {
            cleanedEdu.school = cleanedEdu.school.trim();
        }
        else {
            delete cleanedEdu.school;
        }
        if (edu.location && edu.location !== 'undefined' && edu.location !== '') {
            cleanedEdu.location = edu.location.trim();
        }
        if (edu.degree && edu.degree !== 'undefined' && edu.degree !== '') {
            var degree = edu.degree.trim();
            var degreeMap = {
                'bcom': 'B.Com', 'b.com': 'B.Com', 'bachelor of commerce': 'B.Com',
                'bca': 'BCA', 'mca': 'MCA', 'bba': 'BBA', 'mba': 'MBA',
                'bsc': 'B.Sc', 'msc': 'M.Sc', 'ba': 'B.A.', 'ma': 'M.A.',
                'btech': 'B.Tech', 'mtech': 'M.Tech', 'be': 'B.E.', 'me': 'M.E.',
                'higher secondary': 'Higher Secondary', 'secondary': 'Secondary',
                '12th': 'Higher Secondary', '10th': 'Secondary', 'ssc': 'SSC', 'hsc': 'HSC'
            };
            cleanedEdu.degree = degreeMap[degree.toLowerCase()] || degree;
        }
        if (edu.field && edu.field !== 'undefined' && edu.field !== '') {
            cleanedEdu.field = edu.field.trim();
        }
        if (edu.startDate && edu.startDate !== 'undefined' && edu.startDate !== '') {
            cleanedEdu.startDate = edu.startDate.includes('-') ? edu.startDate.split('-')[0].trim() : edu.startDate;
        }
        if (edu.graduationDate && edu.graduationDate !== 'undefined' && edu.graduationDate !== '') {
            cleanedEdu.graduationDate = edu.graduationDate.includes('-')
                ? edu.graduationDate.split('-').pop().trim()
                : edu.graduationDate;
        }
        if (edu.grade && edu.grade !== 'undefined' && edu.grade !== '') {
            cleanedEdu.grade = edu.grade.trim();
        }
        else if (edu.percentage) {
            cleanedEdu.grade = "Percentage: " + edu.percentage + "%";
        }
        else if (edu.cgpa) {
            cleanedEdu.grade = "CGPA: " + edu.cgpa;
        }
        else if (edu.gpa) {
            cleanedEdu.grade = "GPA: " + edu.gpa;
        }
        if (edu.description && edu.description !== 'undefined' && edu.description !== '') {
            cleanedEdu.description = edu.description.trim();
        }
        return Object.keys(cleanedEdu).length > 1 ? cleanedEdu : null;
    }).filter(Boolean);
    data.education.sort(function (a, b) { return (b.startDate || '0').localeCompare(a.startDate || '0'); });
    return data;
}
function fixCertifications(data) {
    if (!data.education || !Array.isArray(data.education))
        return data;
    var certsToMove = [];
    var remainingEducation = [];
    for (var _i = 0, _a = data.education; _i < _a.length; _i++) {
        var edu = _a[_i];
        var eduString = JSON.stringify(edu).toLowerCase();
        if (eduString.includes('company secretary') ||
            (eduString.includes('company') && eduString.includes('secretary')) ||
            (edu.degree && edu.degree.toLowerCase().includes('company secretary')) ||
            (edu.school && edu.school.toLowerCase().includes('icsi'))) {
            certsToMove.push({
                name: 'Company Secretary',
                issuer: edu.school === 'secretary' ? 'ICSI' : (edu.school || 'ICSI'),
                date: edu.graduationDate || edu.startDate || '',
                url: edu.url || ''
            });
        }
        else {
            remainingEducation.push(edu);
        }
    }
    data.education = remainingEducation;
    if (certsToMove.length > 0) {
        if (!data.certifications)
            data.certifications = [];
        var _loop_1 = function (cert) {
            var exists = data.certifications.some(function (c) {
                return c.name && c.name.toLowerCase() === cert.name.toLowerCase();
            });
            if (!exists) {
                data.certifications.push(cert);
            }
        };
        for (var _b = 0, certsToMove_1 = certsToMove; _b < certsToMove_1.length; _b++) {
            var cert = certsToMove_1[_b];
            _loop_1(cert);
        }
    }
    return data;
}
function fixLanguages(data) {
    if (!data.languages || !Array.isArray(data.languages))
        return data;
    data.languages = data.languages.map(function (lang) {
        var cleanedLang = {};
        if (lang.language && lang.language !== 'undefined') {
            cleanedLang.language = lang.language.trim();
        }
        if (lang.level) {
            var level = lang.level.toString().toLowerCase();
            if (level.includes('native') || level.includes('bilingual')) {
                cleanedLang.level = 'Native/Bilingual';
            }
            else if (level.includes('professional')) {
                cleanedLang.level = 'Full Professional';
            }
            else if (level.includes('advanced')) {
                cleanedLang.level = 'Advanced';
            }
            else if (level.includes('intermediate')) {
                cleanedLang.level = 'Intermediate';
            }
            else if (level.includes('beginner')) {
                cleanedLang.level = 'Beginner';
            }
            else {
                cleanedLang.level = lang.level;
            }
        }
        if (lang.capability) {
            cleanedLang.capability = lang.capability.toString().replace(/\//g, ', ');
        }
        else if (cleanedLang.level) {
            var levelMap = {
                'Native/Bilingual': 'Speak, Read, Write',
                'Full Professional': 'Speak, Read, Write',
                'Advanced': 'Speak, Read, Write',
                'Intermediate': 'Speak, Read',
                'Beginner': 'Speak'
            };
            cleanedLang.capability = levelMap[cleanedLang.level];
        }
        return cleanedLang;
    }).filter(function (lang) { return lang.language; });
    return data;
}
function fixSocialProfiles(data) {
    if (!data.socialProfiles || !Array.isArray(data.socialProfiles))
        return data;
    data.socialProfiles = data.socialProfiles
        .map(function (profile) {
        var _a, _b;
        return ({
            platform: (_a = profile.platform) === null || _a === void 0 ? void 0 : _a.trim(),
            url: (_b = profile.url) === null || _b === void 0 ? void 0 : _b.trim()
        });
    })
        .filter(function (profile) { return profile.platform && profile.platform !== 'undefined'; });
    return data;
}
function removeEmptyFields(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj
            .map(function (item) { return removeEmptyFields(item); })
            .filter(function (item) {
            if (!item)
                return false;
            if (typeof item === 'object')
                return Object.keys(item).length > 0;
            if (typeof item === 'string')
                return item && item !== '' && item !== 'undefined' && item !== 'null';
            return true;
        });
    }
    var cleaned = {};
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var cleanedValue = removeEmptyFields(value);
        if (cleanedValue === null || cleanedValue === undefined)
            continue;
        if (typeof cleanedValue === 'string') {
            if (cleanedValue === '' || cleanedValue === 'undefined' || cleanedValue === 'null')
                continue;
            cleaned[key] = cleanedValue;
        }
        else if (typeof cleanedValue === 'object') {
            if (Array.isArray(cleanedValue) && cleanedValue.length === 0)
                continue;
            if (!Array.isArray(cleanedValue) && Object.keys(cleanedValue).length === 0)
                continue;
            cleaned[key] = cleanedValue;
        }
        else {
            cleaned[key] = cleanedValue;
        }
    }
    return cleaned;
}
function postProcessParsedData(data) {
    if (!data || typeof data !== 'object')
        return data;
    console.log("\n🧹 Running optimized post-processing...");
    data = fixSkillsExtraction(data);
    data = fixCoreCompetenciesExtraction(data);
    data = fixSummaryFormat(data);
    data = fixCertifications(data);
    data = fixEducationDates(data);
    data = cleanupEducation(data);
    data = fixLanguages(data);
    data = fixSocialProfiles(data);
    // ADD THIS LINE - Clean bullet points but preserve structure
    data = cleanBulletPointsFromDescriptions(data);
    data = removeEmptyFields(data);
    console.log("✅ Post-processing complete");
    return data;
}
// ---------- FIELD NAME MAPPING ----------
var fieldMappings = {
    'alt_phone': 'alternatePhone',
    'marital_status': 'maritalStatus',
    'full_address': 'fullAddress',
    'pin_code': 'pinCode',
    'professional_context': 'professionalContext',
    'total_experience': 'totalExperience',
    'team_size': 'teamSize',
    'functional_domain': 'functionalDomain',
    'geographic_scope': 'geographicScope',
    'revenue_responsibility': 'revenueResponsibility',
    'availability_work_authorization': 'availabilityWorkAuth',
    'notice_period': 'availabilityNoticePeriod',
    'work_auth': 'workAuthorizationStatus',
    'preferred_location': 'preferredLocation',
    'career_objective': 'careerObjective',
    'professional_summary': 'summary',
    'workExperience': 'experience',
    'work_experience': 'experience',
    'start': 'startDate',
    'end': 'endDate',
    'coCurricularActivities': 'coCurricular',
    'extracurricularActivities': 'extracurricular',
    'training_programs': 'trainingPrograms',
    'academic_projects': 'academicProjects',
    'leadership_positions': 'leadershipPositions',
    'tools_technologies': 'toolsTechnologies',
    'tool': 'name',
    'industry_expertise': 'industryExpertise',
    'domain': 'industry',
    'domainArea': 'domainArea',
    'teaching_experience': 'teachingExperience',
    'mentorship_experience': 'mentorshipExperience',
    'research_grants': 'researchGrants',
    'test_scores': 'testScores',
    'social_profiles': 'socialProfiles',
    'military_service': 'militaryService',
    'client_projects': 'clientProjects',
    'tools': 'toolsTechnologies',
    'cause': 'causeArea'
};
// ---------- CLEAN BULLET POINTS BUT PRESERVE LINE BREAKS ----------
function cleanBulletPointsFromDescriptions(data) {
    if (!data || typeof data !== 'object')
        return data;
    // Clean experience descriptions
    if (data.experience && Array.isArray(data.experience)) {
        console.log("🧹 Cleaning bullet points from experience descriptions...");
        data.experience = data.experience.map(function (exp) {
            if (exp.description && typeof exp.description === 'string') {
                // Split into lines while preserving line breaks
                var lines = exp.description.split(/\r?\n/);
                var cleanedLines = lines.map(function (line) {
                    var cleaned = line.trim();
                    // Remove bullet point markers but keep the text
                    cleaned = cleaned.replace(/^[•\-*]\s*/, ''); // Remove •, -, *
                    cleaned = cleaned.replace(/^\d+\.\s*/, ''); // Remove numbered lists (1., 2., etc.)
                    cleaned = cleaned.replace(/^[a-zA-Z]\)\s*/, ''); // Remove lettered lists (a), b), etc.)
                    cleaned = cleaned.replace(/^[✓✓✔]\s*/, ''); // Remove checkmarks
                    cleaned = cleaned.replace(/^[◦▪▸›]\s*/, ''); // Remove other bullet symbols
                    return cleaned;
                });
                // Join back with newlines to preserve structure
                exp.description = cleanedLines.join('\n');
            }
            return exp;
        });
    }
    // Clean internship descriptions
    if (data.internships && Array.isArray(data.internships)) {
        data.internships = data.internships.map(function (item) {
            if (item.description && typeof item.description === 'string') {
                var lines = item.description.split(/\r?\n/);
                var cleanedLines = lines.map(function (line) {
                    var cleaned = line.trim();
                    cleaned = cleaned.replace(/^[•\-*]\s*/, '');
                    cleaned = cleaned.replace(/^\d+\.\s*/, '');
                    cleaned = cleaned.replace(/^[a-zA-Z]\)\s*/, '');
                    return cleaned;
                });
                item.description = cleanedLines.join('\n');
            }
            return item;
        });
    }
    // Clean project descriptions
    if (data.projects && Array.isArray(data.projects)) {
        data.projects = data.projects.map(function (project) {
            if (project.description && typeof project.description === 'string') {
                var lines = project.description.split(/\r?\n/);
                var cleanedLines = lines.map(function (line) {
                    var cleaned = line.trim();
                    cleaned = cleaned.replace(/^[•\-*]\s*/, '');
                    cleaned = cleaned.replace(/^\d+\.\s*/, '');
                    return cleaned;
                });
                project.description = cleanedLines.join('\n');
            }
            return project;
        });
    }
    // Clean academicProjects descriptions
    if (data.academicProjects && Array.isArray(data.academicProjects)) {
        data.academicProjects = data.academicProjects.map(function (project) {
            if (project.description && typeof project.description === 'string') {
                var lines = project.description.split(/\r?\n/);
                var cleanedLines = lines.map(function (line) {
                    var cleaned = line.trim();
                    cleaned = cleaned.replace(/^[•\-*]\s*/, '');
                    cleaned = cleaned.replace(/^\d+\.\s*/, '');
                    return cleaned;
                });
                project.description = cleanedLines.join('\n');
            }
            return project;
        });
    }
    // Clean clientProjects descriptions
    if (data.clientProjects && Array.isArray(data.clientProjects)) {
        data.clientProjects = data.clientProjects.map(function (project) {
            if (project.description && typeof project.description === 'string') {
                var lines = project.description.split(/\r?\n/);
                var cleanedLines = lines.map(function (line) {
                    var cleaned = line.trim();
                    cleaned = cleaned.replace(/^[•\-*]\s*/, '');
                    cleaned = cleaned.replace(/^\d+\.\s*/, '');
                    return cleaned;
                });
                project.description = cleanedLines.join('\n');
            }
            return project;
        });
    }
    return data;
}
function mapFieldNames(data) {
    if (!data || typeof data !== 'object')
        return data;
    if (Array.isArray(data)) {
        return data.map(function (item) { return mapFieldNames(item); });
    }
    var mapped = {};
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        var mappedKey = fieldMappings[key] || key;
        mapped[mappedKey] = value && typeof value === 'object' ? mapFieldNames(value) : value;
    }
    return mapped;
}
// ---------- SINGLE AI CALL WITH TEXT ----------
function extractDataFromText(userId, text, guestId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (guestId === void 0) { guestId = null; }
    return __awaiter(this, void 0, Promise, function () {
        var processedText, prompt, maxRetries, attempt, response, responseContent, usage, logErr_1, cleanJson, parsedData, fixedJson, parsedData, err_3;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    console.log("🔍 Processing resume text with AI (single call)...");
                    processedText = text;
                    if (text.length > MAX_TEXT_LENGTH) {
                        processedText = text.substring(0, MAX_TEXT_LENGTH);
                        console.log("\u26A0\uFE0F Text truncated from " + text.length + " to " + MAX_TEXT_LENGTH + " characters");
                    }
                    prompt = "You are a strict resume parser. Extract ALL information from the provided resume text and return it as a JSON object.\n\n\u26A0\uFE0F CRITICAL RULES (MUST FOLLOW STRICTLY):\n\n1. Hallucinate data a little for better completeness and field mapping.\n2. Use EXACTLY these section keys (camelCase):\n   - personal, careerObjective, summary, skills, coreCompetencies , experience, education,\n     internships, trainingPrograms, academicProjects, leadershipPositions,\n     coCurricular, extracurricular, languages, certifications, scholarships,\n     awards, speakingEngagements, memberships, workshops, professionalContext,\n     sectionVisibility, fontSize, fontFamily, portfolio, clientProjects,\n     volunteering, militaryService, methodologies, industryExpertise,\n     references, socialProfiles, availabilityWorkAuth, teachingExperience,\n     mentorshipExperience, researchGrants, testScores, publications, patents,\n     toolsTechnologies\n\n3. Field Mapping (CRITICAL - Match EXACTLY):\n   \n   PERSONAL:\n   - name, email, phone, alternatePhone, dob, gender, middleName, \n     maritalStatus, fullAddress, location, pinCode, country, image\n   - for phone and alternatePhone: extract only digits, remove any formatting or country codes\n   \n   EXPERIENCE:\n- title, company, location, startDate, endDate, isCurrent, description, achievements\n- Each job MUST be a separate object\n- NEVER merge responsibilities from different companies\n- Only include content that belongs to that specific company and date range\n- If multiple roles exist, create multiple entries\n- description MUST contain ONLY that job's responsibilities\n- DO NOT combine multiple jobs into one\n- IMPORTANT: \n  - DO NOT include bullet point symbols (\u2022, -, *, 1., etc.) in the description text\n  - Instead, write each responsibility on a new line\n  - Use line breaks to separate different points\n  - For example, write:\n    \"Sourcing candidates from different job portals\n     Screening and shortlisting candidates as per requirements\n     Coordinating with hiring managers for interview scheduling\"\n  - The template will handle formatting and add proper bullets\n- If the resume has bullet points, convert them to new lines without symbols\n- If there are no bullet points, preserve the original line breaks\n- If you see separate sections like \"Achievements\" under a job, include them on new lines\n\n   EDUCATION:\n   - school, location, degree, field, startDate, graduationDate, description, grade\n   - properly extract date for coresponding education\n   \n   SKILLS (IMPORTANT - Must be extracted properly):\n   - Extract ALL skills as a simple array of strings\n   - Look for bullet points (\u2022, -, *, etc.) or comma-separated lists\n   - Example: \"skills\": [\"React.js\", \"Node.js\", \"MongoDB\", \"AWS\"]\n   - DO NOT put skills inside objects, just simple strings\n   - Include ALL technical skills, programming languages, frameworks, tools, etc.\n   - Do not include  speaking languages like English, Spanish, etc. here, they should go in the \"languages\" section\n   - If you see a \"Skills\" section with bullet points, extract each bullet point as a separate skill\n   - For skills like \"React.js\" \u2192 extract as \"React.js\"\n   - For skills like \"\u2022 React.js\" \u2192 extract as \"React.js\" (remove the bullet)\n   - Extract ONLY values that appear under the Skills section.\n- NEVER include Core Competencies values in Skills.\n- If both sections exist, keep them completely separate.\n   \n\n   CORE COMPETENCIES (VERY IMPORTANT):\n\n- Core Competencies and Skills are DIFFERENT sections.\n- NEVER merge Core Competencies into Skills.\n- NEVER place Core Competencies values inside the skills array.\n- If the resume contains a section named:\n  \"Core Competencies\",\n  \"Core Competency\",\n  \"Key Competencies\",\n  \"Core Strengths\"\n  then extract those values ONLY into \"coreCompetencies\".\n\nExample:\n\nResume:\n\nSkills:\n- Recruitment\n- BFSI Hiring\n\nCore Competencies:\n- Team Lead\n- Work Management\n\nOutput:\n\n{\n  \"skills\": [\n    \"Recruitment\",\n    \"BFSI Hiring\"\n  ],\n  \"coreCompetencies\": [\n    \"Team Lead\",\n    \"Work Management\"\n  ]\n}\n\n- Preserve wording exactly.\n- Do not rewrite.\n- Do not move values between sections.\n   \n   INTERNSHIPS:\n   - title, company, description, duration\n   \n   TRAINING PROGRAMS:\n   - name, provider, completionDate, duration, description\n   \n   ACADEMIC PROJECTS:\n   - name, course, institution, duration, description, technologies (array), url\n   \n   LEADERSHIP POSITIONS:\n   - position, organization, startDate, endDate, description\n   \n   CO-CURRICULAR / EXTRA-CURRICULAR:\n   - activity, role, year\n   \n   LANGUAGES:\n   - language, level (Beginner/Intermediate/Advanced), capability (Speak/Read/Write)\n   \n   CERTIFICATIONS:\n   - name, issuer, date, url\n   \n   SCHOLARSHIPS:\n   - name, provider, organization, year, description\n   \n   AWARDS:\n   - title, organization, issueYear, description\n   \n   SPEAKING ENGAGEMENTS:\n   - topic, eventName, date, description\n   \n   MEMBERSHIPS:\n   - membershipName, organizationName, year, description\n   \n   WORKSHOPS:\n   - programTitle, conductedBy, year, description\n   \n   PROFESSIONAL CONTEXT:\n   - totalExperience, teamSize, industry, functionalDomain, geographicScope, revenueResponsibility\n   \n   SECTION VISIBILITY:\n   - personal, summary, experience, projects, education, skills, languages, \n     hobbies, certifications, awards, speakingEngagements, memberships, \n     workshops, socialLinks, customSections (all boolean)\n   \n   PORTFOLIO:\n   - name, description, url, type, platform\n   \n   CLIENT PROJECTS:\n   - name, role, description, clientOrganization, duration, toolsTechnologies, projectUrl\n   \n   VOLUNTEERING:\n   - organization, role, description, causeArea, duration\n   \n   MILITARY SERVICE:\n   - branch, rank, description, duration, specialization\n   \n   METHODOLOGIES:\n   - name, certification, experienceDuration\n   \n   INDUSTRY EXPERTISE:\n   - industry, domainArea, experienceDuration\n   \n   REFERENCES:\n   - name, designationRelationship, organization, contactInformation\n   \n   SOCIAL PROFILES:\n   - platform, url\n   \n   AVAILABILITY WORK AUTH:\n   - availabilityNoticePeriod, workAuthorizationStatus, preferredLocation\n   \n   TEACHING EXPERIENCE:\n   - title, institution, description, subjectCourseTaught, duration\n   \n   MENTORSHIP EXPERIENCE:\n   - description, mentorshipArea, organizationPlatform, menteeLevel, duration\n   \n   RESEARCH GRANTS:\n   - title, agency, amount, description, year\n   \n   TEST SCORES:\n   - testName, score, year, percentileRank\n   \n   PUBLICATIONS:\n   - title, journalPublisher, publicationType, year, urlDoi, authors\n   \n   PATENTS:\n   - title, patentNumber, status, issuingAuthority, year\n   \n   TOOLS TECHNOLOGIES:\n   - name, category, proficiency, experienceDuration\n\n4. For EDUCATION dates: ALWAYS split into startDate and graduationDate separately\n5. For SUMMARY/CAREER OBJECTIVE: Return as a simple string, NOT an object\n6. For SKILLS: \n   - ALWAYS return as an array of simple strings.\n   - DO NOT include any spoken languages (e.g., English, Hindi, Spanish, Bengali, French, etc.) in the skills array.\n   - Skills must be technical, professional, or domain-specific (e.g., \"BFSI Hiring\", \"Recruitment\", \"Client Acquisition\", \"Team Handling\", \"Communication\").\n   - Spoken/written languages MUST go into the \"languages\" section only.\n7. For EXPERIENCE (work experience):\n   - Each job MUST be a separate object in the \"experience\" array.\n   - For each job, the \"description\" field MUST contain ONLY the bullet points or responsibilities that belong EXCLUSIVELY to that job.\n   - DO NOT merge responsibilities from different jobs into a single description.\n   - DO NOT copy responsibilities from Job A into Job B.\n   - If a job has no bullet points, write a short paragraph describing that role only.\n   - If you see separate sections like \"Achievements\" under a job, include them as part of that job's description, but clearly separated (e.g., \"Achievements: ...\").\n\n8. Keep dates in original format but split ranges\n9. If a section has no data, OMIT it completely\n10. Return ONLY valid JSON, no explanations\n11. do not return not mentioned , unknown, undefined, null, empty string, or similar values. If a field is not present in the resume, simply omit it from the JSON.\n\nNow extract and return the structured JSON from the provided resume text:\n\n" + processedText;
                    maxRetries = 2;
                    attempt = 0;
                    _q.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 12];
                    _q.label = 2;
                case 2:
                    _q.trys.push([2, 8, , 11]);
                    console.log("\uD83D\uDCE4 Sending text to DeepInfra API (attempt " + (attempt + 1) + ")...");
                    return [4 /*yield*/, Promise.race([
                            deepinfra.chat.completions.create({
                                model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
                                max_tokens: 8000,
                                temperature: 0.1,
                                messages: [
                                    {
                                        role: "user",
                                        content: prompt
                                    },
                                ]
                            }),
                            new Promise(function (_, reject) {
                                return setTimeout(function () { return reject(new Error("API timeout")); }, API_TIMEOUT);
                            })
                        ])];
                case 3:
                    response = _q.sent();
                    responseContent = ((_d = (_c = (_b = (_a = response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim()) || "";
                    if (!((userId || guestId) && response.usage)) return [3 /*break*/, 7];
                    _q.label = 4;
                case 4:
                    _q.trys.push([4, 6, , 7]);
                    usage = response.usage;
                    return [4 /*yield*/, TokenUsage_1["default"].create({
                            userId: userId,
                            guestId: guestId,
                            promptTokens: (_h = (_g = (_f = (_e = usage.prompt_tokens) !== null && _e !== void 0 ? _e : usage.promptTokens) !== null && _f !== void 0 ? _f : usage.input_tokens) !== null && _g !== void 0 ? _g : usage.inputTokens) !== null && _h !== void 0 ? _h : 0,
                            completionTokens: (_m = (_l = (_k = (_j = usage.completion_tokens) !== null && _j !== void 0 ? _j : usage.completionTokens) !== null && _k !== void 0 ? _k : usage.output_tokens) !== null && _l !== void 0 ? _l : usage.outputTokens) !== null && _m !== void 0 ? _m : 0,
                            totalTokens: (_p = (_o = usage.total_tokens) !== null && _o !== void 0 ? _o : usage.totalTokens) !== null && _p !== void 0 ? _p : 0,
                            aiModel: response.model || "meta-llama/Llama-4-Scout-17B-16E-Instruct",
                            action: 'resume_parsing'
                        })];
                case 5:
                    _q.sent();
                    console.log("\uD83D\uDCCA Logged parsing token usage for " + (userId ? "user " + userId : "guest " + guestId));
                    return [3 /*break*/, 7];
                case 6:
                    logErr_1 = _q.sent();
                    console.error("Failed to log parsing token usage:", logErr_1);
                    return [3 /*break*/, 7];
                case 7:
                    if (!responseContent || responseContent.length < 50) {
                        throw new Error("Insufficient content extracted");
                    }
                    try {
                        cleanJson = responseContent
                            .replace(/```json\s*/g, "")
                            .replace(/```\s*/g, "")
                            .trim();
                        parsedData = JSON.parse(cleanJson);
                        console.log("\u2705 Resume processed successfully");
                        return [2 /*return*/, parsedData];
                    }
                    catch (err) {
                        fixedJson = fixMalformedJSON(responseContent);
                        parsedData = JSON.parse(fixedJson);
                        console.log("\u2705 Resume processed successfully (after fixing)");
                        return [2 /*return*/, parsedData];
                    }
                    return [3 /*break*/, 11];
                case 8:
                    err_3 = _q.sent();
                    console.log("\u26A0\uFE0F Processing failed on attempt " + (attempt + 1) + ": " + err_3.message);
                    attempt++;
                    if (attempt > maxRetries) {
                        console.error("\u274C Failed to process resume after " + maxRetries + " attempts");
                        return [2 /*return*/, {}];
                    }
                    if (!(attempt < maxRetries)) return [3 /*break*/, 10];
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 1000); })];
                case 9:
                    _q.sent();
                    _q.label = 10;
                case 10: return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 1];
                case 12: return [2 /*return*/, {}];
            }
        });
    });
}
// ---------- MAIN FUNCTION (Handles both PDF and DOCX) ----------
function parseResume(userId, filePath, guestId) {
    if (guestId === void 0) { guestId = null; }
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, fileType, extractedText, tokenCount, aiParsed, extractError_1, mappedData, processedData, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 Starting resume parsing pipeline (Text-based)...");
                    console.log("\uD83D\uDCC2 File: " + filePath);
                    cacheKey = filePath + "-" + fs_1["default"].statSync(filePath).mtimeMs;
                    if (processedCache.has(cacheKey)) {
                        console.log("✅ Returning cached result");
                        return [2 /*return*/, processedCache.get(cacheKey)];
                    }
                    fileType = detectFileType(filePath);
                    extractedText = "";
                    if (!(fileType === "docx")) return [3 /*break*/, 2];
                    console.log("📄 Detected DOCX file, extracting text...");
                    return [4 /*yield*/, extractTextFromDocx(filePath)];
                case 1:
                    extractedText = _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(fileType === "pdf")) return [3 /*break*/, 4];
                    console.log("📄 Detected PDF file, extracting text...");
                    return [4 /*yield*/, extractTextFromPDF(filePath)];
                case 3:
                    extractedText = _a.sent();
                    return [3 /*break*/, 5];
                case 4: throw new Error("Unsupported file type: " + fileType);
                case 5:
                    if (!extractedText || extractedText.trim().length === 0) {
                        throw new Error("No text content extracted from file");
                    }
                    console.log("\uD83D\uDCDD Extracted " + extractedText.length + " characters of text");
                    tokenCount = countTokens(extractedText);
                    console.log("\uD83D\uDCCA Estimated tokens: " + tokenCount);
                    if (tokenCount > 10000) {
                        console.error("Token count exceeds limit (10,000)");
                        throw new Error("Exceed token limit , plese upload a smaller file");
                    }
                    // Single AI call with the extracted text
                    console.log("🤖 Sending text to AI for parsing...");
                    aiParsed = {};
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, extractDataFromText(userId, extractedText, guestId)];
                case 7:
                    aiParsed = _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    extractError_1 = _a.sent();
                    console.error("❌ AI processing failed:", extractError_1.message);
                    console.log("⚠️ Returning empty result");
                    return [2 /*return*/, normalizeParsedResume_1.normalizeParsedResume({})];
                case 9:
                    // Log what the AI returned BEFORE normalization (only in development)
                    if (process.env.NODE_ENV === "development") {
                        console.log("\n📥 RAW AI PARSED DATA (before normalization):");
                        console.log(JSON.stringify(aiParsed, null, 2));
                    }
                    // Apply field mapping
                    console.log("\n🔄 Mapping field names...");
                    mappedData = mapFieldNames(aiParsed);
                    // Apply post-processing to fix all issues
                    console.log("\n🔄 Post-processing parsed data...");
                    processedData = postProcessParsedData(mappedData);
                    // Normalize and return
                    console.log("\n🔄 Normalizing parsed data...");
                    result = normalizeParsedResume_1.normalizeParsedResume(processedData);
                    console.log("\n🎉 FINAL PARSING RESULT READY");
                    // Cache result
                    processedCache.set(cacheKey, result);
                    return [2 /*return*/, result];
            }
        });
    });
}
exports["default"] = parseResume;

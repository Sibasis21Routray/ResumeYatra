"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_controller_1 = require("../controllers/resume.controller");
const upload_controller_1 = require("../controllers/upload.controller");
const template_controller_1 = require("../controllers/template.controller");
const ai_controller_1 = require("../controllers/ai.controller");
const export_controller_1 = require("../controllers/export.controller");
const email_controller_1 = require("../controllers/email.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// We're using Cloudinary for storage; no local upload dir required
// uploadMiddleware is provided by ../middleware/upload.middleware
router.post("/", resume_controller_1.createResume);
router.get("/", resume_controller_1.listResumes);
router.get("/:id", resume_controller_1.getResume);
router.put("/:id", resume_controller_1.updateResume);
router.delete("/:id", resume_controller_1.deleteResume);
// Upload and parse original resume file
router.post("/:id/upload", upload_middleware_1.uploadMiddleware, upload_controller_1.uploadResume);
// Upload personal image
router.post("/:id/upload-image", upload_middleware_1.uploadMiddleware, upload_controller_1.uploadImage);
// Render resume to PDF
router.get("/:id/render", template_controller_1.renderResume);
// Render resume to HTML (for preview)
router.get("/:id/preview", template_controller_1.renderResumeHtml);
router.post("/:id/preview", template_controller_1.renderResumeHtml);
// AI-powered enhancement
router.post("/:id/enhance", ai_controller_1.enhanceResume);
router.post("/:id/suggestions", ai_controller_1.getSuggestions);
router.post("/:id/suggest-skills", ai_controller_1.suggestSkills);
router.post("/:id/suggest-skills-by-title", ai_controller_1.suggestSkillsByJobTitle);
router.post("/:id/auto-suggestions", ai_controller_1.getAutoSuggestions);
router.post("/:id/suggest-hobbies", ai_controller_1.suggestHobbies);
router.post("/:id/suggest-description-paragraphs", ai_controller_1.suggestDescriptionParagraphs);
router.post("/:id/suggest-summary-paragraphs", ai_controller_1.suggestSummaryParagraphs);
router.post("/:id/suggest-key-achievements", ai_controller_1.suggestKeyAchievements);
router.post("/:id/translate", ai_controller_1.translateText);
// Export endpoints
router.get("/:id/export/pdf", export_controller_1.exportPdf);
router.post("/:id/export/pdf", export_controller_1.exportPdf);
router.get("/:id/export/docx", export_controller_1.exportDocx);
router.post("/:id/export/docx", export_controller_1.exportDocx);
router.get("/:id/export/txt", export_controller_1.exportTxt);
router.post("/:id/export/txt", export_controller_1.exportTxt);
// File management with Cloudinary
router.post("/:id/generate-files", resume_controller_1.generateFiles);
router.get("/:id/files", resume_controller_1.getFiles);
router.get("/files/:fileId/download", resume_controller_1.downloadFile);
// Email resume
router.post("/:id/email", email_controller_1.sendResumeEmail);
exports.default = router;

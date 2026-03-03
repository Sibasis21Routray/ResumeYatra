import { Router } from "express";

import {
  createResume,
  listResumes,
  getResume,
  updateResume,
  deleteResume,
  generateFiles,
  getFiles,
  downloadFile,
} from "../controllers/resume.controller";
import { uploadResume, uploadImage } from "../controllers/upload.controller";
import {
  renderResume,
  renderResumeHtml,
} from "../controllers/template.controller";
import {
  enhanceResume,
  getSuggestions,
  suggestSkills,
  getAutoSuggestions,
  suggestSkillsByJobTitle,
  suggestSummaryParagraphs,
  suggestDescriptionParagraphs,
  suggestHobbies,
  suggestKeyAchievements,
  translateText,
} from "../controllers/ai.controller";
import {
  exportPdf,
  exportDocx,
  exportTxt,
} from "../controllers/export.controller";
import { sendResumeEmail } from "../controllers/email.controller";
import { uploadMiddleware } from "../middleware/upload.middleware";

const router = Router();

// We're using Cloudinary for storage; no local upload dir required

// uploadMiddleware is provided by ../middleware/upload.middleware

router.post("/", createResume);
router.get("/", listResumes);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

// Upload and parse original resume file
router.post("/:id/upload", uploadMiddleware, uploadResume);

// Upload personal image
router.post("/:id/upload-image", uploadMiddleware, uploadImage);

// Render resume to PDF
router.get("/:id/render", renderResume);

// Render resume to HTML (for preview)
router.get("/:id/preview", renderResumeHtml);
router.post("/:id/preview", renderResumeHtml);

// AI-powered enhancement
router.post("/:id/enhance", enhanceResume);
router.post("/:id/suggestions", getSuggestions);
router.post("/:id/suggest-skills", suggestSkills);
router.post("/:id/suggest-skills-by-title", suggestSkillsByJobTitle);
router.post("/:id/auto-suggestions", getAutoSuggestions);
router.post("/:id/suggest-hobbies", suggestHobbies);
router.post(
  "/:id/suggest-description-paragraphs",
  suggestDescriptionParagraphs
);
router.post("/:id/suggest-summary-paragraphs", suggestSummaryParagraphs);
router.post("/:id/suggest-key-achievements", suggestKeyAchievements);
router.post("/:id/translate", translateText);

// Export endpoints
router.get("/:id/export/pdf", exportPdf);
router.post("/:id/export/pdf", exportPdf);
router.get("/:id/export/docx", exportDocx);
router.post("/:id/export/docx", exportDocx);
router.get("/:id/export/txt", exportTxt);
router.post("/:id/export/txt", exportTxt);

// File management with Cloudinary
router.post("/:id/generate-files", generateFiles);
router.get("/:id/files", getFiles);
router.get("/files/:fileId/download", downloadFile);

// Email resume
router.post("/:id/email", sendResumeEmail);

export default router;

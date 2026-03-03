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
exports.exportPdf = exportPdf;
exports.exportDocx = exportDocx;
exports.exportTxt = exportTxt;
const Resume_1 = __importDefault(require("../models/Resume"));
const User_1 = __importDefault(require("../models/User"));
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const docxService = __importStar(require("../services/docx.service"));
const txtService = __importStar(require("../services/txt.service"));
const pdf_service_1 = require("../services/pdf.service");
const templateService = __importStar(require("../services/template.service"));
const mongoose_1 = __importDefault(require("mongoose"));
async function exportPdf(req, res) {
    try {
        const resumeId = req.params.id;
        const userId = req.userId;
        const template = req.query.template || "modern";
        const theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : req.body?.theme || undefined;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
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
        // Get latest version
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId }).sort({
            createdAt: -1,
        });
        if (!latestVersion)
            return res.status(404).json({ error: "no resume data found" });
        if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
            return res.status(400).json({ error: "resume has no data to export" });
        }
        // If caller provided current resume data (from preview/editor), prefer that for export
        // This allows exporting unsaved changes from the frontend (POST with body.data)
        const currentData = req.method === "POST" && req.body && req.body.data
            ? req.body.data
            : undefined;
        const dataForExport = currentData || latestVersion.data;
        const html = await templateService.renderResumeHtml(resumeId, template, theme, currentData);
        console.log("Generated HTML for PDF export, length:", html.length);
        console.log("HTML preview (first 500 chars):", html.substring(0, 500));
        console.log("Resume data keys:", Object.keys(latestVersion.data));
        console.log("Resume data personal:", latestVersion.data.personal);
        const pdfBuffer = await (0, pdf_service_1.generatePdfBuffer)(html);
        console.log("Generated PDF buffer length:", pdfBuffer.length);
        console.log("PDF buffer first 20 bytes (hex):", pdfBuffer.subarray(0, 20).toString("hex"));
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Generated PDF buffer is empty");
        }
        // PDF buffer validation
        if (!pdfBuffer || pdfBuffer.length < 1000) {
            throw new Error("Generated PDF is too small or empty");
        }
        // Set headers for file download
        const filename = `${resume.title || "resume"}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", Buffer.byteLength(pdfBuffer));
        // Send the PDF buffer as binary
        res.end(pdfBuffer);
    }
    catch (err) {
        console.error("export PDF error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function exportDocx(req, res) {
    try {
        const resumeId = req.params.id;
        const userId = req.userId;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
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
        // Get latest version
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId }).sort({
            createdAt: -1,
        });
        if (!latestVersion)
            return res.status(404).json({ error: "no resume data found" });
        if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
            return res.status(400).json({ error: "resume has no data to export" });
        }
        // If caller provided current resume data (from preview/editor), prefer that for export
        const currentData = req.method === "POST" && req.body && req.body.data
            ? req.body.data
            : undefined;
        const dataForExport = currentData || latestVersion.data;
        // Generate DOCX buffer directly from data
        const docxBuffer = await docxService.generateDocxBuffer(dataForExport);
        // Set headers for file download
        const filename = `${resume.title || "resume"}.docx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", docxBuffer.length);
        // Send the DOCX buffer
        res.send(docxBuffer);
    }
    catch (err) {
        console.error("export DOCX error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function exportTxt(req, res) {
    try {
        const resumeId = req.params.id;
        const userId = req.userId;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
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
        // Get latest version
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId }).sort({
            createdAt: -1,
        });
        if (!latestVersion)
            return res.status(404).json({ error: "no resume data found" });
        // If caller provided current resume data (from preview/editor), prefer that for export
        const currentData = req.method === "POST" && req.body && req.body.data
            ? req.body.data
            : undefined;
        const dataForExport = currentData || latestVersion.data;
        // Generate TXT content
        const txt = await txtService.generateTxt(dataForExport);
        const txtBuffer = Buffer.from(txt, "utf-8");
        // Set headers for file download
        const filename = `${resume.title || "resume"}.txt`;
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", txtBuffer.length);
        // Send the TXT buffer
        res.send(txtBuffer);
    }
    catch (err) {
        console.error("export TXT error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}

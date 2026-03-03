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
exports.sendResumeEmail = void 0;
const email_service_1 = require("../services/email.service");
const pdf_service_1 = require("../services/pdf.service");
const docx_service_1 = require("../services/docx.service");
const txt_service_1 = require("../services/txt.service");
const templateService = __importStar(require("../services/template.service"));
const Resume_1 = __importDefault(require("../models/Resume"));
const User_1 = __importDefault(require("../models/User"));
const ResumeVersion_1 = __importDefault(require("../models/ResumeVersion"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendResumeEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const { to, subject, body, format = "pdf" } = req.body;
        const userId = req.userId;
        if (!to || !subject || !body) {
            return res
                .status(400)
                .json({ error: "Recipient email, subject, and body are required" });
        }
        if (!id || id === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Verify resume exists
        const resume = await Resume_1.default.findById(id);
        if (!resume)
            return res.status(404).json({ error: "Resume not found" });
        // Check ownership or admin access
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        // Get latest version
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId: id }).sort({
            createdAt: -1,
        });
        if (!latestVersion)
            return res.status(404).json({ error: "no resume data found" });
        if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
            return res.status(400).json({ error: "resume has no data to export" });
        }
        // If caller provided current resume data, prefer that
        const currentData = req.body.data || undefined;
        const dataForExport = currentData || latestVersion.data;
        const template = req.body.template || resume.template || "modern";
        const theme = req.body.theme || undefined;
        let resumeBuffer;
        let filename;
        if (format === "pdf") {
            const html = await templateService.renderResumeHtml(id, template, theme, currentData);
            resumeBuffer = await (0, pdf_service_1.generatePdfBuffer)(html);
            filename = `${resume.title || "resume"}.pdf`;
        }
        else if (format === "docx") {
            resumeBuffer = await (0, docx_service_1.generateDocxBuffer)(dataForExport, theme);
            filename = `${resume.title || "resume"}.docx`;
        }
        else if (format === "txt") {
            const txt = await (0, txt_service_1.generateTxt)(dataForExport);
            resumeBuffer = Buffer.from(txt, "utf-8");
            filename = `${resume.title || "resume"}.txt`;
        }
        else {
            return res
                .status(400)
                .json({ error: "Invalid format. Supported formats: pdf, docx, txt" });
        }
        if (!resumeBuffer) {
            return res.status(500).json({ error: "Failed to generate resume file" });
        }
        // Send the email with resume attachment
        await email_service_1.emailService.sendResumeEmail(to, subject, body, resumeBuffer, filename);
        res.json({ message: "Resume sent successfully" });
    }
    catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: error.message || "Failed to send email" });
    }
};
exports.sendResumeEmail = sendResumeEmail;

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
const templateService = __importStar(require("../services/template.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("../config/redis");
const crypto_1 = __importDefault(require("crypto"));
const export_queue_1 = require("../services/export.queue");
// Helper function to extract guestId from headers (handles array case)
function getGuestId(headers) {
    const guestId = headers["x-guest-id"];
    if (Array.isArray(guestId)) {
        return guestId[0] || null;
    }
    return guestId || null;
}
async function exportPdf(req, res) {
    try {
        const resumeId = req.params.id;
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        const template = req.query.template || "modern";
        const theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : req.body?.theme || undefined;
        // Validate resume ID
        if (!resumeId || resumeId === "undefined") {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        // Check authentication
        if (!userId && !guestId) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        // Verify resume exists
        let resume = await Resume_1.default.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ error: "resume not found" });
        }
        // Check ownership OR admin status
        let isAdmin = false;
        if (userId) {
            const user = await User_1.default.findById(userId);
            isAdmin = user?.role === "admin";
        }
        const isOwner = (userId && resume.ownerId?.toString() === userId) ||
            (guestId && resume.guestId === guestId);
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "Access denied" });
        }
        // Check if resume is paid (bypass for admin)
        if (!resume.isDownloadPaid && !isAdmin) {
            return res.status(402).json({
                error: "Payment required to export PDF",
                type: "download"
            });
        }
        // If caller provided current resume data (from preview/editor), prefer that for export
        // This allows exporting unsaved changes from the frontend (POST with body.data)
        const currentData = req.method === "POST" && req.body && req.body.data
            ? req.body.data
            : undefined;
        const html = await templateService.renderResumeHtml(resumeId, template, theme, currentData);
        //  Create unique key from HTML for caching
        const hash = crypto_1.default.createHash("sha256").update(html).digest("hex");
        const cacheKey = `pdf:${hash}`;
        let pdfBuffer = null;
        // ⚡ Try Redis Cache (Fail-Open)
        try {
            const cachedPdf = await redis_1.redis.get(cacheKey);
            if (typeof cachedPdf === "string") {
                console.log("⚡ PDF from Redis cache hit");
                pdfBuffer = Buffer.from(cachedPdf, "base64");
            }
        }
        catch (cacheErr) {
            console.warn("⚠️ Redis cache error (proceeding manually):", cacheErr);
        }
        // 🛠 Generate if not in cache (via Queue)
        if (!pdfBuffer) {
            console.log("🛠 Queueing PDF generation (cache miss)...");
            pdfBuffer = await (0, export_queue_1.queueExportTask)({
                type: "pdf",
                html,
                resumeId
            });
            // Store in Redis in background
            if (pdfBuffer && pdfBuffer.length > 0) {
                redis_1.redis.set(cacheKey, pdfBuffer.toString("base64"), {
                    EX: 60 * 60, // 1 hour
                }).catch(err => console.warn("Failed to set Redis cache:", err));
            }
        }
        if (!pdfBuffer || pdfBuffer.length < 1000) {
            throw new Error("Generated PDF is too small or invalid");
        }
        // ✅ SUCCESS: Now consume the download credit
        resume.isDownloadPaid = false;
        resume.isDownloaded = true;
        await resume.save();
        console.log("✅ PDF Export complete and credit consumed");
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        const template = req.query.template || "modern";
        const theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : req.body?.theme || undefined;
        console.log(`[exportDocx] ID: ${resumeId}, userId: ${userId}, guestId: ${guestId}`);
        // Validate resume ID
        if (!resumeId || resumeId === "undefined") {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        // Check authentication
        if (!userId && !guestId) {
            console.warn(`[exportDocx] DENIED: No userId or guestId provided for resume: ${resumeId}`);
            return res.status(401).json({ error: "Not authenticated" });
        }
        // Verify resume exists
        let resume = await Resume_1.default.findById(resumeId);
        if (!resume) {
            console.warn(`[exportDocx] Resume NOT FOUND or ACCESS DENIED for ID: ${resumeId}`);
            return res.status(404).json({ error: "resume not found" });
        }
        // Check ownership OR admin status
        let isAdmin = false;
        if (userId) {
            const user = await User_1.default.findById(userId);
            isAdmin = user?.role === "admin";
        }
        const isOwner = (userId && resume.ownerId?.toString() === userId) ||
            (guestId && resume.guestId === guestId);
        if (!isOwner && !isAdmin) {
            console.warn(`[exportDocx] DENIED: Unauthorized access attempt to resume: ${resumeId}`);
            return res.status(403).json({ error: "Access denied" });
        }
        console.log(`[exportDocx] Found Resume: ${resume._id}. isDownloadPaid: ${resume.isDownloadPaid}, isAdmin: ${isAdmin}`);
        // Check if resume is paid (bypass for admin)
        if (!resume.isDownloadPaid && !isAdmin) {
            return res.status(402).json({
                error: "Payment required to export DOCX",
                type: "download"
            });
        }
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId }).sort({
            createdAt: -1,
        });
        if (!latestVersion) {
            return res.status(404).json({ error: "no resume data found" });
        }
        if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
            return res.status(400).json({ error: "resume has no data to export" });
        }
        const currentData = req.method === "POST" && req.body && req.body.data
            ? req.body.data
            : undefined;
        // ✅ HTML
        const html = await templateService.renderResumeHtml(resumeId, template, theme, currentData);
        //  Create unique key from HTML for caching
        const hash = crypto_1.default.createHash("sha256").update(html).digest("hex");
        const cacheKey = `docx:${hash}`;
        let docxBuffer = null;
        // ⚡ Try Redis Cache (Fail-Open)
        try {
            const cachedDocx = await redis_1.redis.get(cacheKey);
            if (typeof cachedDocx === "string") {
                console.log("⚡ DOCX from Redis cache hit");
                docxBuffer = Buffer.from(cachedDocx, "base64");
            }
        }
        catch (cacheErr) {
            console.warn("⚠️ Redis cache error in DOCX (proceeding manually):", cacheErr);
        }
        if (!docxBuffer) {
            console.log("🛠 Queueing DOCX generation (cache miss)...");
            docxBuffer = await (0, export_queue_1.queueExportTask)({
                type: "docx",
                html,
                data: currentData || latestVersion.data,
                resumeId
            });
            // Store in Redis in background
            if (docxBuffer && docxBuffer.length > 0) {
                redis_1.redis.set(cacheKey, docxBuffer.toString("base64"), {
                    EX: 60 * 60, // 1 hour
                }).catch(err => console.warn("Failed to set Redis cache for DOCX:", err));
            }
        }
        if (!docxBuffer || docxBuffer.length === 0) {
            throw new Error("Failed to generate DOCX buffer");
        }
        // ✅ SUCCESS: Now consume the download credit
        resume.isDownloadPaid = false;
        resume.isDownloaded = true;
        await resume.save();
        const filename = `${resume.title || "resume"}.docx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", docxBuffer.length);
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
        const userId = req.userId || null;
        const guestId = getGuestId(req.headers);
        const template = req.query.template || "modern";
        console.log(`[exportPdf] ID: ${resumeId}, userId: ${userId}, guestId: ${guestId}`);
        // Validate resume ID
        if (!resumeId || resumeId === "undefined") {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ error: "Invalid resume ID" });
        }
        // Check authentication
        if (!userId && !guestId) {
            console.warn(`[exportPdf] DENIED: No userId or guestId provided for resume: ${resumeId}`);
            return res.status(401).json({ error: "Not authenticated" });
        }
        // Verify resume exists
        let resume = await Resume_1.default.findById(resumeId);
        if (!resume) {
            console.warn(`[exportTxt] Resume NOT FOUND for ID: ${resumeId}`);
            return res.status(404).json({ error: "resume not found" });
        }
        // Check ownership OR admin status
        let isAdmin = false;
        if (userId) {
            const user = await User_1.default.findById(userId);
            isAdmin = user?.role === "admin";
        }
        const isOwner = (userId && resume.ownerId?.toString() === userId) ||
            (guestId && resume.guestId === guestId);
        if (!isOwner && !isAdmin) {
            console.warn(`[exportTxt] DENIED: Unauthorized access attempt to resume: ${resumeId}`);
            return res.status(403).json({ error: "Access denied" });
        }
        console.log(`[exportTxt] Found Resume: ${resume._id}. isDownloadPaid: ${resume.isDownloadPaid}, isAdmin: ${isAdmin}`);
        // Check if resume is paid (bypass for admin)
        if (!resume.isDownloadPaid && !isAdmin) {
            return res.status(402).json({
                error: "Payment required to export TXT",
                type: "download"
            });
        }
        // Get latest version
        const latestVersion = await ResumeVersion_1.default.findOne({ resumeId }).sort({
            createdAt: -1,
        });
        if (!latestVersion) {
            return res.status(404).json({ error: "no resume data found" });
        }
        // If caller provided current resume data (from preview/editor), prefer that for export
        const currentData = req.method === "POST" && req.body && req.body.data
            ? req.body.data
            : undefined;
        const dataForExport = currentData || latestVersion.data;
        //  Create unique key for caching
        const hash = crypto_1.default.createHash("sha256").update(JSON.stringify(dataForExport)).digest("hex");
        const cacheKey = `txt:${hash}`;
        let txtBuffer = null;
        // ⚡ Try Redis Cache (Fail-Open)
        try {
            const cachedTxt = await redis_1.redis.get(cacheKey);
            if (typeof cachedTxt === "string") {
                console.log("⚡ TXT from Redis cache hit");
                txtBuffer = Buffer.from(cachedTxt, "base64");
            }
        }
        catch (cacheErr) {
            console.warn("⚠️ Redis cache error in TXT (proceeding manually):", cacheErr);
        }
        if (!txtBuffer) {
            console.log("🛠 Queueing TXT generation (cache miss)...");
            txtBuffer = await (0, export_queue_1.queueExportTask)({
                type: "txt",
                data: dataForExport,
                resumeId
            });
            // Store in Redis in background
            if (txtBuffer && txtBuffer.length > 0) {
                redis_1.redis.set(cacheKey, txtBuffer.toString("base64"), {
                    EX: 60 * 60, // 1 hour
                }).catch(err => console.warn("Failed to set Redis cache for TXT:", err));
            }
        }
        if (!txtBuffer || txtBuffer.length === 0) {
            throw new Error("Failed to generate TXT content");
        }
        // ✅ SUCCESS: Now consume the download credit
        resume.isDownloadPaid = false;
        resume.isDownloaded = true;
        await resume.save();
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

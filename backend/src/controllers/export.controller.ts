import { Request, Response } from "express";
import Resume from "../models/Resume";
import User from "../models/User";
import ResumeVersion from "../models/ResumeVersion";
import * as pdfService from "../services/pdf.service";
import * as docxService from "../services/docx.service";
import * as txtService from "../services/txt.service";
import { generatePdfBuffer } from "../services/pdf.service";
import * as templateService from "../services/template.service";
import mongoose from "mongoose";

import { redis } from "../config/redis";
import crypto from "crypto";
import { queueExportTask } from "../services/export.queue";

// Helper function to extract guestId from headers (handles array case)
function getGuestId(headers: any): string | null {
  const guestId = headers["x-guest-id"];
  if (Array.isArray(guestId)) {
    return guestId[0] || null;
  }
  return guestId || null;
}

export async function exportPdf(req: Request, res: Response) {
  try {
    const resumeId = req.params.id as string;
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);
    const template = (req.query.template as string) || "modern";
    const theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : req.body?.theme || undefined;

    // Validate resume ID
    if (!resumeId || resumeId === "undefined") {
      return res.status(400).json({ error: "Invalid resume ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    // Check authentication
    if (!userId && !guestId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Verify resume exists
    let resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "resume not found" });
    }

    // Check ownership OR admin status
    let isAdmin = false;
    if (userId) {
      const user = await User.findById(userId);
      isAdmin = user?.role === "admin";
    }

    const isOwner = (userId && resume.ownerId?.toString() === userId) ||
      (guestId && resume.guestId === guestId);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    console.log(`[exportPdf] Attempting export for resume ${resumeId}. isDownloadPaid: ${resume.isDownloadPaid}, isAiPaid: ${resume.isAiPaid}, isAdmin: ${isAdmin}`);

    // Check if resume is paid (bypass for admin)
    if (!resume.isDownloadPaid && !isAdmin) {
      return res.status(402).json({
        error: "Payment required to export PDF",
        type: "download"
      });
    }

    // If caller provided current resume data (from preview/editor), prefer that for export
    // This allows exporting unsaved changes from the frontend (POST with body.data)
    const currentData =
      req.method === "POST" && req.body && req.body.data
        ? req.body.data
        : undefined;

    const html = await templateService.renderResumeHtml(
      resumeId as string,
      template,
      theme,
      currentData
    );

    //  Create unique key from HTML for caching
    const hash = crypto.createHash("sha256").update(html).digest("hex");
    const cacheKey = `pdf:${hash}`;

    let pdfBuffer: Buffer | null = null;

    // ⚡ Try Redis Cache (Fail-Open)
    try {
      const cachedPdf = await redis.get(cacheKey);
      if (typeof cachedPdf === "string") {
        console.log("⚡ PDF from Redis cache hit");
        pdfBuffer = Buffer.from(cachedPdf, "base64");
      }
    } catch (cacheErr) {
      console.warn("⚠️ Redis cache error (proceeding manually):", cacheErr);
    }

    // 🛠 Generate if not in cache (via Queue)
    if (!pdfBuffer) {
      console.log("🛠 Queueing PDF generation (cache miss)...");
      pdfBuffer = await queueExportTask({
        type: "pdf",
        html,
        resumeId
      });

      // Store in Redis in background
      if (pdfBuffer && pdfBuffer.length > 0) {
        redis.set(cacheKey, pdfBuffer.toString("base64"), {
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

    console.log("✅ PDF Export complete");

    console.log("Generated PDF buffer length:", pdfBuffer.length);
    console.log(
      "PDF buffer first 20 bytes (hex):",
      pdfBuffer.subarray(0, 20).toString("hex")
    );

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
  } catch (err: any) {
    console.error("export PDF error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function exportDocx(req: Request, res: Response) {
  try {
    const resumeId = req.params.id as string;
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);
    const template = (req.query.template as string) || "modern";
    const theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : req.body?.theme || undefined;

    console.log(`[exportDocx] ID: ${resumeId}, userId: ${userId}, guestId: ${guestId}`);

    // Validate resume ID
    if (!resumeId || resumeId === "undefined") {
      return res.status(400).json({ error: "Invalid resume ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    // Check authentication
    if (!userId && !guestId) {
      console.warn(`[exportDocx] DENIED: No userId or guestId provided for resume: ${resumeId}`);
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Verify resume exists
    let resume = await Resume.findById(resumeId);
    if (!resume) {
      console.warn(`[exportDocx] Resume NOT FOUND or ACCESS DENIED for ID: ${resumeId}`);
      return res.status(404).json({ error: "resume not found" });
    }

    // Check ownership OR admin status
    let isAdmin = false;
    if (userId) {
      const user = await User.findById(userId);
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

    const latestVersion = await ResumeVersion.findOne({ resumeId }).sort({
      createdAt: -1,
    });

    if (!latestVersion) {
      return res.status(404).json({ error: "no resume data found" });
    }

    if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
      return res.status(400).json({ error: "resume has no data to export" });
    }

    const currentData =
      req.method === "POST" && req.body && req.body.data
        ? req.body.data
        : undefined;

    // ✅ HTML
    const html = await templateService.renderResumeHtml(
      resumeId,
      template,
      theme,
      currentData
    );

    //  Create unique key from HTML for caching
    const hash = crypto.createHash("sha256").update(html).digest("hex");
    const cacheKey = `docx:${hash}`;

    let docxBuffer: Buffer | null = null;

    // ⚡ Try Redis Cache (Fail-Open)
    try {
      const cachedDocx = await redis.get(cacheKey);
      if (typeof cachedDocx === "string") {
        console.log("⚡ DOCX from Redis cache hit");
        docxBuffer = Buffer.from(cachedDocx, "base64");
      }
    } catch (cacheErr) {
      console.warn("⚠️ Redis cache error in DOCX (proceeding manually):", cacheErr);
    }

    if (!docxBuffer) {
      console.log("🛠 Queueing DOCX generation (cache miss)...");

      docxBuffer = await queueExportTask({
        type: "docx",
        html,
        data: currentData || latestVersion.data,
        resumeId
      });

      // Store in Redis in background
      if (docxBuffer && docxBuffer.length > 0) {
        redis.set(cacheKey, docxBuffer.toString("base64"), {
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

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", docxBuffer.length);

    res.send(docxBuffer);

  } catch (err: any) {
    console.error("export DOCX error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function exportTxt(req: Request, res: Response) {
  try {
    const resumeId = req.params.id as string;
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);
    const template = (req.query.template as string) || "modern";

    console.log(`[exportPdf] ID: ${resumeId}, userId: ${userId}, guestId: ${guestId}`);

    // Validate resume ID
    if (!resumeId || resumeId === "undefined") {
      return res.status(400).json({ error: "Invalid resume ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    // Check authentication
    if (!userId && !guestId) {
      console.warn(`[exportPdf] DENIED: No userId or guestId provided for resume: ${resumeId}`);
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Verify resume exists
    let resume = await Resume.findById(resumeId);
    if (!resume) {
      console.warn(`[exportTxt] Resume NOT FOUND for ID: ${resumeId}`);
      return res.status(404).json({ error: "resume not found" });
    }

    // Check ownership OR admin status
    let isAdmin = false;
    if (userId) {
      const user = await User.findById(userId);
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
    const latestVersion = await ResumeVersion.findOne({ resumeId }).sort({
      createdAt: -1,
    });

    if (!latestVersion) {
      return res.status(404).json({ error: "no resume data found" });
    }

    // If caller provided current resume data (from preview/editor), prefer that for export
    const currentData =
      req.method === "POST" && req.body && req.body.data
        ? req.body.data
        : undefined;
    const dataForExport = currentData || latestVersion.data;

    //  Create unique key for caching
    const hash = crypto.createHash("sha256").update(JSON.stringify(dataForExport)).digest("hex");
    const cacheKey = `txt:${hash}`;

    let txtBuffer: Buffer | null = null;

    // ⚡ Try Redis Cache (Fail-Open)
    try {
      const cachedTxt = await redis.get(cacheKey);
      if (typeof cachedTxt === "string") {
        console.log("⚡ TXT from Redis cache hit");
        txtBuffer = Buffer.from(cachedTxt, "base64");
      }
    } catch (cacheErr) {
      console.warn("⚠️ Redis cache error in TXT (proceeding manually):", cacheErr);
    }

    if (!txtBuffer) {
      console.log("🛠 Queueing TXT generation (cache miss)...");

      txtBuffer = await queueExportTask({
        type: "txt",
        data: dataForExport,
        resumeId
      });

      // Store in Redis in background
      if (txtBuffer && txtBuffer.length > 0) {
        redis.set(cacheKey, txtBuffer.toString("base64"), {
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
  } catch (err: any) {
    console.error("export TXT error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}
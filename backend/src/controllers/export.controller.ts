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

export async function exportPdf(req: Request, res: Response) {
  try {
    const resumeId = req.params.id as string;
    const userId = req.userId;
    const template = (req.query.template as string) || "modern";
    const theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : req.body?.theme || undefined;

    if (!resumeId || resumeId === "undefined" || !userId)
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume exists
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Check ownership or admin access
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get latest version
    const latestVersion = await ResumeVersion.findOne({ resumeId }).sort({
      createdAt: -1,
    });

    if (!latestVersion)
      return res.status(404).json({ error: "no resume data found" });

    if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
      return res.status(400).json({ error: "resume has no data to export" });
    }

    // If caller provided current resume data (from preview/editor), prefer that for export
    // This allows exporting unsaved changes from the frontend (POST with body.data)
    const currentData =
      req.method === "POST" && req.body && req.body.data
        ? req.body.data
        : undefined;
    const dataForExport = currentData || latestVersion.data;
    const html = await templateService.renderResumeHtml(
      resumeId as string,
      template,
      theme,
      currentData
    );

    console.log("Generated HTML for PDF export, length:", html.length);
    console.log("HTML preview (first 500 chars):", html.substring(0, 500));
    console.log("Resume data keys:", Object.keys(latestVersion.data as any));
    console.log("Resume data personal:", (latestVersion.data as any).personal);

    const pdfBuffer = await generatePdfBuffer(html);

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
    const userId = req.userId;

    if (!resumeId || resumeId === "undefined" || !userId)
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume exists
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Check ownership or admin access
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get latest version
    const latestVersion = await ResumeVersion.findOne({ resumeId }).sort({
      createdAt: -1,
    });

    if (!latestVersion)
      return res.status(404).json({ error: "no resume data found" });

    if (!latestVersion.data || Object.keys(latestVersion.data).length === 0) {
      return res.status(400).json({ error: "resume has no data to export" });
    }

    // If caller provided current resume data (from preview/editor), prefer that for export
    const currentData =
      req.method === "POST" && req.body && req.body.data
        ? req.body.data
        : undefined;
    const dataForExport = currentData || latestVersion.data;

    // Generate DOCX buffer directly from data
    const docxBuffer = await docxService.generateDocxBuffer(
      dataForExport as any
    );

    // Set headers for file download
    const filename = `${resume.title || "resume"}.docx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", docxBuffer.length);

    // Send the DOCX buffer
    res.send(docxBuffer);
  } catch (err: any) {
    console.error("export DOCX error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function exportTxt(req: Request, res: Response) {
  try {
    const resumeId = req.params.id as string;
    const userId = req.userId;

    if (!resumeId || resumeId === "undefined" || !userId)
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume exists
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Check ownership or admin access
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get latest version
    const latestVersion = await ResumeVersion.findOne({ resumeId }).sort({
      createdAt: -1,
    });

    if (!latestVersion)
      return res.status(404).json({ error: "no resume data found" });

    // If caller provided current resume data (from preview/editor), prefer that for export
    const currentData =
      req.method === "POST" && req.body && req.body.data
        ? req.body.data
        : undefined;
    const dataForExport = currentData || latestVersion.data;

    // Generate TXT content
    const txt = await txtService.generateTxt(dataForExport as any);
    const txtBuffer = Buffer.from(txt, "utf-8");

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

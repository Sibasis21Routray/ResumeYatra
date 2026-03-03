import { Request, Response } from "express";
import { emailService } from "../services/email.service";
import { generatePdfBuffer } from "../services/pdf.service";
import { generateDocxBuffer } from "../services/docx.service";
import { generateTxt } from "../services/txt.service";
import * as templateService from "../services/template.service";
import Resume from "../models/Resume";
import User from "../models/User";
import ResumeVersion from "../models/ResumeVersion";
import mongoose from "mongoose";

export const sendResumeEmail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { to, subject, body, format = "pdf" } = req.body;
    const userId = req.userId;

    if (!to || !subject || !body) {
      return res
        .status(400)
        .json({ error: "Recipient email, subject, and body are required" });
    }

    if (!id || id === "undefined" || !userId)
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume exists
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Check ownership or admin access
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get latest version
    const latestVersion = await ResumeVersion.findOne({ resumeId: id }).sort({
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

    let resumeBuffer: Buffer;
    let filename: string;

    if (format === "pdf") {
      const html = await templateService.renderResumeHtml(
        id as string,
        template,
        theme,
        currentData
      );
      resumeBuffer = await generatePdfBuffer(html);
      filename = `${resume.title || "resume"}.pdf`;
    } else if (format === "docx") {
      resumeBuffer = await generateDocxBuffer(dataForExport, theme);
      filename = `${resume.title || "resume"}.docx`;
    } else if (format === "txt") {
      const txt = await generateTxt(dataForExport);
      resumeBuffer = Buffer.from(txt, "utf-8");
      filename = `${resume.title || "resume"}.txt`;
    } else {
      return res
        .status(400)
        .json({ error: "Invalid format. Supported formats: pdf, docx, txt" });
    }

    if (!resumeBuffer) {
      return res.status(500).json({ error: "Failed to generate resume file" });
    }

    // Send the email with resume attachment
    await emailService.sendResumeEmail(
      to,
      subject,
      body,
      resumeBuffer,
      filename
    );

    res.json({ message: "Resume sent successfully" });
  } catch (error: any) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: error.message || "Failed to send email" });
  }
};

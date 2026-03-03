import { Request, Response } from "express";
import * as templateService from "../services/template.service";
import Resume from "../models/Resume";
import User from "../models/User";
import mongoose from "mongoose";

export async function renderResume(req: Request, res: Response) {
  try {
    const resumeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const templateId = (req.query.template as string | undefined) || "modern";
    const theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : undefined;
    const userId = req.userId;

    if (!resumeId || resumeId === "undefined" || !userId)
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Check ownership or admin access
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const html = await templateService.renderResumeHtml(
      resumeId,
      templateId,
      theme
    );
    res.json({ html });
  } catch (err: any) {
    console.error("render error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function renderResumeHtml(req: Request, res: Response) {
  let resumeId: string = '';
  let templateId: string = '';
  let theme: any;
  let currentData: any;
  try {
    resumeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    templateId =
      (req.query.template as string | undefined) ||
      req.body.template ||
      "modern";
    theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : req.body.theme || undefined;
    currentData = req.body.data;
    const userId = req.userId;

    if (!resumeId || resumeId === "undefined" || !userId)
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Check ownership or admin access
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const html = await templateService.renderResumeHtml(
      resumeId,
      templateId,
      theme,
      currentData
    );
    res.send(html);
  } catch (err: any) {
    console.error("html render error:", err);
    console.error("Error stack:", err.stack);
    console.error("Error details:", {
      resumeId,
      templateId,
      hasTheme: !!theme,
      hasCurrentData: !!currentData,
      currentDataKeys: currentData ? Object.keys(currentData) : null,
    });
    res.status(500).json({ error: err.message || "internal error" });
  }
}

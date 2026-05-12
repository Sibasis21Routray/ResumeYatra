import { Request, Response } from "express";
import * as templateService from "../services/template.service";
import Resume from "../models/Resume";
import User from "../models/User";
import mongoose from "mongoose";

/** Resolve the owner query from req — works for logged-in users and guests. */
function buildOwnerQuery(req: Request): Record<string, any> | null {
  const userId = req.userId;
  const guestId = req.headers["x-guest-id"] as string | undefined;
  
  if (userId && guestId && guestId.trim()) {
    return { $or: [{ ownerId: userId }, { guestId: guestId.trim() }] };
  }
  if (userId) return { ownerId: userId };
  if (guestId && guestId.trim()) return { guestId: guestId.trim() };
  return null;
}

export async function renderResume(req: Request, res: Response) {
  try {
    const resumeId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const templateId = (req.query.template as string | undefined) || "modern";
    const theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : undefined;

    if (!resumeId || resumeId === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    const ownerQuery = buildOwnerQuery(req);
    if (!ownerQuery)
      return res.status(400).json({ error: "Missing user identity (login or x-guest-id header required)" });

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, ...ownerQuery });
    if (!resume) {
      // Allow admin bypass
      const userId = req.userId;
      if (userId) {
        const user = await User.findById(userId);
        if (user?.role === "admin") {
          const adminResume = await Resume.findById(resumeId);
          if (!adminResume) return res.status(404).json({ error: "Resume not found" });
          const html = await templateService.renderResumeHtml(resumeId, templateId, theme);
          return res.json({ html });
        }
      }
      return res.status(404).json({ error: "Resume not found" });
    }

    // Auto-link ownerId if the user is authenticated but the resume only has a guestId
    const userId = req.userId;
    if (userId && !resume.ownerId) {
      resume.ownerId = new mongoose.Types.ObjectId(userId) as any;
      resume.guestId = null; // Clear guestId on claim
      await resume.save();
      await User.findByIdAndUpdate(userId, { $addToSet: { resumes: resumeId } });
    }

    const html = await templateService.renderResumeHtml(resumeId, templateId, theme);
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

    if (!resumeId || resumeId === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(resumeId))
      return res.status(400).json({ error: "Invalid resume ID" });

    const ownerQuery = buildOwnerQuery(req);
    if (!ownerQuery)
      return res.status(400).json({ error: "Missing user identity (login or x-guest-id header required)" });

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, ...ownerQuery });
    if (!resume) {
      // Allow admin bypass
      const userId = req.userId;
      if (userId) {
        const user = await User.findById(userId);
        if (user?.role === "admin") {
          const adminResume = await Resume.findById(resumeId);
          if (!adminResume) return res.status(404).json({ error: "Resume not found" });
          const html = await templateService.renderResumeHtml(resumeId, templateId, theme, currentData);
          return res.send(html);
        }
      }
      return res.status(404).json({ error: "Resume not found" });
    }

    // Auto-link ownerId if the user is authenticated but the resume only has a guestId
    const userId = req.userId;
    if (userId && !resume.ownerId) {
      resume.ownerId = new mongoose.Types.ObjectId(userId) as any;
      resume.guestId = null; // Clear guestId on claim
      await resume.save();
      await User.findByIdAndUpdate(userId, { $addToSet: { resumes: resumeId } });
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

import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import FileType from "file-type";
import mongoose from "mongoose";
import parseResume from "../services/resume-parser.dispatcher";
import Resume from "../models/Resume";
import ResumeVersion from "../models/ResumeVersion";

/**
 * Write uploaded buffer to a temporary file
 */
function writeTempFile(buffer: Buffer, ext: string): string {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Invalid buffer type");
  }
  if (buffer.length === 0) {
    throw new Error("Empty buffer");
  }
  const cwd = process.cwd();
  const tempDir = cwd.endsWith("backend")
    ? path.join(cwd, "temp")
    : path.join(cwd, "backend/temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempPath = path.join(tempDir, `${crypto.randomUUID()}${ext}`);
  fs.writeFileSync(tempPath, buffer);
  if (!fs.existsSync(tempPath)) {
    throw new Error("File was not created");
  }
  return tempPath;
}

/**
 * Cleanup temp files (original + converted)
 */
function cleanupTempFiles(originalPath: string) {
  try {
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    // Cleanup PDF → DOCX converted file if exists
    if (originalPath.endsWith(".pdf")) {
      const convertedDocx = originalPath.replace(/\.pdf$/, ".docx");
      if (fs.existsSync(convertedDocx)) {
        fs.unlinkSync(convertedDocx);
      }
    }
  } catch (err) {
    console.warn("Temp file cleanup failed:", err);
  }
}

/**
 * Upload & parse resume (PDF / DOCX) and create a new resume
 */
export const uploadResume = async (req: Request, res: Response) => {
  let tempFilePath: string | null = null;

  try {
    // 1️⃣ Validate upload
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    const buffer = req.file.buffer;

    // 2️⃣ Detect real file type
    const detectedType = await FileType.fromBuffer(buffer);

    // Always prioritize file extension over detected type for DOCX/PDF
    const originalExt = path.extname(req.file.originalname).toLowerCase();
    let ext: string;

    if (originalExt === ".docx" || originalExt === ".doc") {
      ext = "docx";
    } else if (originalExt === ".pdf") {
      ext = "pdf";
    } else if (detectedType) {
      ext = detectedType.ext;
    } else {
      return res.status(400).json({
        success: false,
        message: "Unable to detect file type. Please upload PDF or DOCX files only.",
      });
    }

    console.log(
      `Processing file: ${req.file.originalname} (ext: ${ext})`
    );

    // 3️⃣ Write buffer to temp file
    tempFilePath = writeTempFile(buffer, `.${ext}`);
    console.log(`Temp file created: ${tempFilePath}`);

    // 4️⃣ Get owner ID or guest ID
    const ownerId = req.userId || null;
    const guestId = Array.isArray(req.headers["x-guest-id"]) 
      ? req.headers["x-guest-id"][0] 
      : req.headers["x-guest-id"] as string || null;

    // 5️⃣ Parse resume (dispatcher handles PDF/DOCX logic)
    console.log("Starting resume parsing...");
    const parsedResume = await parseResume(ownerId, tempFilePath, guestId);
    console.log("Resume parsing completed successfully");

    if (!ownerId && !guestId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user or guest ID" });
    }

    // 6️⃣ Create a new resume document with the parsed data
    const newResume = new Resume({
      title: `Uploaded Resume - ${req.file.originalname}`,
      template: "ats-classic", // Default template
      versions: [],
      files: [],
      isParsed: parsedResume && Object.keys(parsedResume).length > 0
    });

    if (ownerId) {
      newResume.ownerId = new mongoose.Types.ObjectId(ownerId);
    } else if (guestId) {
      newResume.guestId = guestId;
    }

    await newResume.save();

    // 7️⃣ Create initial version with parsed data
    const initialVersion = new ResumeVersion({
      resumeId: newResume._id,
      data: parsedResume || {}, // Ensure we have at least an empty object
      version: 1,
      changes: "Initial upload from file",
      createdBy: ownerId ? new mongoose.Types.ObjectId(ownerId) : undefined,
    });

    await initialVersion.save();

    // 8️⃣ Update resume with version reference
    newResume.versions.push(initialVersion._id);
    await newResume.save();

    // 9️⃣ Cleanup temp files
    cleanupTempFiles(tempFilePath);
    console.log(`Resume created successfully with ID: ${newResume._id}`);

    // 🔟 Return the created resume data
    return res.status(200).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      resume: {
        id: newResume._id,
        title: newResume.title,
        template: newResume.template,
        createdAt: newResume.createdAt,
        updatedAt: newResume.updatedAt,
      },
      data: parsedResume,
    });

  } catch (error: any) {
    console.error("Resume upload failed:", error);
    console.error("Error stack:", error.stack);

    if (tempFilePath) {
      cleanupTempFiles(tempFilePath);
    }

    if (error.message === "exceed token limit") {
      return res.status(400).json({
        success: false,
        message: "exceed token limit"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.message || "Unknown error occurred",
    });
  }
};

/**
 * Upload profile image (stub for now)
 */
export const uploadImage = async (_req: Request, res: Response) => {
  return res.status(501).json({
    success: false,
    message: "Image upload not implemented yet",
  });
};
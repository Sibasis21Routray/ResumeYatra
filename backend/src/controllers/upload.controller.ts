import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import FileType from "file-type";
import  parseResume  from "../services/resume-parser.dispatcher";

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
 * Upload & parse resume (PDF / DOCX)
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
    let mime: string;
    let ext: string;

    if (originalExt === ".docx") {
      mime =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      ext = "docx";
    } else if (originalExt === ".pdf") {
      mime = "application/pdf";
      ext = "pdf";
    } else if (detectedType) {
      mime = detectedType.mime;
      ext = detectedType.ext;
    } else {
      // Try to determine from original extension
      if (originalExt === ".doc") {
        mime = "application/msword";
        ext = "doc";
      } else {
        return res.status(400).json({
          success: false,
          message: "Unable to detect file type",
        });
      }
    }

    console.log(
      `Processing file: ${req.file.originalname} (MIME: ${mime}, ext: ${ext})`
    );

    // 4️⃣ Write buffer to temp file
    tempFilePath = writeTempFile(buffer, `.${ext}`);
    console.log(`Temp file created: ${tempFilePath}`);

    // 5️⃣ Parse resume (dispatcher handles PDF/DOCX logic)
    console.log("Starting resume parsing...");
    const parsedResume = await parseResume(tempFilePath);

    // 6️⃣ Cleanup temp files
    cleanupTempFiles(tempFilePath);
    console.log("Resume parsing completed successfully");

    // 7️⃣ Success response
    return res.status(200).json({
      success: true,
      structured: parsedResume,
    });
  } catch (error: any) {
    console.error("Resume upload failed:", error);
    console.error("Error stack:", error.stack);

    if (tempFilePath) {
      cleanupTempFiles(tempFilePath);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to parse resume",
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

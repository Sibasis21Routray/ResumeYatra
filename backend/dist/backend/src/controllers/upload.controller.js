"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.uploadResume = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const file_type_1 = __importDefault(require("file-type"));
const resume_parser_dispatcher_1 = __importDefault(require("../services/resume-parser.dispatcher"));
/**
 * Write uploaded buffer to a temporary file
 */
function writeTempFile(buffer, ext) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("Invalid buffer type");
    }
    if (buffer.length === 0) {
        throw new Error("Empty buffer");
    }
    const cwd = process.cwd();
    const tempDir = cwd.endsWith("backend")
        ? path_1.default.join(cwd, "temp")
        : path_1.default.join(cwd, "backend/temp");
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const tempPath = path_1.default.join(tempDir, `${crypto_1.default.randomUUID()}${ext}`);
    fs_1.default.writeFileSync(tempPath, buffer);
    if (!fs_1.default.existsSync(tempPath)) {
        throw new Error("File was not created");
    }
    return tempPath;
}
/**
 * Cleanup temp files (original + converted)
 */
function cleanupTempFiles(originalPath) {
    try {
        if (fs_1.default.existsSync(originalPath)) {
            fs_1.default.unlinkSync(originalPath);
        }
        // Cleanup PDF → DOCX converted file if exists
        if (originalPath.endsWith(".pdf")) {
            const convertedDocx = originalPath.replace(/\.pdf$/, ".docx");
            if (fs_1.default.existsSync(convertedDocx)) {
                fs_1.default.unlinkSync(convertedDocx);
            }
        }
    }
    catch (err) {
        console.warn("Temp file cleanup failed:", err);
    }
}
/**
 * Upload & parse resume (PDF / DOCX)
 */
const uploadResume = async (req, res) => {
    let tempFilePath = null;
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
        const detectedType = await file_type_1.default.fromBuffer(buffer);
        // Always prioritize file extension over detected type for DOCX/PDF
        const originalExt = path_1.default.extname(req.file.originalname).toLowerCase();
        let mime;
        let ext;
        if (originalExt === ".docx") {
            mime =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            ext = "docx";
        }
        else if (originalExt === ".pdf") {
            mime = "application/pdf";
            ext = "pdf";
        }
        else if (detectedType) {
            mime = detectedType.mime;
            ext = detectedType.ext;
        }
        else {
            // Try to determine from original extension
            if (originalExt === ".doc") {
                mime = "application/msword";
                ext = "doc";
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Unable to detect file type",
                });
            }
        }
        console.log(`Processing file: ${req.file.originalname} (MIME: ${mime}, ext: ${ext})`);
        // 4️⃣ Write buffer to temp file
        tempFilePath = writeTempFile(buffer, `.${ext}`);
        console.log(`Temp file created: ${tempFilePath}`);
        // 5️⃣ Parse resume (dispatcher handles PDF/DOCX logic)
        console.log("Starting resume parsing...");
        const parsedResume = await (0, resume_parser_dispatcher_1.default)(tempFilePath);
        // 6️⃣ Cleanup temp files
        cleanupTempFiles(tempFilePath);
        console.log("Resume parsing completed successfully");
        // 7️⃣ Success response
        return res.status(200).json({
            success: true,
            structured: parsedResume,
        });
    }
    catch (error) {
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
exports.uploadResume = uploadResume;
/**
 * Upload profile image (stub for now)
 */
const uploadImage = async (_req, res) => {
    return res.status(501).json({
        success: false,
        message: "Image upload not implemented yet",
    });
};
exports.uploadImage = uploadImage;

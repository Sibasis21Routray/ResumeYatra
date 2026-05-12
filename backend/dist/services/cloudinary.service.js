"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBuffer = uploadBuffer;
exports.uploadHTML = uploadHTML;
exports.uploadPDF = uploadPDF;
exports.uploadPreview = uploadPreview;
exports.deleteFile = deleteFile;
exports.getFileUrl = getFileUrl;
const cloudinary_1 = require("cloudinary");
const api_1 = __importDefault(require("../config/api"));
const stream_1 = __importDefault(require("stream"));
// Initialize Cloudinary
cloudinary_1.v2.config({
    cloudinary_url: api_1.default.cloudinaryUrl
});
/**
 * Detect resource type based on filename
 */
function detectResourceType(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext)
        return 'raw';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
        return 'image';
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext))
        return 'video';
    return 'raw';
}
/**
 * Upload buffer to Cloudinary (FORCED SAFE)
 */
async function uploadBuffer(buffer, filename, folder = 'resumes', resourceType) {
    return new Promise((resolve, reject) => {
        const passthrough = new stream_1.default.PassThrough();
        passthrough.end(buffer);
        // 🔥 HARD FORCE: PDFs ALWAYS RAW (no override possible)
        const finalResourceType = filename.toLowerCase().endsWith('.pdf')
            ? 'raw'
            : (resourceType || detectResourceType(filename));
        console.log("🔥 FINAL TYPE SENT:", finalResourceType);
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: finalResourceType,
            type: 'upload',
            folder,
            use_filename: true,
            unique_filename: true,
            overwrite: true
        }, (error, result) => {
            if (error || !result)
                return reject(error);
            console.log("🔥 CLOUDINARY RESPONSE TYPE:", result.resource_type);
            resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                bytes: result.bytes,
                format: result.format,
                resource_type: result.resource_type
            });
        });
        passthrough.pipe(uploadStream);
    });
}
/**
 * Upload HTML
 */
async function uploadHTML(html, resumeId, format = 'html') {
    const filename = `${resumeId}-${Date.now()}.${format}`;
    const buffer = Buffer.from(html, 'utf-8');
    return uploadBuffer(buffer, filename, 'resumes/html');
}
/**
 * Upload PDF (invoice)
 */
async function uploadPDF(pdfBuffer, resumeId) {
    const filename = `${resumeId}-${Date.now()}.pdf`;
    return uploadBuffer(pdfBuffer, filename, 'invoices');
}
/**
 * Upload preview image
 */
async function uploadPreview(previewBuffer, templateId) {
    const filename = `${templateId}-preview-${Date.now()}.png`;
    return uploadBuffer(previewBuffer, filename, 'templates/previews');
}
/**
 * Delete file
 */
async function deleteFile(publicId, resourceType) {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType }, (error) => {
            if (error)
                return reject(error);
            resolve();
        });
    });
}
/**
 * Generate correct URL
 */
function getFileUrl(publicId, resourceType) {
    return cloudinary_1.v2.url(publicId, {
        secure: true,
        resource_type: resourceType
    });
}

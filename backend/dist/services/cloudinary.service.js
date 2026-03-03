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
exports.getOptimizedUrl = getOptimizedUrl;
const cloudinary_1 = require("cloudinary");
const api_1 = __importDefault(require("../config/api"));
const stream_1 = __importDefault(require("stream"));
// Initialize cloudinary
cloudinary_1.v2.config({
    cloudinary_url: api_1.default.cloudinaryUrl
});
async function uploadBuffer(buffer, filename, folder = 'resumes', resourceType = 'auto') {
    return new Promise((resolve, reject) => {
        const passthrough = new stream_1.default.PassThrough();
        passthrough.end(buffer);
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: resourceType,
            folder,
            public_id: filename.split('.')[0], // Remove extension for public_id
            overwrite: true
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        passthrough.pipe(uploadStream);
    });
}
async function uploadHTML(html, resumeId, format = 'html') {
    const filename = `${resumeId}-${Date.now()}.${format}`;
    const buffer = Buffer.from(html, 'utf-8');
    return uploadBuffer(buffer, filename, 'resumes/html', 'raw');
}
async function uploadPDF(pdfBuffer, resumeId) {
    const filename = `${resumeId}-${Date.now()}.pdf`;
    return uploadBuffer(pdfBuffer, filename, 'resumes/pdf', 'raw');
}
async function uploadPreview(previewBuffer, templateId) {
    const filename = `${templateId}-preview-${Date.now()}.png`;
    return uploadBuffer(previewBuffer, filename, 'templates/previews', 'image');
}
async function deleteFile(publicId) {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
            if (error)
                return reject(error);
            resolve();
        });
    });
}
function getOptimizedUrl(publicId, options = {}) {
    return cloudinary_1.v2.url(publicId, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
        ...options
    });
}

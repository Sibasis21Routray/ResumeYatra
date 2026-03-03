"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const stream_1 = __importDefault(require("stream"));
const cloudinary_1 = require("cloudinary");
const api_1 = __importDefault(require("../config/api"));
// Initialize cloudinary from CLOUDINARY_URL if provided
if (api_1.default.cloudinaryUrl) {
    cloudinary_1.v2.config({ cloudinary_url: api_1.default.cloudinaryUrl });
}
function uploadBufferToCloudinary(buffer, filename, folder = 'resumes') {
    return new Promise((resolve, reject) => {
        const passthrough = new stream_1.default.PassThrough();
        passthrough.end(buffer);
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto', folder }, (error, result) => {
            if (error)
                return reject(error);
            resolve({ public_id: result.public_id, url: result.url, secure_url: result.secure_url, bytes: result.bytes, format: result.format });
        });
        passthrough.pipe(uploadStream);
    });
}

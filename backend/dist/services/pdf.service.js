"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfBuffer = generatePdfBuffer;
exports.generatePdf = generatePdf;
const browser_pool_1 = require("./browser.pool");
const cloudinary_1 = require("cloudinary");
const api_1 = __importDefault(require("../config/api"));
const stream_1 = __importDefault(require("stream"));
async function generatePdfBuffer(html) {
    const pdf = await (0, browser_pool_1.renderWithCluster)(html);
    return Buffer.from(pdf);
}
async function generatePdf(html) {
    if (!api_1.default.cloudinaryUrl) {
        throw new Error("Cloudinary not configured");
    }
    const buffer = await generatePdfBuffer(html);
    const uploadResult = await new Promise((resolve, reject) => {
        const upload = cloudinary_1.v2.uploader.upload_stream({ resource_type: "raw", folder: "resumes/pdfs" }, (err, result) => (err ? reject(err) : resolve(result)));
        const pass = new stream_1.default.PassThrough();
        pass.end(buffer);
        pass.pipe(upload);
    });
    return {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
    };
}

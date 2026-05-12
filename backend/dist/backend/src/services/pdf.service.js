"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfBuffer = generatePdfBuffer;
exports.generatePdf = generatePdf;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const cloudinary_1 = require("cloudinary");
const api_1 = __importDefault(require("../config/api"));
const stream_1 = __importDefault(require("stream"));
async function generatePdfBuffer(html) {
    const browser = await puppeteer_core_1.default.launch({
        args: chromium_1.default.args,
        executablePath: await chromium_1.default.executablePath(),
        headless: true,
    });
    try {
        const page = await browser.newPage();
        // 🚀 Speed optimization
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const type = req.resourceType();
            if (type === "font" || type === "media") {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 60000,
        });
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                bottom: "10mm",
                left: "10mm",
                right: "10mm",
            },
        });
        return Buffer.from(pdf);
    }
    finally {
        await browser.close();
    }
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

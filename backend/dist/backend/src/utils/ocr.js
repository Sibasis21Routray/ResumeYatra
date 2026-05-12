"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOcr = runOcr;
const tesseract_js_1 = require("tesseract.js");
const pdf_img_convert_1 = __importDefault(require("pdf-img-convert"));
async function runOcr(pdfPath) {
    try {
        const worker = await (0, tesseract_js_1.createWorker)("eng");
        // PDF ko images mein convert karna zaroori hai
        const outputImages = await pdf_img_convert_1.default.convert(pdfPath);
        let fullText = "";
        for (const imageBuffer of outputImages) {
            const { data: { text }, } = await worker.recognize(Buffer.from(imageBuffer));
            fullText += text + "\n";
        }
        await worker.terminate();
        return fullText;
    }
    catch (error) {
        console.error("OCR internal failure:", error);
        throw new Error("OCR system could not process this PDF.");
    }
}

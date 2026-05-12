"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPdfText = extractPdfText;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
/**
 * Extracts raw text from a PDF.
 * Used ONLY to detect whether the PDF is text-based or scanned.
 */
async function extractPdfText(pdfPath) {
    if (!fs_1.default.existsSync(pdfPath)) {
        console.error(`PDF file not found: ${pdfPath}`);
        throw new Error(`PDF file not found: ${pdfPath}`);
    }
    try {
        const buffer = fs_1.default.readFileSync(pdfPath);
        if (buffer.length === 0) {
            console.error('PDF file is empty');
            throw new Error('PDF file is empty');
        }
        console.log(`Parsing PDF file: ${pdfPath} (${buffer.length} bytes)`);
        const data = await (0, pdf_parse_1.default)(buffer);
        if (!data || !data.text) {
            console.warn('PDF parse returned no text data');
            return '';
        }
        console.log(`Extracted ${data.text.length} characters from PDF`);
        // Normalize whitespace but preserve newlines
        const text = data.text
            .replace(/[^\S\n]+/g, ' ')
            .trim();
        console.log(`After normalization: ${text.length} characters`);
        return text;
    }
    catch (error) {
        console.error('PDF text extraction failed:', error);
        throw error; // Re-throw to allow dispatcher to handle
    }
}

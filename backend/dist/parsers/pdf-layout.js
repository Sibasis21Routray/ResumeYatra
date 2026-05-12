"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPdfLayout = extractPdfLayout;
const pdf2json_1 = __importDefault(require("pdf2json"));
function safeDecodeURIComponent(str) {
    try {
        return decodeURIComponent(str);
    }
    catch {
        return str;
    }
}
async function extractPdfLayout(pdfPath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new pdf2json_1.default();
        pdfParser.on("pdfParser_dataError", (err) => reject(err));
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            const items = [];
            pdfData.Pages.forEach((page, pageIndex) => {
                page.Texts.forEach((textObj) => {
                    textObj.R.forEach((r) => {
                        const text = safeDecodeURIComponent(r.T);
                        items.push({
                            text,
                            x: textObj.x,
                            y: textObj.y,
                            width: textObj.w,
                            page: pageIndex + 1,
                        });
                    });
                });
            });
            resolve(items);
        });
        pdfParser.loadPDF(pdfPath);
    });
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const templateService = __importStar(require("../services/template.service"));
const pdf_service_1 = require("../services/pdf.service");
const https = __importStar(require("https"));
async function run() {
    try {
        console.log('Rendering sample HTML for "professional" template');
        const url = await templateService.renderTemplateSample('professional');
        console.log('HTML URL:', url);
        // Fetch HTML from Cloudinary
        const html = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
        console.log('HTML length:', html.length);
        console.log('Generating PDF buffer...');
        const pdfBuffer = await (0, pdf_service_1.generatePdfBuffer)(html);
        console.log('PDF buffer length:', pdfBuffer.length);
        console.log('PDF signature (ascii):', pdfBuffer.subarray(0, 4).toString('ascii'));
        console.log('PDF first 20 bytes (hex):', pdfBuffer.subarray(0, 20).toString('hex'));
        const cwd = process.cwd();
        const outPath = path.join(cwd.endsWith('backend') ? cwd : path.join(cwd, 'backend'), 'temp', 'resumeyatra_test.pdf');
        fs.writeFileSync(outPath, pdfBuffer);
        console.log('Wrote PDF to', outPath);
    }
    catch (err) {
        console.error('Test PDF generation failed:', err);
        process.exitCode = 1;
    }
}
run();

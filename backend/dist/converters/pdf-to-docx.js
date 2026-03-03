"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPdfToDocx = convertPdfToDocx;
const child_process_1 = require("child_process");
const child_process_2 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Find soffice (LibreOffice) executable path
 */
function getSofficePath() {
    const commonPaths = [
        '/usr/bin/soffice',
        '/usr/bin/libreoffice',
        '/opt/libreoffice/program/soffice',
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'
    ];
    // Check if soffice is in PATH
    try {
        const result = (0, child_process_2.execSync)('which soffice', { encoding: 'utf-8' }).trim();
        if (result)
            return result;
    }
    catch (e) {
        // Not in PATH, continue checking common paths
    }
    // Check common installation paths
    for (const p of commonPaths) {
        if (fs_1.default.existsSync(p)) {
            console.log(`Found soffice at: ${p}`);
            return p;
        }
    }
    // Default to common path - will fail with clear error if not found
    return '/usr/bin/soffice';
}
function convertPdfToDocx(pdfPath) {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(pdfPath)) {
            return reject(new Error(`PDF file not found: ${pdfPath}`));
        }
        const outputDir = path_1.default.dirname(pdfPath);
        const fileName = path_1.default.basename(pdfPath, path_1.default.extname(pdfPath));
        const expectedDocxPath = path_1.default.join(outputDir, `${fileName}.docx`);
        // Remove existing file if present to ensure fresh conversion
        if (fs_1.default.existsSync(expectedDocxPath)) {
            try {
                fs_1.default.unlinkSync(expectedDocxPath);
                console.log('Removed existing DOCX file for fresh conversion');
            }
            catch (err) {
                console.warn('Failed to remove existing DOCX:', err);
            }
        }
        const SOFFICE_PATH = getSofficePath();
        // Verify soffice exists
        if (!fs_1.default.existsSync(SOFFICE_PATH)) {
            return reject(new Error(`LibreOffice not found at ${SOFFICE_PATH}. Please install LibreOffice or ensure it's in PATH.`));
        }
        // 🧠 Force Writer and DOCX Filter
        const command = `"${SOFFICE_PATH}" --headless --invisible --writer --convert-to docx:"MS Word 2007 XML" --outdir "${outputDir}" "${pdfPath}"`;
        console.log('Executing LibreOffice conversion command...');
        console.log(`Command: ${command}`);
        (0, child_process_1.exec)(command, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
            if (err) {
                console.error('LibreOffice conversion failed');
                console.error('Error:', err.message);
                console.error('stderr:', stderr);
                console.error('stdout:', stdout);
                return reject(new Error(`LibreOffice conversion failed: ${stderr || err.message}`));
            }
            if (stderr && stderr.includes('Error')) {
                console.error('LibreOffice error output:', stderr);
                return reject(new Error(`LibreOffice reported error: ${stderr}`));
            }
            // Wait a bit for file to be written
            setTimeout(() => {
                if (fs_1.default.existsSync(expectedDocxPath)) {
                    const stats = fs_1.default.statSync(expectedDocxPath);
                    console.log(`Successfully converted PDF to DOCX: ${expectedDocxPath} (${stats.size} bytes)`);
                    resolve(expectedDocxPath);
                }
                else {
                    console.error(`Expected DOCX file not found: ${expectedDocxPath}`);
                    console.error('Output directory contents:', fs_1.default.readdirSync(outputDir));
                    reject(new Error(`Converted DOCX file not found at ${expectedDocxPath}`));
                }
            }, 500);
        });
    });
}

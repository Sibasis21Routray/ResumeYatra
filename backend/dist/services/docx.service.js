"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPdfBufferToDocx = convertPdfBufferToDocx;
exports.generateDocxBuffer = generateDocxBuffer;
exports.generateDocxFromPdfBuffer = generateDocxFromPdfBuffer;
const docx_1 = require("docx");
const stream_1 = require("stream");
// 🔥 Adobe SDK
const pdfservices_node_sdk_1 = require("@adobe/pdfservices-node-sdk");
// ==================== ENV ====================
const ADOBE_CLIENT_ID = process.env.ADOBE_CLIENT_ID;
const ADOBE_CLIENT_SECRET = process.env.ADOBE_CLIENT_SECRET;
if (!ADOBE_CLIENT_ID || !ADOBE_CLIENT_SECRET) {
    console.warn("⚠️ Adobe credentials missing. DOCX fallback will be used.");
}
// ==================== HELPERS ====================
function stripHtml(html) {
    if (!html || typeof html !== "string")
        return "";
    return html.replace(/<[^>]*>/g, "").trim();
}
// ==================== ADOBE CONVERSION ====================
async function convertPdfBufferToDocx(pdfBuffer) {
    try {
        if (!ADOBE_CLIENT_ID || !ADOBE_CLIENT_SECRET) {
            throw new Error("Adobe credentials not configured");
        }
        console.log("🔄 Adobe PDF → DOCX started...");
        const credentials = new pdfservices_node_sdk_1.ServicePrincipalCredentials({
            clientId: ADOBE_CLIENT_ID,
            clientSecret: ADOBE_CLIENT_SECRET,
        });
        const pdfServices = new pdfservices_node_sdk_1.PDFServices({ credentials });
        // ✅ Upload PDF
        const inputAsset = await pdfServices.upload({
            readStream: stream_1.Readable.from(pdfBuffer),
            mimeType: "application/pdf",
        });
        // ✅ Set conversion params
        const params = new pdfservices_node_sdk_1.ExportPDFParams({
            targetFormat: pdfservices_node_sdk_1.ExportPDFTargetFormat.DOCX,
        });
        const job = new pdfservices_node_sdk_1.ExportPDFJob({ inputAsset, params });
        // ✅ Submit job
        const pollingURL = await pdfServices.submit({ job });
        // ✅ FIXED HERE (VERY IMPORTANT)
        const result = await pdfServices.getJobResult({
            pollingURL,
            resultType: pdfservices_node_sdk_1.ExportPDFResult,
        });
        const resultAsset = result.result.asset;
        // ✅ Download DOCX
        const streamAsset = await pdfServices.getContent({
            asset: resultAsset,
        });
        const chunks = [];
        for await (const chunk of streamAsset.readStream) {
            const bufferChunk = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
            chunks.push(bufferChunk);
        }
        const docxBuffer = Buffer.concat(chunks);
        console.log("✅ Adobe conversion success:", docxBuffer.length);
        return docxBuffer;
    }
    catch (error) {
        console.error("❌ Adobe conversion failed:", error);
        throw error;
    }
}
// ==================== FALLBACK DOCX ====================
async function createDocxContent(data) {
    const children = [];
    if (data?.personal?.name) {
        children.push(new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: stripHtml(data.personal.name),
                    bold: true,
                    size: 32,
                }),
            ],
            alignment: docx_1.AlignmentType.CENTER,
            spacing: { after: 200 },
        }));
    }
    if (data?.summary) {
        children.push(new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: "Summary",
                    bold: true,
                    size: 24,
                }),
            ],
            heading: docx_1.HeadingLevel.HEADING_2,
        }), new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: stripHtml(data.summary),
                }),
            ],
        }));
    }
    return children;
}
async function generateDocxBuffer(data) {
    const doc = new docx_1.Document({
        sections: [
            {
                children: await createDocxContent(data),
            },
        ],
    });
    const buffer = await docx_1.Packer.toBuffer(doc);
    if (!buffer || buffer.length === 0) {
        throw new Error("DOCX buffer empty");
    }
    return buffer;
}
// ==================== MAIN HYBRID FUNCTION ====================
async function generateDocxFromPdfBuffer(pdfBuffer, fallbackData) {
    try {
        // 🔥 Primary: Adobe
        return await convertPdfBufferToDocx(pdfBuffer);
    }
    catch (error) {
        console.warn("⚠️ Using fallback DOCX generator...");
        if (!fallbackData) {
            throw new Error("No fallback data available");
        }
        // 🔁 Fallback
        return await generateDocxBuffer(fallbackData);
    }
}

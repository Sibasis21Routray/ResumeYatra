

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { Readable } from "stream";

// 🔥 Adobe SDK
import {
  PDFServices,
  ServicePrincipalCredentials,
  ExportPDFJob,
  ExportPDFTargetFormat,
  ExportPDFParams,
  ExportPDFResult, // ✅ IMPORTANT
} from "@adobe/pdfservices-node-sdk";

// ==================== ENV ====================

const ADOBE_CLIENT_ID = process.env.ADOBE_CLIENT_ID ;
const ADOBE_CLIENT_SECRET = process.env.ADOBE_CLIENT_SECRET ;

if (!ADOBE_CLIENT_ID || !ADOBE_CLIENT_SECRET) {
  console.warn("⚠️ Adobe credentials missing. DOCX fallback will be used.");
}

// ==================== HELPERS ====================

function stripHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

// ==================== ADOBE CONVERSION ====================

export async function convertPdfBufferToDocx(
  pdfBuffer: Buffer
): Promise<Buffer> {
  try {
    if (!ADOBE_CLIENT_ID || !ADOBE_CLIENT_SECRET) {
      throw new Error("Adobe credentials not configured");
    }

    console.log("🔄 Adobe PDF → DOCX started...");

    const credentials = new ServicePrincipalCredentials({
      clientId: ADOBE_CLIENT_ID,
      clientSecret: ADOBE_CLIENT_SECRET,
    });

    const pdfServices = new PDFServices({ credentials });

    // ✅ Upload PDF
    const inputAsset = await pdfServices.upload({
      readStream: Readable.from(pdfBuffer),
      mimeType: "application/pdf",
    });

    // ✅ Set conversion params
    const params = new ExportPDFParams({
      targetFormat: ExportPDFTargetFormat.DOCX,
    });

    const job = new ExportPDFJob({ inputAsset, params });

    // ✅ Submit job
    const pollingURL = await pdfServices.submit({ job });

    // ✅ FIXED HERE (VERY IMPORTANT)
    const result = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExportPDFResult,
    });

    const resultAsset = result.result.asset;

    // ✅ Download DOCX
    const streamAsset = await pdfServices.getContent({
      asset: resultAsset,
    });

    const chunks: Buffer[] = [];

for await (const chunk of streamAsset.readStream) {
  const bufferChunk =
    typeof chunk === "string" ? Buffer.from(chunk) : chunk;

  chunks.push(bufferChunk);
}

    const docxBuffer = Buffer.concat(chunks);

    console.log("✅ Adobe conversion success:", docxBuffer.length);

    return docxBuffer;
  } catch (error) {
    console.error("❌ Adobe conversion failed:", error);
    throw error;
  }
}

// ==================== FALLBACK DOCX ====================

async function createDocxContent(data: any): Promise<any[]> {
  const children: any[] = [];

  if (data?.personal?.name) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: stripHtml(data.personal.name),
            bold: true,
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  if (data?.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Summary",
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: stripHtml(data.summary),
          }),
        ],
      })
    );
  }

  return children;
}

export async function generateDocxBuffer(data: any): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: await createDocxContent(data),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  if (!buffer || buffer.length === 0) {
    throw new Error("DOCX buffer empty");
  }

  return buffer;
}

// ==================== MAIN HYBRID FUNCTION ====================

export async function generateDocxFromPdfBuffer(
  pdfBuffer: Buffer,
  fallbackData?: any
): Promise<Buffer> {
  try {
    // 🔥 Primary: Adobe
    return await convertPdfBufferToDocx(pdfBuffer);
  } catch (error) {
    console.warn("⚠️ Using fallback DOCX generator...");

    if (!fallbackData) {
      throw new Error("No fallback data available");
    }

    // 🔁 Fallback
    return await generateDocxBuffer(fallbackData);
  }
}
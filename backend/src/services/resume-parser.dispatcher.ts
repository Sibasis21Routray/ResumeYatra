// resume-parser.dispatcher.ts
import pdfimg from "pdf-img-convert";
import { execSync } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { normalizeParsedResume } from "../utils/normalizeParsedResume";

// DeepInfra configuration
const deepinfra = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.DEEPINFRA_API_KEY!,
});

// ---------- FILE TYPE DETECTION ----------
function detectFileType(filePath: string): "pdf" | "docx" | "unknown" {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return "pdf";
  if (ext === ".docx") return "docx";
  return "unknown";
}

// ---------- DOCX TO PDF CONVERSION (LibreOffice) ----------
async function convertDocxToPdf(filePath: string): Promise<string> {
  console.log("🔄 Converting DOCX to PDF using LibreOffice...");

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "docx-pdf-"));
  const outputDir = path.join(tempDir, "pdf");
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // Use LibreOffice to convert DOCX to PDF
    execSync(
      `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${filePath}"`,
      { timeout: 60000 }
    );

    const files = fs.readdirSync(outputDir);
    const pdfFile = files.find((f) => f.endsWith(".pdf"));

    if (!pdfFile) {
      throw new Error("PDF not generated from DOCX");
    }

    const pdfPath = path.join(outputDir, pdfFile);
    console.log(`✅ DOCX converted to PDF: ${pdfPath}`);
    return pdfPath;
  } catch (err: any) {
    console.error("DOCX to PDF conversion error:", err.message);
    throw new Error(`Failed to convert DOCX to PDF: ${err.message}`);
  }
}

// ---------- PDF TO IMAGE CONVERSION (Poppler) ----------
async function convertPDFToHighQualityImage(
  filePath: string
): Promise<Buffer[]> {
  console.log("🔄 Converting PDF to high-quality images using Poppler...");

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-"));
  const outputPrefix = path.join(tempDir, "page");

  try {
    // 200 DPI is sufficient for OCR and faster than 400 DPI
    execSync(
      `pdftoppm -jpeg -jpegopt quality=95 -r 200 "${filePath}" "${outputPrefix}"`
    );

    const files = fs
      .readdirSync(tempDir)
      .filter((f) => f.endsWith(".jpg"))
      .sort();

    if (!files || files.length === 0) {
      throw new Error("No images generated from PDF via Poppler");
    }

    const buffers = files.map((file, i) => {
      const buffer = fs.readFileSync(path.join(tempDir, file));

      // Optional: save first page for debugging
      if (i === 0 && process.env.NODE_ENV === "development") {
        const debugPath = `/tmp/resume_page1_${Date.now()}.jpg`;
        fs.writeFileSync(debugPath, buffer);
        console.log(`📸 Debug image saved: ${debugPath}`);
      }

      return buffer;
    });

    console.log(`✅ Converted ${buffers.length} pages to images`);
    return buffers;
  } catch (err: any) {
    console.error("PDF conversion error:", err.message);
    throw err;
  }
}

// ---------- UNIFIED DEEPINFRA EXTRACTION (Single API Call) ----------
async function extractStructuredDataFromPDFImages(
  imageBuffers: Buffer[]
): Promise<any> {
  console.log("🔍 Using DeepInfra for unified extraction (single API call)...");

  const pagesToProcess = Math.min(imageBuffers.length, 2); // first 2 pages only
  const imagesToProcess = imageBuffers.slice(0, pagesToProcess);

  const maxRetries = 2;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      // Build content array with images for all pages
      const contentArray: any[] = [
        {
          type: "text",
          text: `OCR + STRUCTURED EXTRACTION TASK: Extract ALL text from these ${imagesToProcess.length} resume page(s) and structure it into JSON.

Preserve formatting, bullets, dates (employment, education, projects), job titles, company names, educational degrees, and technical skills.

Return ONLY valid JSON with this exact structure:
{
  "personal": { ... },
  "summary": "...",
  "skills": [...],
  "experience": [
    {
      "company": "...",
      "position": "...",
      "dates": "...",           // ensure dates are extracted
      "duration": "...",
      "location": "...",
      "description": "..."
    }
  ],
  "education": [
    {
      "institution": "...",
      "degree": "...",
      "field": "...",
      "dates": "...",           // ensure attendance dates are extracted
      "location": "..."
    }
  ],
  "projects": [
    {
      "name": "...",
      "description": "...",
      "technologies": [...],
      "dates": "..."            // ensure project dates are extracted
    }
  ]
}

Rules:
1. Always extract dates exactly as they appear (e.g., Jan 2020 – Mar 2022, 2018–2020)
2. If information is not found, use null or empty array
3. Clean and normalize all text
4. Remove any personally identifiable information besides name, email
5. For skills, extract only technical/professional skills
6. Return ONLY valid JSON, no markdown formatting`,
        },
      ];

      // Add each image to the content array
      for (let i = 0; i < imagesToProcess.length; i++) {
        const base64Image = imagesToProcess[i].toString("base64");
        contentArray.push({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: "high",
          },
        });
        console.log(`📄 Added page ${i + 1} to API request`);
      }

      const response = await deepinfra.chat.completions.create({
        model: "allenai/olmOCR-2-7B-1025",
        max_tokens: 4000,
        temperature: 0.1,
        messages: [
          {
            role: "user",
            content: contentArray,
          },
        ],
      });

      const responseContent =
        response.choices?.[0]?.message?.content?.trim() || "";

      if (!responseContent || responseContent.length < 50) {
        throw new Error("Insufficient content extracted");
      }

      // Parse JSON response
      let parsedData = {};
      try {
        // Clean up response if it has markdown formatting
        const cleanJson = responseContent
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsedData = JSON.parse(cleanJson);
        console.log(
          `✅ Unified extraction successful: ${
            JSON.stringify(parsedData).length
          } chars`
        );
      } catch (err) {
        console.warn(
          "⚠️ AI response could not be parsed as JSON, returning raw text"
        );
        parsedData = { rawText: responseContent };
      }

      return parsedData;
    } catch (err: any) {
      console.log(
        `⚠️ Unified extraction failed on attempt ${attempt + 1}: ${err.message}`
      );
      attempt++;
      if (attempt > maxRetries) throw err;
      await new Promise((res) => setTimeout(res, 500 * attempt));
    }
  }

  return {};
}

const nameBlacklist = [
  "career overview",
  "personal details",
  "contact details",
  "resume",
  "cv",
  "pvt",
  "ltd",
  "inc",
  "consultants",
  "building",
  "technologies",
  "solutions",
  "corporation",
];

// ---------- MAIN FUNCTION (Handles both PDF and DOCX) ----------
async function parseResume(filePath: string) {
  console.log("🚀 Starting resume parsing pipeline...");
  console.log(`📂 File: ${filePath}`);

  // Detect file type and route accordingly
  const fileType = detectFileType(filePath);

  if (fileType === "docx") {
    console.log("📄 Detected DOCX file, converting to PDF first...");
    // Convert DOCX to PDF, then use PDF parsing flow
    const pdfPath = await convertDocxToPdf(filePath);
    return parseResumeFromPDF(pdfPath);
  }

  if (fileType === "pdf") {
    console.log("📄 Detected PDF file, using PDF parser...");
    return parseResumeFromPDF(filePath);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

// ---------- PDF PARSING FUNCTION (Optimized - Single API Call) ----------
async function parseResumeFromPDF(filePath: string) {
  console.log(
    "🚀 Starting PDF resume parsing pipeline (Vision-first, single API call)..."
  );
  console.log(`📂 File: ${filePath}`);

  try {
    // Step 1 — Convert PDF → Images
    console.log("🖼 Converting PDF → high-res images...");
    const imageBuffers = await convertPDFToHighQualityImage(filePath);

    if (!imageBuffers?.length) {
      throw new Error("No images generated from PDF");
    }

    // Step 2 — Unified DeepInfra extraction (single API call for OCR + structured data)
    console.log("🤖 Running unified DeepInfra extraction (single API call)...");
    const aiParsed = await extractStructuredDataFromPDFImages(imageBuffers);

    // Step 3 — Normalize and return
    const result = normalizeParsedResume(aiParsed);

    console.log("🎉 FINAL PARSING RESULT READY");
    return result;
  } catch (error: any) {
    console.error("❌ Resume parsing failed:", error.message);
    return normalizeParsedResume({
      error: error.message,
      rawText: "",
    });
  }
}

export default parseResume;

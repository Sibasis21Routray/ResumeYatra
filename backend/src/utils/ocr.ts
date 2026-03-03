import { createWorker } from "tesseract.js";
import pdfimg from "pdf-img-convert";

export async function runOcr(pdfPath: string): Promise<string> {
  try {
    const worker = await createWorker("eng");

    // PDF ko images mein convert karna zaroori hai
    const outputImages = await pdfimg.convert(pdfPath);

    let fullText = "";
    for (const imageBuffer of outputImages) {
      const {
        data: { text },
      } = await worker.recognize(Buffer.from(imageBuffer));
      fullText += text + "\n";
    }

    await worker.terminate();
    return fullText;
  } catch (error) {
    console.error("OCR internal failure:", error);
    throw new Error("OCR system could not process this PDF.");
  }
}

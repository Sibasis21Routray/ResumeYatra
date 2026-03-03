import fs from 'fs';
import pdfParse from 'pdf-parse';

/**
 * Extracts raw text from a PDF.
 * Used ONLY to detect whether the PDF is text-based or scanned.
 */
export async function extractPdfText(pdfPath: string): Promise<string> {
  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF file not found: ${pdfPath}`);
    throw new Error(`PDF file not found: ${pdfPath}`);
  }

  try {
    const buffer = fs.readFileSync(pdfPath);
    
    if (buffer.length === 0) {
      console.error('PDF file is empty');
      throw new Error('PDF file is empty');
    }

    console.log(`Parsing PDF file: ${pdfPath} (${buffer.length} bytes)`);
    const data = await pdfParse(buffer);

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
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    throw error; // Re-throw to allow dispatcher to handle
  }
}

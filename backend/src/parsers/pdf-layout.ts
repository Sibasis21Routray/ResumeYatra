import PDFParser from "pdf2json";

export interface PdfTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  page: number;
}

function safeDecodeURIComponent(str: string) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export async function extractPdfLayout(pdfPath: string): Promise<PdfTextItem[]> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: any) => reject(err));
    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const items: PdfTextItem[] = [];

      pdfData.Pages.forEach((page: any, pageIndex: number) => {
        page.Texts.forEach((textObj: any) => {
          textObj.R.forEach((r: any) => {
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

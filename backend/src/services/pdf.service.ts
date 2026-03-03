import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/api";
import stream from "stream";

export async function generatePdfBuffer(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true, 
  });


  try {
    const page = await browser.newPage();

    // 🚀 Speed optimization
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "font" || type === "media") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

export async function generatePdf(html: string) {
  if (!config.cloudinaryUrl) {
    throw new Error("Cloudinary not configured");
  }

  const buffer = await generatePdfBuffer(html);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "resumes/pdfs" },
      (err, result) => (err ? reject(err) : resolve(result))
    );

    const pass = new stream.PassThrough();
    pass.end(buffer);
    pass.pipe(upload);
  });

  return {
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
  };
}

import { renderWithCluster } from "./browser.pool";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/api";
import stream from "stream";

export async function generatePdfBuffer(html: string): Promise<Buffer> {
  const pdf = await renderWithCluster(html);
  return Buffer.from(pdf);
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

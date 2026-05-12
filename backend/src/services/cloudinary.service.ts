import { v2 as cloudinary } from 'cloudinary'
import config from '../config/api'
import stream from 'stream'

// Initialize Cloudinary
cloudinary.config({
  cloudinary_url: config.cloudinaryUrl
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  bytes: number
  format: string
  resource_type: 'image' | 'video' | 'raw'
}

/**
 * Detect resource type based on filename
 */
function detectResourceType(filename: string): 'image' | 'video' | 'raw' {
  const ext = filename.split('.').pop()?.toLowerCase()

  if (!ext) return 'raw'

  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'video'

  return 'raw'
}

/**
 * Upload buffer to Cloudinary (FORCED SAFE)
 */
export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  folder: string = 'resumes',
  resourceType?: 'image' | 'video' | 'raw'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const passthrough = new stream.PassThrough()
    passthrough.end(buffer)

    // 🔥 HARD FORCE: PDFs ALWAYS RAW (no override possible)
    const finalResourceType =
      filename.toLowerCase().endsWith('.pdf')
        ? 'raw'
        : (resourceType || detectResourceType(filename))

    console.log("🔥 FINAL TYPE SENT:", finalResourceType)

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: finalResourceType,
        type: 'upload',
        folder,
        use_filename: true,
        unique_filename: true,
        overwrite: true
      },
      (error, result) => {
        if (error || !result) return reject(error)

        console.log("🔥 CLOUDINARY RESPONSE TYPE:", result.resource_type)

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          bytes: result.bytes,
          format: result.format,
          resource_type: result.resource_type as 'image' | 'video' | 'raw'
        })
      }
    )

    passthrough.pipe(uploadStream)
  })
}

/**
 * Upload HTML
 */
export async function uploadHTML(
  html: string,
  resumeId: string,
  format: 'html' | 'pdf' = 'html'
): Promise<CloudinaryUploadResult> {
  const filename = `${resumeId}-${Date.now()}.${format}`
  const buffer = Buffer.from(html, 'utf-8')

  return uploadBuffer(buffer, filename, 'resumes/html')
}

/**
 * Upload PDF (invoice)
 */
export async function uploadPDF(
  pdfBuffer: Buffer,
  resumeId: string
): Promise<CloudinaryUploadResult> {
  const filename = `${resumeId}-${Date.now()}.pdf`

  return uploadBuffer(pdfBuffer, filename, 'invoices')
}

/**
 * Upload preview image
 */
export async function uploadPreview(
  previewBuffer: Buffer,
  templateId: string
): Promise<CloudinaryUploadResult> {
  const filename = `${templateId}-preview-${Date.now()}.png`

  return uploadBuffer(previewBuffer, filename, 'templates/previews')
}

/**
 * Delete file
 */
export async function deleteFile(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw'
): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType },
      (error) => {
        if (error) return reject(error)
        resolve()
      }
    )
  })
}

/**
 * Generate correct URL
 */
export function getFileUrl(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw'
): string {
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType
  })
}
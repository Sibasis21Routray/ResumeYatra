import { v2 as cloudinary } from 'cloudinary'
import config from '../config/api'
import stream from 'stream'

// Initialize cloudinary
cloudinary.config({ 
  cloudinary_url: config.cloudinaryUrl 
})

export interface CloudinaryUploadResult {
  public_id: string
  url: string
  secure_url: string
  bytes: number
  format: string
  resource_type: string
}

export async function uploadBuffer(
  buffer: Buffer, 
  filename: string, 
  folder: string = 'resumes',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const passthrough = new stream.PassThrough()
    passthrough.end(buffer)

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: resourceType,
        folder,
        public_id: filename.split('.')[0], // Remove extension for public_id
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result as CloudinaryUploadResult)
      }
    )

    passthrough.pipe(uploadStream)
  })
}

export async function uploadHTML(html: string, resumeId: string, format: 'html' | 'pdf' = 'html'): Promise<CloudinaryUploadResult> {
  const filename = `${resumeId}-${Date.now()}.${format}`
  const buffer = Buffer.from(html, 'utf-8')
  
  return uploadBuffer(buffer, filename, 'resumes/html', 'raw')
}

export async function uploadPDF(pdfBuffer: Buffer, resumeId: string): Promise<CloudinaryUploadResult> {
  const filename = `${resumeId}-${Date.now()}.pdf`
  
  return uploadBuffer(pdfBuffer, filename, 'resumes/pdf', 'raw')
}

export async function uploadPreview(previewBuffer: Buffer, templateId: string): Promise<CloudinaryUploadResult> {
  const filename = `${templateId}-preview-${Date.now()}.png`
  
  return uploadBuffer(previewBuffer, filename, 'templates/previews', 'image')
}

export async function deleteFile(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error)
      resolve()
    })
  })
}

export function getOptimizedUrl(publicId: string, options: any = {}): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  })
}

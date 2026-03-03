import stream from 'stream'
import { v2 as cloudinary } from 'cloudinary'
import config from '../config/api'

// Initialize cloudinary from CLOUDINARY_URL if provided
if (config.cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: config.cloudinaryUrl })
}

export type UploadResult = {
  public_id: string
  url: string
  secure_url?: string
  bytes?: number
  format?: string
}

export function uploadBufferToCloudinary(buffer: Buffer, filename: string, folder = 'resumes') {
  return new Promise<UploadResult>((resolve, reject) => {
    const passthrough = new stream.PassThrough()
    passthrough.end(buffer)

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder },
      (error: any, result: any) => {
        if (error) return reject(error)
        resolve({ public_id: result.public_id, url: result.url, secure_url: result.secure_url, bytes: result.bytes, format: result.format })
      }
    )

    passthrough.pipe(uploadStream)
  })
}

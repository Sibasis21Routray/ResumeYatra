declare module 'pdf-parse'
declare module 'mammoth'
declare module 'multer'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export {}
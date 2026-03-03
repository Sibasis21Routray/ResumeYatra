import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // 👈 enforce single string
    }
  }
}

import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import User from '../models/User'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // ✅ Read token from cookies instead of Authorization header
  const token = req.cookies.token;
  console.log('[Auth] Token from cookie present:', !!token)

  if (!token) {
    console.log('[Auth] Missing authentication cookie')
    return res.status(401).json({ error: 'Authentication required' })
  }

  console.log('[Auth] Token length:', token.length)

  const decoded = authService.verifyToken(token)
  console.log('[Auth] Token verification result:', decoded ? 'Success' : 'Failed')

  if (!decoded) {
    console.log('[Auth] Invalid or expired token')
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.userId = decoded.userId
  console.log('[Auth] User ID set:', req.userId)
  next()
}

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    console.log('[Admin] No user ID found, auth middleware must be called first')
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const user = await User.findById(req.userId)
    if (!user) {
      console.log('[Admin] User not found:', req.userId)
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.role !== 'admin') {
      console.log('[Admin] User is not admin:', user.role)
      return res.status(403).json({ error: 'Admin access required' })
    }

    console.log('[Admin] Admin access granted for user:', req.userId)
    next()
  } catch (error) {
    console.error('[Admin] Error checking admin role:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}


export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // ✅ Read token from cookies instead of Authorization header
  const token = req.cookies.token;

  if (token) {

    const decoded = authService.verifyToken(token);

    if (decoded) {
      req.userId = decoded.userId;
      console.log('[OptionalAuth] User detected:', req.userId);
    } else {
      console.log('[OptionalAuth] Invalid token (ignored)');
    }
  } else {
    console.log('[OptionalAuth] No token (guest)');
  }

  next(); // ✅ ALWAYS continue
}

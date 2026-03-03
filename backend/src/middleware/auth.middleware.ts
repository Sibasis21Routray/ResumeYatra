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
  const authHeader = req.headers.authorization
  console.log('[Auth] Authorization header:', authHeader ? 'Present' : 'Missing')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[Auth] Missing or invalid authorization header')
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.substring(7)
  console.log('[Auth] Token extracted, length:', token.length)

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

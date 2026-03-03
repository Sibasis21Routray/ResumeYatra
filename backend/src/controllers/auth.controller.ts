import { Request, Response } from 'express'
import * as authService from '../services/auth.service'

export async function register(req: Request, res: Response) {
  try {
    const { email, name, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const result = await authService.register(email, name || 'User', password)
    res.status(201).json(result)
  } catch (err: any) {
    console.error('register error:', err)
    res.status(400).json({ error: err.message || 'registration failed' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })

    const result = await authService.login(email, password)
    res.json(result)
  } catch (err: any) {
    console.error('login error:', err)
    res.status(401).json({ error: err.message || 'login failed' })
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = req.userId
    if (!userId) return res.status(401).json({ error: 'not authenticated' })

    const user = await authService.getUserById(userId)
    if (!user) return res.status(404).json({ error: 'user not found' })

    res.json({ id: user.id, email: user.email, name: user.name })
  } catch (err: any) {
    console.error('me error:', err)
    res.status(500).json({ error: err.message || 'internal error' })
  }
}

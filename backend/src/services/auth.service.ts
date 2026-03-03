import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/api'
import User from '../models/User'

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any
    return { userId: decoded.userId }
  } catch {
    return null
  }
}

export async function register(email: string, name: string, password: string) {
  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')

  const hashedPassword = await hashPassword(password)
  const user = new User({ email, name, password: hashedPassword })
  await user.save()

  const token = generateToken(user._id.toString())
  return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token }
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid credentials')

  const passwordMatch = await comparePassword(password, user.password)
  if (!passwordMatch) throw new Error('Invalid credentials')

  const token = generateToken(user._id.toString())
  return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token }
}

export async function getUserById(userId: string) {
  return User.findById(userId)
}


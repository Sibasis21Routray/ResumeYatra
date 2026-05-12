import mongoose from 'mongoose'
import connectDB from '../db/db'
import User from '../models/User'
import { hashPassword } from '../services/auth.service'




export async function seedAdmin() {
  try {
    console.log('Seeding admin...')

    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    const hashedPassword = await hashPassword('admin123')

    await User.create({
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Admin created successfully')

  } catch (error) {
    console.error('Error seeding admin:', error)
  }
}

seedAdmin()
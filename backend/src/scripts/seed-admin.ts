import mongoose from 'mongoose'
import connectDB from '../db/db'
import User from '../models/User'
import { hashPassword } from '../services/auth.service'

async function seedAdmin() {
  try {
    await connectDB()
    console.log('Connected to database')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create default admin user
    const adminEmail = 'admin@example.com'
    const adminPassword = 'admin123' // Change this to a secure password
    const adminName = 'Admin'

    const hashedPassword = await hashPassword(adminPassword)
    const adminUser = new User({
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: 'admin'
    })

    await adminUser.save()
    console.log('Default admin user created successfully')
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log('Please change the password after first login')

  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exitCode = 1
  } finally {
    // Close the connection
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

seedAdmin()
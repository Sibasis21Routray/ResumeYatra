import mongoose from 'mongoose'
import { seedAdmin } from '../scripts/seed-admin'
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL!)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    await seedAdmin()   // create admin if not exists
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB

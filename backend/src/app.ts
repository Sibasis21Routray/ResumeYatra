import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'

const app = express()

// Update CORS to support cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust based on your frontend port
  credentials: true
}))

app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api', routes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

export default app

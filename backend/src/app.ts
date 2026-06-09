import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'

const app = express()

// Trust proxy is required for secure cookies on Render/Vercel
app.set('trust proxy', 1)

// Update CORS to support cookies
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-guest-id']
}))

app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api', routes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

export default app

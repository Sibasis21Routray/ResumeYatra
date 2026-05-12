import config from './config/api'
import app from './app'
import connectDB from './db/db'
import { connectRedis } from './config/redis'

const PORT = config.port

connectDB().then(async () => {
  await connectRedis()
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT} (env=${config.nodeEnv})`)
  })
}).catch((error) => {
  console.error('Failed to connect to database:', error)
  process.exit(1)
})

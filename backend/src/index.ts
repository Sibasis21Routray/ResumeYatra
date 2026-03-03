import config from './config/api'
import app from './app'
import connectDB from './db/db'

const PORT = config.port

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT} (env=${config.nodeEnv})`)
  })
}).catch((error) => {
  console.error('Failed to connect to database:', error)
  process.exit(1)
})

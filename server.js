import express from "express"
import dotenv from "dotenv"
import { connectMainDB } from "./config/db.js" // Note the path change if server.js is in root
import storeSettingsRoutes from "./routes/store-settings.js" // Note the path change if server.js is in root

// Load environment variables from .env file
dotenv.config()

const app = express() // This line initializes 'app' as an Express application
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json()) // For parsing application/json

// Connect to the main database
connectMainDB()

// Routes
app.get("/", (req, res) => {
  res.send("Settings Microservice is running!")
})
app.use("/api", storeSettingsRoutes) // Mount store settings routes under /api

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Settings Microservice running on port ${PORT}`)
})

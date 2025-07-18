import express from "express"
import dotenv from "dotenv"
import { connectMainDB } from "./config/db.js"
import storeSettingsRoutes from "./routes/store-settings.js"

// Load environment variables from .env file
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Connect to the main database at application startup
// This is crucial for the getTenantDb helper to find tenant mappings
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

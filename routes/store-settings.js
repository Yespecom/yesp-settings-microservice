import express from "express"
import authMiddleware from "../middleware/auth.js" // Import authMiddleware
import { storeSettingSchema } from "../models/StoreSetting.js" // Import the schema definition
import {
  saveStoreSettings,
  getStoreSettings,
  updateStoreSettings,
  deleteStoreSettings,
} from "../controllers/storeSettingsController.js"

const router = express.Router()

// Function to get or create the StoreSetting model for a specific tenant connection
const getStoreSettingModel = (tenantConnection) => {
  // Check if the model already exists on this connection to prevent Mongoose from recompiling it
  if (tenantConnection.models.StoreSetting) {
    return tenantConnection.models.StoreSetting
  }
  return tenantConnection.model("StoreSetting", storeSettingSchema)
}

// Routes for Store Settings
router.post("/settings", authMiddleware, saveStoreSettings) // Create or update
router.get("/settings", authMiddleware, getStoreSettings) // Get
router.put("/settings", authMiddleware, updateStoreSettings) // Update (full replacement or partial)
router.delete("/settings", authMiddleware, deleteStoreSettings) // Delete

export default router

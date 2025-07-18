import { connectTenantDB, connectMainDB } from "../config/db.js"
import Tenant from "../models/main/Tenant.js" // Corrected import path after moving Tenant.js
import { storeSettingSchema } from "../models/StoreSetting.js" // Import the schema definition

// Helper function to get the tenant-specific database connection
const getTenantDb = async (tenantId) => {
  // Ensure main DB is connected to fetch tenant info
  await connectMainDB() // This ensures main DB is connected to fetch tenant info
  const tenant = await Tenant.findOne({ tenantId })
  if (!tenant || !tenant.dbName) {
    throw new Error(`Tenant DB not found for tenantId: ${tenantId}`)
  }
  const tenantDb = await connectTenantDB(tenant.dbName)
  return tenantDb
}

// Helper function to get or create the StoreSetting model for a specific tenant connection
const getStoreSettingModel = (tenantConnection) => {
  if (tenantConnection.models.StoreSetting) {
    return tenantConnection.models.StoreSetting
  }
  return tenantConnection.model("Stores", storeSettingSchema)
}

// Create or update store settings
export const saveStoreSettings = async (req, res) => {
  const { tenantId, storeId } = req // tenantId and storeId from authMiddleware
  const data = req.body // All settings data from request body

  try {
    if (!tenantId || !storeId) {
      return res.status(400).json({ message: "Tenant ID and Store ID are required." })
    }

    const db = await getTenantDb(tenantId)
    const StoreSetting = getStoreSettingModel(db)

    // Find and update, or create if not found (upsert)
    const updatedSettings = await StoreSetting.findOneAndUpdate(
      { storeId }, // Query by storeId
      { ...data, storeId }, // Update with new data, ensure storeId is set
      { new: true, upsert: true, setDefaultsOnInsert: true }, // Return new doc, create if not exists, apply defaults
    )

    res.status(200).json({ message: "Store settings saved successfully.", settings: updatedSettings })
  } catch (err) {
    console.error("Error saving store settings:", err)
    res.status(500).json({ message: "Failed to save store settings." })
  }
}

// Get store settings
export const getStoreSettings = async (req, res) => {
  const { tenantId, storeId } = req // tenantId and storeId from authMiddleware

  try {
    if (!tenantId || !storeId) {
      return res.status(400).json({ message: "Tenant ID and Store ID are required." })
    }

    const db = await getTenantDb(tenantId)
    const StoreSetting = getStoreSettingModel(db)
    const settings = await StoreSetting.findOne({ storeId })

    if (!settings) {
      return res.status(404).json({ message: "Store settings not found for this store." })
    }

    res.status(200).json(settings)
  } catch (err) {
    console.error("Error fetching store settings:", err)
    res.status(500).json({ message: "Failed to fetch store settings." })
  }
}

// Update store settings (partial update)
export const updateStoreSettings = async (req, res) => {
  const { tenantId, storeId } = req // tenantId and storeId from authMiddleware
  const data = req.body // Data to update

  try {
    if (!tenantId || !storeId) {
      return res.status(400).json({ message: "Tenant ID and Store ID are required." })
    }

    const db = await getTenantDb(tenantId)
    const StoreSetting = getStoreSettingModel(db)

    const updated = await StoreSetting.findOneAndUpdate({ storeId }, data, { new: true })

    if (!updated) {
      return res.status(404).json({ message: "Store settings not found for this store." })
    }

    res.status(200).json({ message: "Store settings updated successfully.", settings: updated })
  } catch (err) {
    console.error("Error updating store settings:", err)
    res.status(500).json({ message: "Failed to update store settings." })
  }
}

// Delete store settings
export const deleteStoreSettings = async (req, res) => {
  const { tenantId, storeId } = req // tenantId and storeId from authMiddleware

  try {
    if (!tenantId || !storeId) {
      return res.status(400).json({ message: "Tenant ID and Store ID are required." })
    }

    const db = await getTenantDb(tenantId)
    const StoreSetting = getStoreSettingModel(db)

    const result = await StoreSetting.findOneAndDelete({ storeId })

    if (!result) {
      return res.status(404).json({ message: "Store settings not found for this store." })
    }

    res.status(200).json({ message: "Store settings deleted successfully." })
  } catch (err) {
    console.error("Error deleting store settings:", err)
    res.status(500).json({ message: "Failed to delete store settings." })
  }
}

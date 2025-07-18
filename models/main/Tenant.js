import mongoose from "mongoose"

const tenantSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    dbName: { type: String, required: true, unique: true }, // The actual database name for this tenant
    // You can add other tenant-specific fields here if needed
  },
  { timestamps: true },
)

const Tenant = mongoose.model("Tenant", tenantSchema)

export default Tenant

import mongoose from "mongoose"

const storeSettingSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true, unique: true }, // Already included and required
    storeName: String,
    logoUrl: String,
    contactEmail: String,
    contactPhone: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
    },
    currency: { type: String, default: "INR" },
    taxPercentage: Number,
    gstNumber: String,
    theme: { type: String, default: "light" }, // The new field we added
    refundPolicy: String,
    shippingPolicy: String,
  },
  { timestamps: true },
)

// This model will be used with the main database connection
const StoreSetting = mongoose.model("Stores", storeSettingSchema)

export default StoreSetting
export { storeSettingSchema } // Export the schema definition

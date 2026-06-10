import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    barcode: { type: String, trim: true, index: true },
    description: { type: String, default: "" },
    unit: { type: String, default: "pcs" },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

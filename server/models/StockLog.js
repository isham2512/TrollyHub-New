import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    old_stock: { type: Number, required: true },
    new_stock: { type: Number, required: true },
    change_type: { type: String, enum: ["manual", "billing"], default: "manual" }
  },
  { timestamps: true }
);

export default mongoose.model("StockLog", stockLogSchema);

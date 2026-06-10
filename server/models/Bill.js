import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    bill_number: { type: String, required: true, unique: true },
    total_amount: { type: Number, required: true, min: 0 },
    tax_amount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    final_amount: { type: Number, required: true, min: 0 }
  },
  { timestamps: { createdAt: "created_at", updatedAt: true } }
);

export default mongoose.model("Bill", billSchema);

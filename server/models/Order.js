import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    total_amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Delivered"],
      default: "Completed"
    },
    payment_method: { type: String, default: "Cash" },
    order_type: { type: String, enum: ["In-Store", "Takeaway"], default: "In-Store" },
    takeaway_time: { type: String },
    items: [orderItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

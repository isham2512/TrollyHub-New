import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "manager", "employee", "customer"],
      required: true,
    },
    mobile: { type: String, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, index: true, sparse: true },
    password: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

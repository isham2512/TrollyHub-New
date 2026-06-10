import bcrypt from "bcryptjs";
import User from "../models/User.js";
import OtpVerification from "../models/OtpVerification.js";
import { generateToken } from "../utils/generateToken.js";

export const loginStaff = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true });
  if (!user || !user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: user._id, role: user.role, name: user.name, email: user.email
  });

  res.json({
    token,
    user: { id: user._id, name: user.name, role: user.role, email: user.email, mobile: user.mobile }
  });
};

export const requestCustomerOtp = async (req, res) => {
  const { mobile, name } = req.body;

  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ message: "Valid mobile number is required" });
  }

  let user = await User.findOne({ mobile, role: "customer" });
  if (!user) {
    user = await User.create({ name: name || "Customer", role: "customer", mobile });
  }

  const otp = "123456";
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await OtpVerification.deleteMany({ mobile });
  await OtpVerification.create({ mobile, otp, expiresAt });

  res.json({ message: "OTP sent successfully", mobile, devOtp: otp });
};

export const verifyCustomerOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  const otpRecord = await OtpVerification.findOne({ mobile, otp }).sort({ createdAt: -1 });
  if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
  if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

  otpRecord.verified = true;
  await otpRecord.save();

  const user = await User.findOne({ mobile, role: "customer" });
  const token = generateToken({ id: user._id, role: user.role, name: user.name, mobile: user.mobile });

  res.json({
    token,
    user: { id: user._id, name: user.name, role: user.role, mobile: user.mobile }
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

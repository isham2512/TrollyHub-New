import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const query = req.user.role === "admin"
    ? { role: { $in: ["manager", "employee", "customer"] } }
    : { role: "customer" };

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, role, email, mobile, password } = req.body;

  if (!["manager", "employee", "customer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const exists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = password ? await bcrypt.hash(password, 10) : undefined;

  const user = await User.create({
    name,
    role,
    email,
    mobile,
    password: hashed
  });

  res.status(201).json({
    ...user.toObject(),
    password: undefined
  });
};

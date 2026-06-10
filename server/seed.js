import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Bill from "./models/Bill.js";
import OtpVerification from "./models/OtpVerification.js";
import StockLog from "./models/StockLog.js";

await connectDB();

await Promise.all([
  User.deleteMany({}),
  Product.deleteMany({}),
  Order.deleteMany({}),
  Bill.deleteMany({}),
  OtpVerification.deleteMany({}),
  StockLog.deleteMany({})
]);

const [adminPassword, managerPassword, employeePassword] = await Promise.all([
  bcrypt.hash("Admin@123", 10),
  bcrypt.hash("Manager@123", 10),
  bcrypt.hash("Employee@123", 10)
]);

const users = await User.insertMany([
  {
    name: "Trolly Hub Admin",
    role: "admin",
    email: "admin@trollyhub.com",
    mobile: "9000000001",
    password: adminPassword
  },
  {
    name: "Store Manager",
    role: "manager",
    email: "manager@trollyhub.com",
    mobile: "9000000002",
    password: managerPassword
  },
  {
    name: "Billing Employee",
    role: "employee",
    email: "employee@trollyhub.com",
    mobile: "9000000003",
    password: employeePassword
  },
  {
    name: "Demo Customer",
    role: "customer",
    mobile: "9999999999"
  }
]);

const products = await Product.insertMany([
  { product_name: "Rice 1kg", category: "Grocery", price: 60, stock: 100, barcode: "111001" },
  { product_name: "Milk 500ml", category: "Dairy", price: 30, stock: 50, barcode: "111002" },
  { product_name: "Bread", category: "Bakery", price: 35, stock: 40, barcode: "111003" },
  { product_name: "Cooking Oil 1L", category: "Grocery", price: 150, stock: 20, barcode: "111004" },
  { product_name: "Soap", category: "Personal Care", price: 25, stock: 75, barcode: "111005" },
  { product_name: "Biscuits", category: "Snacks", price: 20, stock: 90, barcode: "111006" }
]);

console.log("Seeded users:", users.length);
console.log("Seeded products:", products.length);

await mongoose.connection.close();
console.log("Seed complete");

import express from "express";
import {
  loginStaff,
  requestCustomerOtp,
  verifyCustomerOtp,
  getMe,
  register
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/staff-login", loginStaff);
router.post("/customer/request-otp", requestCustomerOtp);
router.post("/customer/verify-otp", verifyCustomerOtp);
router.post("/register", register);
router.get("/me", protect, getMe);

export default router;

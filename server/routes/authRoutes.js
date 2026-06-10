import express from "express";
import {
  loginStaff,
  requestCustomerOtp,
  verifyCustomerOtp,
  getMe
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/staff-login", loginStaff);
router.post("/customer/request-otp", requestCustomerOtp);
router.post("/customer/verify-otp", verifyCustomerOtp);
router.get("/me", protect, getMe);

export default router;

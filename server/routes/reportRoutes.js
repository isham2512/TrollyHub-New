import express from "express";
import { getDashboardStats, getSalesReport } from "../controllers/reportController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin", "manager"), getDashboardStats);
router.get("/sales", protect, authorize("admin", "manager"), getSalesReport);

export default router;

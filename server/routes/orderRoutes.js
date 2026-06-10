import express from "express";
import { createOrder, getOrders, getOrderById, getBills, updateOrderStatus } from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("employee", "admin", "manager", "customer"), createOrder);
router.get("/", protect, getOrders);
router.get("/bills/all", protect, getBills);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, authorize("employee", "admin", "manager"), updateOrderStatus);

export default router;

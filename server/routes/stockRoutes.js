import express from "express";
import { updateStock, getLowStock, getStockLogs } from "../controllers/stockController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/low-stock", protect, authorize("admin", "manager"), getLowStock);
router.get("/logs", protect, authorize("admin", "manager"), getStockLogs);
router.patch("/:id", protect, authorize("admin", "manager"), updateStock);

export default router;

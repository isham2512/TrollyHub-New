import express from "express";
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, authorize("admin", "manager"), createProduct);
router.put("/:id", protect, authorize("admin", "manager"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;

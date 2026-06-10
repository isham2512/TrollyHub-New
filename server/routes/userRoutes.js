import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "manager"), getUsers);
router.post("/", protect, authorize("admin"), createUser);

export default router;

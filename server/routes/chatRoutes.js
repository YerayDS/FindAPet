import express from "express";
import { getOrCreateChat } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/get-or-create", authenticateToken, getOrCreateChat);

export default router;

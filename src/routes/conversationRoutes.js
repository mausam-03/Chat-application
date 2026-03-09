import express from "express";
import {
  createConversation,
  getUserConversations,
  getConversationById,
  deleteConversation
} from "../controllers/conversationController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createConversation);

router.get("/", authenticate, getUserConversations);

router.get("/:id", authenticate, getConversationById);

router.delete("/:id", authenticate, deleteConversation);

export default router;
import express from "express";
import {
  createMessage,
  getConversationMessages,
  getMessageById,
  deleteMessage
} from "../controllers/messageController.js";
import { upload } from "../middleware/upload.js";
import { sendAttachment } from "../controllers/messageController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createMessage);

router.get("/conversations/:id/messages", authenticate, getConversationMessages);

router.get("/:id", authenticate, getMessageById);

router.delete("/:id", authenticate, deleteMessage);

router.post("/attachment", upload.single("file"), sendAttachment);

export default router;
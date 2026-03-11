import express from "express";
import {
  addParticipant,
  removeParticipant,
  getParticipants
} from "../controllers/conversationParticipantController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id/participants", authenticate, addParticipant);

router.delete("/:id/participants/:userId", authenticate, removeParticipant);

router.get("/:id/participants", authenticate, getParticipants);

export default router;
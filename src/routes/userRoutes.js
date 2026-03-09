import express from "express";
import {
  getCurrentUser,
  getUserById,
  searchUsers,
  updateProfile
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticate, getCurrentUser);
router.get("/search", authenticate, searchUsers);
router.get("/:id", authenticate, getUserById);
router.patch("/profile", authenticate, updateProfile);

export default router;
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;

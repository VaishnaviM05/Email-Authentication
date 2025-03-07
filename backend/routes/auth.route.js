import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth, changePassword } from "../controllers/auth.controller.js";
import { protectRoute, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", protectRoute, changePassword);

export default router
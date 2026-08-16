import express from "express";
import passport from "../config/passport.js";

import { protect } from "../middleware/authMiddleware.js";

import {
  signup,
  login,
  logout,
  verifyUser,
  googleCallback,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// =======================
// Normal Authentication
// =======================

router.post("/signup", signup);

router.post("/login", login);

router.get("/verify", protect, verifyUser);

router.post("/logout", logout);

// =======================
// Forgot Password
// =======================

router.post(
  "/forgot-password",
  forgotPassword
);

// =======================
// Reset Password
// =======================

router.post(
  "/reset-password/:token",
  resetPassword
);
// =======================
// Google Authentication
// =======================

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  googleCallback
);

export default router;
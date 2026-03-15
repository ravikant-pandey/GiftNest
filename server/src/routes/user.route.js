import express from "express";
import {
  deleteAccount,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendPasswordResetOtp,
  sentVerifyOtp,
  updateAvatar,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "../controllers/user.controller.js";
import verifyJwt from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyJwt, logoutUser);
router.get("/current-user", verifyJwt, getCurrentUser);
router.post("/sent-verify-otp", verifyJwt, sentVerifyOtp);
router.post("/verify-account", verifyJwt, verifyEmail);
router.post("/sent-password-reset-otp", sendPasswordResetOtp);
router.post("/reset-password", resetPassword);
router.put("/update-avatar", verifyJwt, upload.single("avatar"), updateAvatar);
router.put("/update-profile", verifyJwt, updateProfile);
router.put("/update-password", verifyJwt, updatePassword);
router.delete("/delete-account", verifyJwt, deleteAccount);
export default router;

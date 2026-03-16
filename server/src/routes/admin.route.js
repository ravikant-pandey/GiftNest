import express from "express";
import {
  changePassword,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  resendLoginOtp,
  updateAvatar,
  updateProfile,
  verifyLoginOtp,
} from "../controllers/admin.controller.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/admin-login", loginAdmin);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/resend-login", resendLoginOtp);
router.get("/admin-logout", verifyAdmin, logoutAdmin);
router.get("/current-admin", verifyAdmin, getCurrentAdmin);
router.put("/update-password", verifyAdmin, changePassword);
router.put("/update-profile", verifyAdmin, updateProfile);
router.put(
  "/update-avatar",
  verifyAdmin,
  upload.single("avatar"),
  updateAvatar,
);

export default router;

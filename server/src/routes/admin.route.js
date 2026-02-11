import express from "express";
import {
  changePassword,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  updateAvatar,
  updateProfile,
} from "../controllers/admin.controller.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/admin-login", loginAdmin);
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

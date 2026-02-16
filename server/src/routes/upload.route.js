import express from "express";
import { uploadCustomImage } from "../controllers/upload.controller.js";
import upload from "../middleware/multer.middleware.js";
import verifyJwt from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/upload-custom-image",
  verifyJwt,
  upload.single("image"),
  uploadCustomImage,
);

export default router;

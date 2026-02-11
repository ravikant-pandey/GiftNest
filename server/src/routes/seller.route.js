import express from "express";
import {
  changePassword,
  deleteStore,
  getCurrentSeller,
  loginSeller,
  logoutSeller,
  registerSeller,
  sellerData,
  storeApprove,
  toggleSellerActive,
  updateStore,
  updateStoreAvatar,
} from "../controllers/seller.controller.js";
import verifySeller from "../middleware/seller.middleware.js";
import upload from "../middleware/multer.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register-seller", registerSeller);
router.post("/login-seller", loginSeller);
router.get("/logout-seller", verifySeller, logoutSeller);
router.get("/current-seller", verifySeller, getCurrentSeller);
router.put(
  "/update-avatar",
  verifySeller,
  upload.single("logo"),
  updateStoreAvatar,
);
router.put("/update-store", verifySeller, updateStore);
router.put("/update-password", verifySeller, changePassword);
router.delete("/delete-store", verifySeller, deleteStore);

// for admin
router.put("/store-status/:id", verifyAdmin, storeApprove);
router.get("/seller-data", verifyAdmin, sellerData);
router.put("/is-active/:id", verifyAdmin, toggleSellerActive);

export default router;

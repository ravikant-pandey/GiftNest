import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSellerProducts,
  getSingleProduct,
  searchProducts,
  toggleFeatured,
  updateProduct,
} from "../controllers/product.controller.js";
import verifySeller from "../middleware/seller.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();
// public api
router.get("/products", getAllProducts);
router.post("/single", getSingleProduct);
// private api
router.post(
  "/add-product",
  verifySeller,
  upload.array("images", 4),
  createProduct,
);
router.put("/update-product/:id", verifySeller, updateProduct);
router.delete("/delete-product/:id", verifySeller, deleteProduct);
router.put("/toggle-featured/:id", verifySeller, toggleFeatured);
router.get("/seller-product", verifySeller, getSellerProducts);

// Search Products
router.get("/search", searchProducts);

export default router;

import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCartData,
  updateCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add-to-cart", verifyJwt, addToCart);
router.get("/cart-data", verifyJwt, getCartData);
router.put("/update-cart", verifyJwt, updateCart);

export default router;

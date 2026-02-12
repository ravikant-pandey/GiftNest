import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import {
  getAllOrders,
  getOrdersForUser,
  placeOrder,
  placeOrderUsingStripe,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import verifySeller from "../middleware/seller.middleware.js";

const router = express.Router();

router.post("/place-order", verifyJwt, placeOrder);
router.post("/place-order-stripe", verifyJwt, placeOrderUsingStripe);
router.get("/my-orders", verifyJwt, getOrdersForUser);
router.get("/all-orders", verifySeller, getAllOrders);
router.put("/update-order-status", verifySeller, updateOrderStatus);

export default router;
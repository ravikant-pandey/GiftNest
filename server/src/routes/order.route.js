import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import {
  cancelOrder,
  getAllOrders,
  getOrdersForAdmin,
  getOrdersForUser,
  placeOrder,
  placeOrderRazorpay,
  placeOrderUsingStripe,
  updateOrderStatus,
  verifyRazorpay,
} from "../controllers/order.controller.js";
import verifySeller from "../middleware/seller.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/place-order", verifyJwt, placeOrder);
router.post("/place-order-stripe", verifyJwt, placeOrderUsingStripe);
router.post("/razorpay", verifyJwt, placeOrderRazorpay);
router.post("/verify-razorpay", verifyJwt, verifyRazorpay);

router.get("/my-orders", verifyJwt, getOrdersForUser);
router.get("/all-orders", verifySeller, getAllOrders);
router.put("/update-order-status", verifySeller, updateOrderStatus);
router.get("/orders", verifyAdmin, getOrdersForAdmin);

router.post("/cancel-order", verifyJwt, cancelOrder)

export default router;

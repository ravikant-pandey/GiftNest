import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Placing order using COD method
const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, amount, address } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orderData = {
      user: userId,
      product,
      amount,
      address,
      paymentMethod: "COD",
    };
    const order = await Order.create(orderData);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not placed",
      });
    }
    await User.findByIdAndUpdate(userId, { $set: { cart: {} } }, { new: true });
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// placing order using STRIPE
const placeOrderUsingStripe = asyncHandler(async (req, res) => {});

// get orders
const getOrdersForUser = asyncHandler(async (req, res) => {});

// get all orders for seller and admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({
    success: true,
    orders,
  });
});

// update order status from seller panel
const updateOrderStatus = asyncHandler(async (req, res) => {});

export {
  placeOrder,
  placeOrderUsingStripe,
  getOrdersForUser,
  getAllOrders,
  updateOrderStatus,
};

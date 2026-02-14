import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order using COD method
const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, amount, address } = req.body;
    const order = await Order.create({
      user: userId,
      product,
      amount,
      address,
      paymentMethod: "COD",
    });

    await User.findByIdAndUpdate(userId, { $set: { cart: {} } });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// placing order using STRIPE
const placeOrderUsingStripe = asyncHandler(async (req, res) => {
  try {
    const { product, address } = req.body;
    const userId = req.user._id;
    const { origin } = req.headers;

    // 1️⃣ Calculate amount safely on backend
    let orderAmount = 0;

    product.forEach((item) => {
      orderAmount += item.price * item.quantity;
    });

    // 2️⃣ Calculate delivery
    const deliveryCharges = orderAmount > 500 ? 0 : 99;
    const totalAmount = orderAmount + deliveryCharges;

    // 3️⃣ Save order in DB
    const order = await Order.create({
      user: userId,
      product,
      amount: totalAmount,
      deliveryCharges,
      address,
      isPaid: false,
      paymentMethod: "STRIPE",
    });

    // 4️⃣ Create stripe line items
    const line_items = product.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
        },
        unit_amount: item.price * 100, // rupees → paise
      },
      quantity: item.quantity,
    }));

    // 5️⃣ Add delivery charge item
    if (deliveryCharges > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: deliveryCharges * 100,
        },
        quantity: 1,
      });
    }

    // 6️⃣ Create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },

      success_url: `${origin}/verify?success=true`,
      cancel_url: `${origin}/verify?success=false`,
    });

    return res.status(200).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get orders
const getOrdersForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId });
  return res.status(200).json({
    success: true,
    orders,
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const orders = await Order.find().sort({ createdAt: -1 });

    // Keep only seller products inside each order
    const sellerOrders = orders
      .map((order) => {
        const sellerProducts = order.product.filter(
          (item) => item.seller.toString() === sellerId.toString(),
        );

        // If this order has no products of this seller → skip
        if (sellerProducts.length === 0) return null;

        return {
          ...order._doc,
          product: sellerProducts, // keep only seller items
        };
      })
      .filter((order) => order !== null);

    return res.status(200).json({
      success: true,
      totalOrders: sellerOrders.length,
      orders: sellerOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update order status from seller panel
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { $set: { status } }, { new: true });
    return res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// get orders for admin
const getOrdersForAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    orders,
  });
});

export {
  placeOrder,
  placeOrderUsingStripe,
  getOrdersForUser,
  getAllOrders,
  updateOrderStatus,
  getOrdersForAdmin,
};

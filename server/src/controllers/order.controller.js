import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place order
const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, amount, address } = req.body;

    if (!product || product.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided",
      });
    }

    const order = await Order.create({
      user: userId,
      product, // already contains quantity + custom fields
      amount,
      address,
      paymentMethod: "COD",
    });

    // Clear cart
    await User.findByIdAndUpdate(userId, {
      $set: { cart: [] },
    });

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

    if (!product || product.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided",
      });
    }

    let orderAmount = 0;
    const line_items = [];
    const cleanProducts = [];

    // 1️⃣ Fetch real prices from DB
    for (const item of product) {
      const productData = await Product.findById(item.productId);

      if (!productData) continue;

      const itemTotal = productData.price * item.quantity;
      orderAmount += itemTotal;

      // Prepare order items
      cleanProducts.push({
        productId: productData._id,
        quantity: item.quantity,
        customeText: item.customeText || "",
        customeImage: item.customeImage || "",
      });

      // Stripe line item
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: productData.title,
          },
          unit_amount: productData.price * 100,
        },
        quantity: item.quantity,
      });
    }

    // 2️⃣ Delivery charge
    const deliveryCharges = orderAmount > 500 ? 0 : 99;
    const totalAmount = orderAmount + deliveryCharges;

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

    // 3️⃣ Save Order in DB
    const order = await Order.create({
      user: userId,
      product: cleanProducts,
      amount: totalAmount,
      address,
      isPaid: false,
      paymentMethod: "STRIPE",
    });

    // 4️⃣ Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },

      success_url: `${origin}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
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


// get orders for logged in user
const getOrdersForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate({
      path: "product.productId", 
      model: "Product",
      select: "title amount images price",
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    orders,
  });
});


const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const orders = await Order.find()
      .populate("product.productId")
      .sort({ createdAt: -1 });

    const sellerOrders = orders
      .map((order) => {
        const sellerProducts = order.product.filter(
          (item) =>
            item.productId &&
            item.productId.seller.toString() === sellerId.toString(),
        );

        if (sellerProducts.length === 0) return null;

        return {
          ...order._doc,
          product: sellerProducts,
        };
      })
      .filter(Boolean);

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

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    // If delivered and COD → mark paid
    if (status === "Delivered" && order.paymentMethod === "COD") {
      order.isPaid = true;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// get orders for admin
const getOrdersForAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({
      path: "product.productId",
      populate: {
        path: "seller",
        model: "Seller",
        select: "store",
      },
    })
    .sort({ createdAt: -1 });

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

uploadOnCloudinary();

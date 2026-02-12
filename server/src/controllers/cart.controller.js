import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add product to user cart
const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // 1️⃣ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Initialize cart if not exists
    if (!user.cart) {
      user.cart = {};
    }

    // 3️⃣ Add / increase quantity
    if (user.cart[productId]) {
      user.cart[productId] += 1;
    } else {
      user.cart[productId] = 1;
    }

    // 4️⃣ Important for nested object updates
    user.markModified("cart");

    // 5️⃣ Save user
    await user.save();

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// update cart quantity
const updateCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // 1️⃣ Validate quantity
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    // 2️⃣ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Ensure cart exists
    if (!user.cart) {
      user.cart = {};
    }

    // 4️⃣ If quantity = 0 → remove item
    if (quantity === 0) {
      delete user.cart[productId];
    } else {
      // 5️⃣ Update quantity
      user.cart[productId] = quantity;
    }

    // 6️⃣ Tell mongoose cart changed
    user.markModified("cart");

    // 7️⃣ Save
    await user.save();

    // 8️⃣ Response
    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// gat cart data for particular user
const getCartData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    return res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export { addToCart, updateCart, getCartData };

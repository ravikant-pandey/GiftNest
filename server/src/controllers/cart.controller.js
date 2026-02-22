import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add product to user cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, customeText, customeImage } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check if same product + same customization already exists
  user.cart = user.cart.filter((item) => item.productId);

  const existingItem = user.cart.find(
    (item) =>
      item.productId.toString() === productId &&
      (item.customeText || "") === (customeText || "") &&
      (item.customeImage || "") === (customeImage || ""),
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.push({
      productId,
      quantity: 1,
      customeText: customeText || "",
      customeImage: customeImage || "",
    });
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart: user.cart,
  });
});


const updateCart = asyncHandler(async (req, res) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user._id;  
  if (quantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity cannot be negative",
    });
  }

  const user = await User.findById(userId);

  // ⭐ find item index (NOT user.cart.id)
  const itemIndex = user.cart.findIndex(
    (item) => item._id.toString() === cartItemId,
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found",
    });
  }

  // ⭐ DELETE ITEM
  if (quantity === 0) {
    user.cart.splice(itemIndex, 1);
  } else {
    user.cart[itemIndex].quantity = quantity;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart: user.cart,
  });
});

// get cart data for particular user
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

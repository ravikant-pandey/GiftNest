import { Seller } from "../models/seller.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookiesOption.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const generateToken = async (sellerId) => {
  try {
    const token = jwt.sign(
      { _id: sellerId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // expires in 1 day
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Could not generate token");
  }
};

const registerSeller = asyncHandler(async (req, res) => {
  const { email, password, phone, store, ownerName } = req.body;
  // Validate input
  if (!email || !password || !phone || !store || !ownerName) {
    throw new ApiError(400, "All fields are required");
  }

  // Check for existing email
  const existingEmail = await Seller.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "Seller already exists with this email");
  }

  // Check for existing phone
  const existingPhone = await Seller.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(400, "Phone number already exists");
  }

  // Create seller
  const seller = await Seller.create({
    email,
    password,
    phone,
    store,
    ownerName,
  });

  // Fetch created seller without sensitive fields
  const createdSeller = await Seller.findById(seller._id).select("-password");

  //  Send response
  return res.status(201).json(
    new ApiResponse(201, "Seller created successfully", {
      seller: createdSeller,
    }),
  );
});

const loginSeller = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone) throw new ApiError(400, "Email or Phone is required.");
  if (!password) throw new ApiError(400, "Password is required.");
  console.log(emailOrPhone, password);
  const seller = await Seller.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!seller) throw new ApiError(404, "Seller not found");

  const isPasswordCorrect = await seller.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  const token = await generateToken(seller._id);
  const loggedInSeller = await Seller.findById(seller._id).select("-password ");

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(200, "Login successful", {
        seller: loggedInSeller,
      }),
    );
});

const logoutSeller = asyncHandler(async (req, res) => {
  return res.status(200).clearCookie("token", cookieOptions).json({
    success: true,
    message: "Seller logged out successfully!",
  });
});

const getCurrentSeller = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Seller fetched successfully!",
    seller: req.seller,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { oldPassword, newPassword } = req.body;

    const seller = await Seller.findById(sellerId);

    if (!seller) throw new ApiError(404, "Seller not found");

    const isMatch = await seller.isPasswordCorrect(oldPassword);

    if (!isMatch) {
      throw new ApiError(401, "Old password is incorrect");
    }
    // Set new password (will be hashed via pre-save hook)
    seller.password = newPassword;

    // Save seller
    await seller.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});
const updateStore = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { ownerName, store, description, address, email, phone } = req.body;

    await Seller.findByIdAndUpdate(
      sellerId,
      { $set: { ownerName, store, description, address, email, phone } },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Store updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});
const deleteStore = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;
    console.log(sellerId);
    await Seller.findByIdAndDelete(sellerId);
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
});
const updateStoreAvatar = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const avatarLocalPath = req.file?.path;
    console.log(avatarLocalPath);
    if (!avatarLocalPath) throw new ApiError(400, "Logo is required");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(500, "Failed to upload avatar");
    }
    await Seller.findByIdAndUpdate(
      sellerId,
      { $set: { logo: avatar.url } },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Store logo updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
});

// for admin
const storeApprove = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { status } = req.body;
    if (!status) {
      res.status(400);
      throw new Error("Status is required");
    }
    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { status },
      { new: true },
    );

    if (!seller) {
      res.status(404);
      throw new Error("Seller not found");
    }

    res.status(200).json({
      success: true,
      message: `Store ${status} successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

// seller data for admin
const sellerData = asyncHandler(async (req, res) => {
  try {
    const sellers = await Seller.find();
    return res.json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

// toggle for active
const toggleSellerActive = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Find seller first
  const seller = await Seller.findById(id);

  if (!seller) {
    return res.status(404).json({
      success: false,
      message: "Seller not found",
    });
  }

  // 2️⃣ Toggle value
  seller.isActive = !seller.isActive;
  await seller.save();

  res.status(200).json({
    success: true,
    message: `Seller ${
      seller.isActive ? "activated" : "deactivated"
    } successfully`,
    seller,
  });
});

// dashboard data (Total Revenue, Total Orders, Total Product, Average Order)
const dashboardData = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;
  } catch (error) {}
});

export {
  registerSeller,
  loginSeller,
  logoutSeller,
  getCurrentSeller,
  changePassword,
  updateStore,
  updateStoreAvatar,
  deleteStore,
  storeApprove,
  sellerData,
  toggleSellerActive,
};

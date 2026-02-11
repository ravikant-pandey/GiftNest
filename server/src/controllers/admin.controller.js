import { Admin } from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookiesOption.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const generateToken = async (adminId) => {
  try {
    const token = jwt.sign(
      { _id: adminId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // expires in 1 day
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Could not generate token");
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;
  console.log(emailOrPhone, password);

  if (!emailOrPhone) throw new ApiError(400, "Email or Phone is required.");
  if (!password) throw new ApiError(400, "Password is required.");

  const admin = await Admin.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!admin) throw new ApiError(404, "Admin not found");

  const isPasswordCorrect = await admin.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  const token = await generateToken(admin._id);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, "Login successful"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  return res.status(200).clearCookie("token", cookieOptions).json({
    success: true,
    message: "Admin logged out successfully!",
  });
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin fetched successfully!",
    admin: req.admin,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");
    const isMatch = await admin.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      throw new ApiError(401, "Old password is incorrect");
    }
    // Set new password (will be hashed via pre-save hook)
    admin.password = newPassword;
    // Save admin
    await admin.save();
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

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const adminId = req.admin._id;

  const updatedAdmin = await Admin.findByIdAndUpdate(
    adminId,
    { $set: { name, email, phone } },
    { new: true },
  );

  if (!updatedAdmin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const adminId = req.admin._id;
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(500, "Failed to upload avatar");
    }
    await Admin.findByIdAndUpdate(
      adminId,
      { $set: { avatar: avatar.url } },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    console.log(error);
    return ApiResponse.json({
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

export {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  changePassword,
  updateProfile,
  updateAvatar,
};

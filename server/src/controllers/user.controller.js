import { uploadOnCloudinary } from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../utils/cookiesOption.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  // Validate inputs first
  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  // Check duplicate email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(400, "User already exists with this email");
  }

  // Check duplicate phone
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw new ApiError(400, "Phone number already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", { createdUser }));
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Validate
  if (!emailOrPhone) throw new ApiError(400, "Email or Phone is required.");
  if (!password) throw new ApiError(400, "Password is required.");
  // Find by email or phone
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!user) throw new ApiError(404, "User not found");

  // Check password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid password");

  // Generate token
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  // Hide password in response
  const loggedInUser = await User.findById(user._id).select("-password");

  // Response
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "User login successful.", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req?.user._id,
    { $set: { refreshToken: undefined } },
    { new: true },
  );
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      message: "User logged out successfully!",
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(201)
    .json(new ApiResponse(200, "User Fetched successfully!", req.user));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);
  if (!avatar.url) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Profile picture updated successfully", updatedUser),
    );
});

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user._id;

    if (!name || !email || !phone) {
      throw new ApiError(400, "All fields are required");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, // 1️⃣ ID comes first
      { $set: { name, email, phone } }, // 2️⃣ Update object second
      { new: true }, // 3️⃣ Options third
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }
    await User.findByIdAndUpdate(
      userId,
      { $set: { password: newPassword } },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});
const deleteAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAvatar,
  updateProfile,
  updatePassword,
  deleteAccount,
};

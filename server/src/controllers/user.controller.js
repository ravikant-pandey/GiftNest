import { uploadOnCloudinary } from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../utils/cookiesOption.js";
import transporter from "../config/nodemailer.js";

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

  const mailOptions = {
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Welcome To GiftNest! 🎉",
    html: `
  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background: #f4f6f8; padding: 20px 0"
    >
      <tr>
        <td align="center">
          <!-- Email Container -->

          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              max-width: 600px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            "
          >
            <!-- Header -->

            <tr>
              <td
                style="
                  background: linear-gradient(135deg, #2563eb, #1e40af);
                  text-align: center;
                  padding: 35px;
                "
              >
                <a href="https://giftnest.vercel.app/">
                  <img
                    src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
                    width="120"
                    alt="GiftNest Logo"
                    style="display: block; margin: auto; margin-bottom: 10px"
                  />
                </a>

                <div style="color: #ffffff; font-size: 24px; font-weight: bold">
                  Welcome to GiftNest 🎁
                </div>

                <div style="color: #dbeafe; font-size: 14px; margin-top: 6px">
                  Let's get started with something special
                </div>
              </td>
            </tr>

            <!-- Welcome Message -->

            <tr>
              <td
                style="
                  padding: 35px 35px 10px 35px;
                  color: #111;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                Hello ${name || "User"} 👋
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0 35px 20px 35px;
                  color: #444;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                Welcome to <strong>GiftNest</strong>!

                <br /><br />

                Your account has been successfully created and you're now ready
                to explore a world of thoughtful gifts for every occasion.

                <br /><br />

                Discover unique products, send surprises to loved ones, and make
                every moment memorable.
              </td>
            </tr>

            <!-- Feature Section -->

            <tr>
              <td style="padding: 0 35px 25px 35px">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #eeeeee;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 18px;
                        font-size: 14px;
                        color: #555;
                        line-height: 1.6;
                      "
                    >
                      <strong>What you can do now:</strong>

                      <br /><br />

                      🎁 Discover premium gifts
                      <br />
                      🚚 Fast and reliable delivery
                      <br />
                      💝 Perfect gifts for every occasion
                      <br />
                      🔒 Secure shopping experience
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA Button -->

            <tr>
              <td align="center" style="padding: 10px 35px 35px 35px">
                <a
                  href="https://giftnest.vercel.app"
                  style="
                    background: #2563eb;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: bold;
                    display: inline-block;
                  "
                >
                  Start Shopping
                </a>
              </td>
            </tr>

            <!-- Support Info -->

            <tr>
              <td
                style="
                  padding: 0 35px 30px 35px;
                  color: #555;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                If you did not create this account, please ignore this email or
                contact our support team.
              </td>
            </tr>

            <!-- Divider -->

            <tr>
              <td style="border-top: 1px solid #eeeeee"></td>
            </tr>

            <!-- Footer -->

            <tr>
              <td
                style="background: #f8fafc; padding: 30px; text-align: center"
              >
                <div
                  style="
                    font-size: 16px;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 6px;
                  "
                >
                  GiftNest
                </div>

                <div
                  style="
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.6;
                    margin-bottom: 18px;
                  "
                >
                  Premium gifts delivered with care.
                </div>

                <div
                  style="font-size: 13px; color: #6b7280; margin-bottom: 20px"
                >
                  Need help? Contact us anytime.<br />
                  support@giftnest.com
                </div>

                <div
                  style="
                    border-top: 1px solid #e5e7eb;
                    margin: 18px auto;
                    width: 80%;
                  "
                ></div>

                <div style="font-size: 12px; color: #9ca3af; line-height: 1.6">
                  This is an automated email from
                  <strong>GiftNest</strong>.<br />
                  Please do not reply to this message.

                  <br /><br />

                  © 2026 GiftNest. All rights reserved.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `,
  };

  await transporter.sendMail(mailOptions);

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

// sent otp for account verification
const sentVerifyOtp = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ comes from middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "User already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiryAt = Date.now() + 300000;
    await user.save();

    const mailOptions = {
      from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    // your verified sender email
      to: user.email, // recipient
      subject: "Verify Your Account - OTP Verification",
      html: `
    <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background: #f4f6f8; padding: 20px 0"
    >
      <tr>
        <td align="center">
          <!-- Email Container -->

          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              max-width: 600px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            "
          >
            <!-- Header -->

            <tr>
              <td
                style="
                  background: linear-gradient(135deg, #2563eb, #1e40af);
                  text-align: center;
                  padding: 32px;
                "
              >
                <a href="https://giftnest.vercel.app/">
                  <img
                    src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
                    width="120"
                    alt="GiftNest Logo"
                    style="display: block; margin: auto; margin-bottom: 10px"
                  />
                </a>

                <div style="color: #ffffff; font-size: 24px; font-weight: bold">
                  GiftNest
                </div>

                <div style="color: #dbeafe; font-size: 13px; margin-top: 6px">
                  Secure Account Verification
                </div>
              </td>
            </tr>

            <!-- Title -->

            <tr>
              <td
                style="
                  padding: 35px 35px 10px 35px;
                  color: #111;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                Verify Your Account
              </td>
            </tr>

            <!-- Message -->

            <tr>
              <td
                style="
                  padding: 0 35px 15px 35px;
                  color: #444;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Hello <strong>${user.name || "User"}</strong</strong>,

                <br /><br />

                Welcome to <strong>GiftNest</strong> 🎁

                <br /><br />

                To complete your account setup, please enter the verification
                code below.
              </td>
            </tr>

            <!-- OTP -->

            <tr>
              <td align="center" style="padding: 25px">
                <div
                  style="
                    font-size: 34px;
                    letter-spacing: 8px;
                    font-weight: bold;
                    color: #2563eb;
                    background: #eef2ff;
                    border: 1px solid #dbeafe;
                    padding: 16px 34px;
                    border-radius: 8px;
                    display: inline-block;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Expiry Info -->

            <tr>
              <td
                style="
                  padding: 0 35px 25px 35px;
                  color: #555;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                This verification code will expire in
                <strong>5 minutes</strong>.

                <br /><br />

                If you didn’t create a GiftNest account, you can safely ignore
                this email.
              </td>
            </tr>

            <!-- Security Tip -->

            <tr>
              <td style="padding: 0 35px 30px 35px">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #eeeeee;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 16px;
                        font-size: 13px;
                        color: #555;
                        line-height: 1.6;
                      "
                    >
                      <strong>Security Tip</strong><br />
                      Never share your verification code with anyone. GiftNest
                      will never ask for your password or verification code via
                      email.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->

            <tr>
              <td style="border-top: 1px solid #eeeeee"></td>
            </tr>

            <!-- Footer -->

            <tr>
              <td
                style="background: #f8fafc; padding: 30px; text-align: center"
              >
                <div
                  style="
                    font-size: 16px;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 6px;
                  "
                >
                  GiftNest
                </div>

                <div
                  style="
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.6;
                    margin-bottom: 18px;
                  "
                >
                  Premium gifts delivered with care.
                </div>

                <div
                  style="font-size: 13px; color: #6b7280; margin-bottom: 20px"
                >
                  Need help? Contact our support team anytime.<br />
                  support@giftnest.com
                </div>

                <div
                  style="
                    border-top: 1px solid #e5e7eb;
                    margin: 18px auto;
                    width: 80%;
                  "
                ></div>

                <div style="font-size: 12px; color: #9ca3af; line-height: 1.6">
                  This is an automated email from
                  <strong>GiftNest</strong>.<br />
                  Please do not reply to this message.

                  <br /><br />

                  © 2026 GiftNest. All rights reserved.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// verify the email with otp
const verifyEmail = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ comes from verifiedUser middleware
    const { otp } = req.body;

    // 1️⃣ Validate input
    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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

    // 3️⃣ Check OTP
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 4️⃣ Check OTP expiry
    if (user.verifyOtpExpiryAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // 5️⃣ Mark user as verified
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiryAt = 0;

    await user.save();

    // 6️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// send otp for password reset
const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiryAt = Date.now() + 300000;
    await user.save();
    const mailOptions = {
      from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
     // your verified sender email
      to: user.email, // recipient
      subject: "Reset Your Password - OTP Verification",
      html: ` <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background: #f4f6f8; padding: 20px 0"
    >
      <tr>
        <td align="center">
          <!-- Main Container -->

          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              max-width: 600px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            "
          >
            <!-- Header -->

            <tr>
              <td
                style="
                  background: linear-gradient(135deg, #2563eb, #1e40af);
                  padding: 30px;
                  text-align: center;
                "
              >
                <a href="https://giftnest.vercel.app/">
                  <img
                    src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
                    width="120"
                    alt="GiftNest Logo"
                    style="display: block; margin: auto; margin-bottom: 10px"
                  />
                </a>

                <div style="color: #ffffff; font-size: 24px; font-weight: bold">
                  GiftNest
                </div>

                <div style="color: #dbeafe; font-size: 13px; margin-top: 6px">
                  Secure Account Protection
                </div>
              </td>
            </tr>

            <!-- Title -->

            <tr>
              <td
                style="
                  padding: 35px 35px 10px 35px;
                  color: #111;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                Reset Your Password
              </td>
            </tr>

            <!-- Message -->

            <tr>
              <td
                style="
                  padding: 0 35px 10px 35px;
                  color: #444;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Hello <strong>${user.name || "User"}</strong}</strong>,

                <br /><br />

                We received a request to reset the password for your
                <strong>GiftNest</strong> account.

                <br /><br />

                Use the verification code below to reset your password.
              </td>
            </tr>

            <!-- OTP Code -->

            <tr>
              <td align="center" style="padding: 25px">
                <div
                  style="
                    font-size: 34px;
                    letter-spacing: 8px;
                    font-weight: bold;
                    color: #2563eb;
                    background: #eef2ff;
                    border: 1px solid #dbeafe;
                    padding: 16px 34px;
                    border-radius: 8px;
                    display: inline-block;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Expiry Info -->

            <tr>
              <td
                style="
                  padding: 0 35px 25px 35px;
                  color: #555;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                This verification code will expire in
                <strong>5 minutes</strong>.

                <br /><br />

                If you did not request this password reset, you can safely
                ignore this email. Your account will remain secure.
              </td>
            </tr>

            <!-- Security Notice -->

            <tr>
              <td style="padding: 0 35px 30px 35px">
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #eeeeee;
                  "
                >
                  <tr>
                    <td
                      style="
                        padding: 16px;
                        font-size: 13px;
                        color: #555;
                        line-height: 1.6;
                      "
                    >
                      <strong>Security Tip</strong><br />
                      Never share your verification code with anyone. GiftNest
                      will never ask for your password or verification code via
                      email.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->

            <tr>
              <td style="border-top: 1px solid #eeeeee"></td>
            </tr>

            <!-- Footer -->

            <tr>
              <td
                style="background: #f8fafc; padding: 30px; text-align: center"
              >
                <div
                  style="
                    font-size: 16px;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 6px;
                  "
                >
                  GiftNest
                </div>

                <div
                  style="
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.6;
                    margin-bottom: 18px;
                  "
                >
                  Premium gifts delivered with care.
                </div>

                <div
                  style="font-size: 13px; color: #6b7280; margin-bottom: 20px"
                >
                  Need help? Contact our support team anytime.<br />
                  support@giftnest.com
                </div>

                <div
                  style="
                    border-top: 1px solid #e5e7eb;
                    margin: 18px auto;
                    width: 80%;
                  "
                ></div>

                <div style="font-size: 12px; color: #9ca3af; line-height: 1.6">
                  This is an automated security email from
                  <strong>GiftNest</strong>.<br />
                  Please do not reply to this message.

                  <br /><br />

                  © 2026 GiftNest. All rights reserved.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `,
    };
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Password reset OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// reset password with otp
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(401).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp || user.resetOtp === "")
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpiryAt < Date.now())
      return res.json({ success: false, message: "OTP has expired" });
    user.password = newPassword;
    user.resetOtp = "";
    user.resetOtpExpiryAt = 0;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update the profile picture
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);
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

// update the profile
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

// update the password
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

// delete the account
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
  sentVerifyOtp,
  verifyEmail,
  sendPasswordResetOtp,
  resetPassword,
};

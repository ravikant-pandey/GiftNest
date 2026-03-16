import { Admin } from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookiesOption.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import transporter from "../config/nodemailer.js";
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

  if (!emailOrPhone) throw new ApiError(400, "Email or Phone is required.");
  if (!password) throw new ApiError(400, "Password is required.");

  const admin = await Admin.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!admin) throw new ApiError(404, "Admin not found");

  const isPasswordCorrect = await admin.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  admin.logInOtp = otp;
  admin.logInOtpExpiryAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  await admin.save();

  // Send Email
  await transporter.sendMail({
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: admin.email,
    subject: "Login Verification Code",
    html: `<body
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
                  Secure Login Verification
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
                Login Verification Code
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
                Hello <strong>${admin.name || "Admin"}</strong>,

                <br /><br />

                We detected a login attempt to your
                <strong>GiftNest</strong> account.

                <br /><br />

                Please use the verification code below to securely complete
                your login.
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

                If you did not attempt to log in, please ignore this email and
                consider securing your account.
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
                      will never ask for your OTP, password, or personal details
                      via email.
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
  </body>`,
  });

  return res.status(200).json(new ApiResponse(200, "OTP sent to your email"));
});

const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { emailOrPhone, otp } = req.body;

  if (!emailOrPhone || !otp)
    throw new ApiError(400, "Email/Phone and OTP required");

  const admin = await Admin.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!admin) throw new ApiError(404, "Admin not found");

  if (admin.logInOtpExpiryAt < Date.now())
    throw new ApiError(401, "OTP expired");

  if (admin.logInOtp !== otp) throw new ApiError(401, "Invalid OTP");

  // Clear OTP
  admin.logInOtp = "";
  admin.logInOtpExpiryAt = 0;

  await admin.save();

  // Generate JWT
  const token = await generateToken(admin._id);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, "Login successful"));
});

const resendLoginOtp = asyncHandler(async (req, res) => {
  const { emailOrPhone } = req.body;

  if (!emailOrPhone) throw new ApiError(400, "Email or phone is required");

  const admin = await Admin.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!admin) throw new ApiError(404, "Admin not found");

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  admin.logInOtp = otp;
  admin.logInOtpExpiryAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  await admin.save();

  // Send email
  await transporter.sendMail({
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: admin.email,
    subject: "Login OTP",
    html: `<body
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
                  Secure Login Verification
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
                Login Verification Code
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
                Hello <strong>${admin.name || "Admin"}</strong>,

                <br /><br />

                We detected a login attempt to your
                <strong>GiftNest</strong> account.

                <br /><br />

                Please use the verification code below to securely complete
                your login.
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

                If you did not attempt to log in, please ignore this email and
                consider securing your account.
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
                      will never ask for your OTP, password, or personal details
                      via email.
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
  </body>`,
  });

  return res.status(200).json(new ApiResponse(200, "OTP resent successfully"));
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
  verifyLoginOtp,
  resendLoginOtp,
};

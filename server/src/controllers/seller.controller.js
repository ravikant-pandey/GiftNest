import { Seller } from "../models/seller.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookiesOption.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import transporter from "../config/nodemailer.js";

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
  const seller = await Seller.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!seller) throw new ApiError(404, "Seller not found");

  const isPasswordCorrect = await seller.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid password");

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  seller.logInOtp = otp;
  seller.logInOtpExpiryAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  await seller.save();

  // Send Email
  await transporter.sendMail({
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: seller.email,
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
                  Hello <strong>${seller.store || "Seller"}</strong>,
  
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

  const seller = await Seller.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!seller) throw new ApiError(404, "Seller not found");

  if (seller.logInOtpExpiryAt < Date.now())
    throw new ApiError(401, "OTP expired");

  if (seller.logInOtp !== otp) throw new ApiError(401, "Invalid OTP");

  // Clear OTP
  seller.logInOtp = "";
  seller.logInOtpExpiryAt = 0;

  await seller.save();

  // Generate JWT
  const token = await generateToken(seller._id);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, "Login successful"));
});

const resendLoginOtp = asyncHandler(async (req, res) => {
  const { emailOrPhone } = req.body;

  if (!emailOrPhone) throw new ApiError(400, "Email or phone is required");

  const seller = await Seller.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!seller) throw new ApiError(404, "Seller not found");

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  seller.logInOtp = otp;
  seller.logInOtpExpiryAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  await seller.save();

  // Send email
  await transporter.sendMail({
    from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
    to: seller.email,
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
                Hello <strong>${seller.store || "Admin"}</strong>,

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
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { status },
      { new: true },
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Send Email based on status
    if (status === "approved") {
      await transporter.sendMail({
        from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
        to: seller.email,
        subject: "Store Approved 🎉",
        html: `<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;max-width:600px;box-shadow:0 4px 12px rgba(0,0,0,0.05)">

<tr>
<td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:30px;text-align:center">

<a href="https://seller-giftnest.vercel.app">
<img src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
width="120"
alt="GiftNest Logo"
style="display:block;margin:auto;margin-bottom:10px">
</a>

<div style="color:#ffffff;font-size:24px;font-weight:bold">GiftNest</div>

<div style="color:#dbeafe;font-size:13px;margin-top:6px">
Seller Account Notification
</div>

</td>
</tr>

<tr>
<td style="padding:35px 35px 10px 35px;color:#111;font-size:18px;font-weight:bold">
🎉 Your Store Has Been Approved
</td>
</tr>

<tr>
<td style="padding:0 35px 10px 35px;color:#444;font-size:15px;line-height:1.6">

Hello <strong>${seller.name || "Seller"}</strong>,

<br><br>

Congratulations! Your store on <strong>GiftNest</strong> has been successfully approved.

<br><br>

You can now log in to your seller dashboard and start adding products and managing orders.

</td>
</tr>

<tr>
<td align="center" style="padding:25px">

<a href="https://seller-giftnest.vercel.app"
style="font-size:16px;font-weight:bold;color:#2563eb;background:#eef2ff;border:1px solid #dbeafe;padding:14px 32px;border-radius:8px;text-decoration:none">

Open Seller Dashboard

</a>

</td>
</tr>

<tr>
<td style="padding:0 35px 25px 35px;color:#555;font-size:14px;line-height:1.6">

We’re excited to have you as a seller on GiftNest.

<br><br>

If you need help getting started, feel free to contact our support team.

</td>
</tr>

<tr>
<td style="border-top:1px solid #eeeeee"></td>
</tr>

<tr>
<td style="background:#f8fafc;padding:30px;text-align:center">

<div style="font-size:16px;font-weight:bold;color:#1f2937;margin-bottom:6px">
GiftNest
</div>

<div style="font-size:13px;color:#6b7280;line-height:1.6;margin-bottom:18px">
Premium gifts delivered with care.
</div>

<div style="font-size:13px;color:#6b7280;margin-bottom:20px">
Need help? Contact our support team anytime.<br>
support@giftnest.com
</div>

<div style="border-top:1px solid #e5e7eb;margin:18px auto;width:80%"></div>

<div style="font-size:12px;color:#9ca3af;line-height:1.6">
This is an automated email from <strong>GiftNest</strong>.<br>
Please do not reply to this message.
<br><br>
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
    }

    if (status === "rejected") {
      await transporter.sendMail({
        from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
        to: seller.email,
        subject: "Store Application Update",
        html: `<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;max-width:600px;box-shadow:0 4px 12px rgba(0,0,0,0.05)">

<tr>
<td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:30px;text-align:center">

<a href="https://seller-giftnest.vercel.app">
<img src="https://giftnest.vercel.app/assets/logo-qttZnp0a.png"
width="120"
alt="GiftNest Logo"
style="display:block;margin:auto;margin-bottom:10px">
</a>

<div style="color:#ffffff;font-size:24px;font-weight:bold">GiftNest</div>

<div style="color:#dbeafe;font-size:13px;margin-top:6px">
Seller Account Notification
</div>

</td>
</tr>

<tr>
<td style="padding:35px 35px 10px 35px;color:#111;font-size:18px;font-weight:bold">
Store Application Update
</td>
</tr>

<tr>
<td style="padding:0 35px 10px 35px;color:#444;font-size:15px;line-height:1.6">

Hello <strong>${seller.name || "Seller"}</strong>,

<br><br>

Thank you for applying to become a seller on <strong>GiftNest</strong>.

<br><br>

After reviewing your store application, we regret to inform you that it has been <strong>rejected</strong>.

<br><br>

You can contact our support team if you would like more information or wish to reapply.

</td>
</tr>

<tr>
<td style="padding:0 35px 25px 35px;color:#555;font-size:14px;line-height:1.6">

We appreciate your interest in GiftNest and wish you the best.

</td>
</tr>

<tr>
<td style="border-top:1px solid #eeeeee"></td>
</tr>

<tr>
<td style="background:#f8fafc;padding:30px;text-align:center">

<div style="font-size:16px;font-weight:bold;color:#1f2937;margin-bottom:6px">
GiftNest
</div>

<div style="font-size:13px;color:#6b7280;line-height:1.6;margin-bottom:18px">
Premium gifts delivered with care.
</div>

<div style="font-size:13px;color:#6b7280;margin-bottom:20px">
Need help? Contact our support team anytime.<br>
support@giftnest.com
</div>

<div style="border-top:1px solid #e5e7eb;margin:18px auto;width:80%"></div>

<div style="font-size:12px;color:#9ca3af;line-height:1.6">
This is an automated email from <strong>GiftNest</strong>.<br>
Please do not reply to this message.
<br><br>
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
  verifyLoginOtp,
  resendLoginOtp,
};

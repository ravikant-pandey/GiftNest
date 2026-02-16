import transporter from "../config/nodemailer.js";
import { Newsletter } from "../models/newsletter.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribe = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Check already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed 🙂",
      });
    }
    // get name if user exists
    const user = await User.findOne({ email });
    const name = user?.name || email;

    // Save new subscriber
    await Newsletter.create({ email });

    const mailOptions = {
      from: `"GiftNest" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "You’re Subscribed to GiftNest 🛒",
      html: `
  <div style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    font-family:Arial, Helvetica, sans-serif;
  ">
  
    <!-- Header -->
    <div style="
      background:#f5f5f5;
      padding:22px 26px;
      border-bottom:1px solid #e6e6e6;
      text-align:left;
    ">
      <h1 style="
        margin:0;
        font-size:28px;
        font-weight:700;
        letter-spacing:0.5px;
        line-height:1;
      ">
        <span style="color:#00B857;">Gift</span>
        <span style="color:#293D55;">Nest</span>
      </h1>
  
      <p style="margin:6px 0 0;font-size:14px;color:#555;">
        Get the best deals, right in your inbox
      </p>
    </div>
  
    <!-- Content -->
    <div style="padding:30px;color:#333333;">
      <p style="font-size:16px;margin-top:0;">
        Hi <strong>${name}</strong>,
      </p>
  
      <p style="font-size:15px;line-height:1.7;">
        Thanks for subscribing to <strong>GiftNest</strong> 🎉
        You’re now part of our community and will receive the latest updates on:
      </p>
  
      <div style="margin:22px 0;">
        <div style="background:#fff3e0;padding:14px 18px;border-radius:8px;margin-bottom:10px;font-size:14px;">
          🔥 Exclusive offers & discounts
        </div>
        <div style="background:#fff3e0;padding:14px 18px;border-radius:8px;margin-bottom:10px;font-size:14px;">
          🆕 New arrivals & product launches
        </div>
        <div style="background:#fff3e0;padding:14px 18px;border-radius:8px;font-size:14px;">
          💥 Sale alerts & shopping tips
        </div>
      </div>
  
      <div style="text-align:center;margin:32px 0;">
        <a href="https://giftnest.vercel.app"
          style="
            background:#00B857;
            color:#ffffff;
            text-decoration:none;
            padding:14px 34px;
            border-radius:30px;
            font-size:15px;
            font-weight:bold;
            display:inline-block;
          ">
          Start Shopping →
        </a>
      </div>
  
      <p style="font-size:13px;color:#666;">
        No spam — just useful updates to help you shop smarter.
      </p>
    </div>
  
    <!-- Footer -->
    <div style="
      background:#f5f5f5;
      padding:16px;
      text-align:center;
      font-size:12px;
      color:#777;
    ">
      <p style="margin:0;">© 2026 GiftNest. All rights reserved.</p>
      <p style="margin:6px 0 0;">
        You received this email because you subscribed to GiftNest updates.
      </p>
    </div>
  
  </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

export default subscribe;

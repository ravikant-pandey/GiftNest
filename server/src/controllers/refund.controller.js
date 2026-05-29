import { Refund } from "../models/refund.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Get all refunds (admin)
const fetchRefunds = asyncHandler(async (req, res) => {
  const refunds = await Refund.find();
  return res.status(200).json({
    success: true,
    refunds,
  });
});

//  Create refund request
const getRefund = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    orderId,
    amount,
    accountNumber,
    bankName,
    ifscCode,
    accountHolderName,
  } = req.body;

  // ✅ Validation
  if (
    !orderId ||
    !amount ||
    !accountNumber ||
    !bankName ||
    !ifscCode ||
    !accountHolderName
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // ✅ Order check
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // ✅ Ownership check
  if (order.user.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // ✅ Already refunded check
  const existingRefund = await Refund.findOne({ orderId });

  if (existingRefund) {
    return res.status(400).json({
      success: false,
      message: "Refund already requested",
    });
  }

  // ✅ Create refund
  const refund = await Refund.create({
    orderId,
    userId,
    amount,
    accountNumber,
    bankName,
    ifscCode,
    accountHolderName,
  });

  return res.status(201).json({
    success: true,
    message: "Refund request submitted",
    refund,
  });
});

// get refund of particular user
const getRefundOfUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 GET ALL REFUNDS
    const refunds = await Refund.find({ userId });

    return res.status(200).json({
      success: true,
      refunds, // 🔥 IMPORTANT (plural)
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// update payment status
const updateRefundStatus = asyncHandler(async (req, res) => {
  const { refundId, status } = req.body;
  const refund = await Refund.findByIdAndUpdate(
    refundId,
    { status },
    {
      new: true,
    },
  );
  return res.status(200).json({
    success: true,
    message: `Refund status updated to ${status}`,
    refund,
  });
});

export { getRefund, fetchRefunds, getRefundOfUser, updateRefundStatus};

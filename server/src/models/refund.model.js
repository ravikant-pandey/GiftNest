import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    // 🏦 Bank Details
    accountNumber: {
      type: String,
      required: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    ifscCode: {
      type: String,
      required: true,
    },

    accountHolderName: {
      type: String,
      required: true,
    },

    //  Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Refund = mongoose.model("Refund", refundSchema);

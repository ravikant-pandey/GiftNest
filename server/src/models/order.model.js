import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    
    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "STRIPE"],
      required: true,
    },

    isPaid: { type: Boolean, default: false },

    status: {
      type: String,
      default: "Order Placed",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);

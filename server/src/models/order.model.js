import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Array, // direct array store
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    address: {
      type: Object, // full address object
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "Order Placed",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);

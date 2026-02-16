import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        customeText: String,
        customeImage: String,
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    address: {
      type: Object,
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

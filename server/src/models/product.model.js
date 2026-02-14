import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    images: {
      type: [String],
      required: true,
      validate: [(val) => val.length > 0, "At least one image is required"],
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subCategory: String,

    bestseller: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);

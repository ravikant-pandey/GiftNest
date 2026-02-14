import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const sellerSchema = new Schema(
  {
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    store: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    logo: {
      type: String, // Cloudinary URL
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Admin will approve seller
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

sellerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//  Compare passwords
sellerSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

export const Seller =
  mongoose.models.Seller || mongoose.model("Seller", sellerSchema);

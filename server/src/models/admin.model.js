import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const adminSchema = new Schema(
  {
    name: {
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
      default: "",
    },

    avatar: {
      type: String, // Cloudinary URL
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//  Compare passwords
adminSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};
export const Admin = mongoose.model("Admin", adminSchema);

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath, folder = "giftnest") => {
  try {
    if (!filePath) return null;

    const originalName = filePath.split("\\").pop().split("/").pop();
    const baseName = originalName.split(".")[0];
    const uniqueCode = Date.now();
    const publicId = `${baseName}_${uniqueCode}`;

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
      chunk_size: 6_000_000, // helps with large files (6MB chunks)
      secure: true,
      public_id: publicId,
    });

    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      folder: result.folder,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error?.message || error);

    try {
      fs.unlinkSync(filePath);
    } catch {}

    return { error: error?.message || "Upload failed" }; // <-- ⛔ don't return null
  }
};

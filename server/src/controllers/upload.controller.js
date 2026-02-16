import { uploadOnCloudinary } from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const uploadCustomImage = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image?.url) {
    throw new ApiError(500, "Failed to upload image");
  }

  res.status(200).json({
    success: true,
    imageUrl: image.url,
  });
});

export { uploadCustomImage };

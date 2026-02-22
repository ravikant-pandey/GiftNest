import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "seller",
      match: { isActive: true }, // only active sellers
    });

    // populate match se inactive sellers null ho jate hain
    const filteredProducts = products.filter((p) => p.seller != null);

    return res.status(200).json({
      success: true,
      products: filteredProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// create product
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    subCategory,
    bestseller,
    stock,
  } = req.body;

  // Debug (optional)

  if (!title || !description || Number(price) < 1 || !category) {
    return res.status(400).json({
      success: false,
      message: "All required fields missing",
    });
  }

  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  // Convert form-data types
  const parsedData = {
    price: Number(price),
    stock: Number(stock),
    bestseller: bestseller === "true",
  };

  // Upload images to cloudinary
  let uploadedImages;
  try {
    const uploadPromises = files.map((file) => uploadOnCloudinary(file.path));
    uploadedImages = await Promise.all(uploadPromises);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }

  const imageUrls = uploadedImages.map((img) => img.url);

  const product = await Product.create({
    title,
    description,
    category,
    subCategory,
    images: imageUrls,
    seller: req.seller._id,
    ...parsedData,
  });

  res.status(201).json({
    success: true,
    message: "Product created",
    product,
  });
});

// get product for particular seller
const getSellerProducts = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const products = await Product.find({ seller: sellerId });
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// featured toggle
const toggleFeatured = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    product.featured = !product.featured;
    await product.save();
    return res.status(200).json({
      success: true,
      message: product.featured
        ? "Product marked as Featured"
        : "Product removed from Featured",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      price,
      category,
      subCategory,
      stock,
      bestseller,
    } = req.body;
    await Product.findByIdAndUpdate(
      { _id: productId, seller: req.seller._id },
      {
        title,
        description,
        price,
        category,
        subCategory,
        stock,
        bestseller,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get single product
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// custome search
const searchProducts = asyncHandler(async (req, res) => {
  let { keyword } = req.query;

  //  Validate keyword
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Keyword is required",
    });
  }

  keyword = keyword.trim();

  //  Escape regex special characters (security)
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  //  Base query (case-insensitive search)
  const query = {
    $or: [
      { title: { $regex: escapedKeyword, $options: "i" } },
      { description: { $regex: escapedKeyword, $options: "i" } },
      { category: { $regex: escapedKeyword, $options: "i" } },
      { subCategory: { $regex: escapedKeyword, $options: "i" } },
    ],
  };

  // If keyword is number → search exact price
  if (!isNaN(keyword)) {
    query.$or.push({ price: Number(keyword) });
  }

  // If keyword is true/false → search bestseller
  if (keyword.toLowerCase() === "true" || keyword.toLowerCase() === "false") {
    query.$or.push({
      bestseller: keyword.toLowerCase() === "true",
    });
  }

  // Execute query
  const products = await Product.find(query).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export {
  getAllProducts,
  createProduct,
  getSellerProducts,
  deleteProduct,
  toggleFeatured,
  updateProduct,
  getSingleProduct,
  searchProducts,
};

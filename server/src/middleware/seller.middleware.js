import { Seller } from "../models/seller.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
const verifySeller = asyncHandler(async (req, res, next) => {
  let token;

  // Read token from either cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please login as a seller.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find seller from decoded token
    const seller = await Seller.findById(decoded._id || decoded.id).select(
      "-password"
    );

    // If seller not found
    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "Seller not found or access revoked.",
      });
    }

    // Attach seller to request
    req.seller = seller;

    next();
  } catch (error) {
    console.error("Seller token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
});

export default verifySeller;

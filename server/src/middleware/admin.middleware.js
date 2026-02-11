import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
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
      message: "Access denied. Please login as an admin.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin from decoded token
    const admin = await Admin.findById(decoded._id || decoded.id).select(
      "-password"
    );

    // If admin not found
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Admin not found or access revoked.",
      });
    }

    // Attach admin to request
    req.admin = admin;

    next();
  } catch (error) {
    console.error("Admin token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
});

export default verifyAdmin;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { stripeWebhookHandler } from "./controllers/stripeWebhook.js";

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.post(
  "/api/v1/order/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//  Import routes
import userRoute from "./routes/user.route.js";
import sellerRoute from "./routes/seller.route.js";
import adminRoute from "./routes/admin.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import uploadRoute from "./routes/upload.route.js";
import orderRoute from "./routes/order.route.js";
import subscribeRoute from "./routes/newsletter.route.js";


//  Mount routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/seller", sellerRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/newsletter",subscribeRoute)

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
  });
});

export { app };

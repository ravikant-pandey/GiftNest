import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
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


//  Mount routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/seller", sellerRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/product", productRoute);



app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
  });
});

export { app };

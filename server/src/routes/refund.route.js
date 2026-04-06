import express from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import { fetchRefunds, getRefund, getRefundOfUser, updateRefundStatus } from "../controllers/refund.controller.js";
import verifyAdmin from "../middleware/admin.middleware.js";

const route = express.Router();

route.get("/refunds", verifyAdmin, fetchRefunds);
route.post("/get-refund", verifyJwt, getRefund);
route.get("/get-refund-of-user", verifyJwt, getRefundOfUser);
route.put("/update-refund-status", verifyAdmin, updateRefundStatus);




export default route;

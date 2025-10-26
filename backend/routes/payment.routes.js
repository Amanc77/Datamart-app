import express from "express";
import {
  createDatasetCheckout,
  verifyDatasetPayment,
  getMyPurchases,
  downloadDataset,
} from "../controllers/payment.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/checkout/dataset", isAuthenticated, createDatasetCheckout);
router.post("/verify", isAuthenticated, verifyDatasetPayment);
router.get("/purchases", isAuthenticated, getMyPurchases);
router.get("/downloads/:purchaseId", isAuthenticated, downloadDataset);

export default router;

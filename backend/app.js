import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import { createDatasets } from "./utils/SampleDatasets.js";
import datasetRoutes from "./routes/dataset.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cookieParser from "cookie-parser";
import { razorpayWebhook } from "./controllers/payment.controller.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;
connectDB();
createDatasets();

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);
app.use("/api/datasets", datasetRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("server is running..."));

app.use((err, req, res, next) => {
  console.error(`Global error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

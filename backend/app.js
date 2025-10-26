import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/auth.routes.js";
import { createDatasets } from "./utils/SampleDatasets.js";
import datasetRoutes from "./routes/dataset.routes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  })
);

const PORT = process.env.PORT;
connectDB();
createDatasets();
app.use("/api/auth", authRoutes);
app.use("/api/datasets", datasetRoutes);

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

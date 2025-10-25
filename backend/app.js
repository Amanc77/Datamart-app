import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/auth.routes.js";

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

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

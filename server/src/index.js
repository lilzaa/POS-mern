import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import customerRoutes from "./routes/customers.js";
import saleRoutes from "./routes/sales.js";
import orderRoutes from "./routes/orders.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "aurum-pos-api" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aurum_pos";

mongoose
  .connect(URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✓ API running on http://localhost:${PORT}`),
    );
  })
  .catch((e) => {
    console.error("MongoDB connection failed:", e.message);
    process.exit(1);
  });

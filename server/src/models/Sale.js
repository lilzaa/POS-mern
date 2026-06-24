import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    sku: String,
    price: Number,
    qty: Number,
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoice: { type: String, required: true, unique: true },
    customer: { type: String, default: "Walk-in" },
    items: [saleItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ["completed", "pending", "refunded"], default: "completed" },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);

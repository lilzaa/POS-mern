import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: true,
    },

    customerId: {
      type: String,
      default: null,
    },

    customerName: {
      type: String,
      default: "Walk-in Customer",
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    subtotal: Number,
    tax: Number,
    total: Number,

    status: {
      type: String,
      default: "Completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
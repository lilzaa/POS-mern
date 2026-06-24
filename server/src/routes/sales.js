import { Router } from "express";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);

r.get("/", async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    res.json(await Sale.find(filter).sort("-createdAt").limit(500));
  } catch (e) { next(e); }
});

r.get("/analytics", async (_req, res, next) => {
  try {
    const last7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const rows = await Sale.aggregate([
      { $match: { createdAt: { $gte: last7 }, status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(rows);
  } catch (e) { next(e); }
});

r.post("/", async (req, res, next) => {
  try {
    const { customer = "Walk-in", items, tax = 0 } = req.body;
    if (!items?.length) return res.status(400).json({ message: "Cart is empty" });

    const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
    const total = +(subtotal + tax).toFixed(2);
    const invoice = `INV-${Date.now().toString().slice(-6)}`;

    const sale = await Sale.create({
      invoice,
      customer,
      items,
      subtotal: +subtotal.toFixed(2),
      tax,
      total,
      cashier: req.user._id,
    });

    await Promise.all(
      items
        .filter((i) => i.product)
        .map((i) =>
          Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } })
        )
    );

    if (customer && customer !== "Walk-in") {
      await Customer.findOneAndUpdate(
        { name: customer },
        { $inc: { totalSpent: total, orders: 1 } }
      );
    }

    res.status(201).json(sale);
  } catch (e) { next(e); }
});

r.patch("/:id/refund", async (req, res, next) => {
  try {
    res.json(await Sale.findByIdAndUpdate(req.params.id, { status: "refunded" }, { new: true }));
  } catch (e) { next(e); }
});

export default r;

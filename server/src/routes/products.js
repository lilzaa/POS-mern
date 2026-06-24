import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);


// # 📌 GET ALL PRODUCTS
r.get("/", async (req, res, next) => {
  try {
    const { q, category } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { sku: new RegExp(q, "i") },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort("-createdAt");
    res.json(products);
  } catch (e) {
    next(e);
  }
});


// # 📌 GET SINGLE PRODUCT (optional but good)
r.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (e) {
    next(e);
  }
});


// # 📌 CREATE PRODUCT

r.post("/", async (req, res) => {
  try {

    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (e) {

    if (e.code === 11000) {
      return res.status(400).json({
        message: "SKU already exists. Use another SKU."
      });
    }

    res.status(500).json({
      message: "Something went wrong"
    });

  }
});

// r.post("/", async (req, res, next) => {
//   try {
//     const { name, sku, category, price, stock, image } = req.body;

//     if (!name || !sku || !category)
//       return res.status(400).json({ message: "Missing fields" });

//     const product = await Product.create({
//       name,
//       sku,
//       category,
//       price,
//       stock,
//       image,
//     });

//     res.status(201).json(product);
//   } catch (e) {
//     next(e);
//   }
// });


// # 📌 UPDATE PRODUCT
r.put("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (e) {
    next(e);
  }
});


// # 📌 DELETE PRODUCT
r.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted", ok: true });
  } catch (e) {
    next(e);
  }
});

export default r;
import { Router } from "express";
import Category from "../models/Category.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

r.use(requireAuth);

r.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort("-createdAt");

    res.json(categories);
  } catch (e) {
    res.status(500).json({
      message: "Failed",
    });
  }
});

r.post("/", async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

r.put("/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

r.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      ok: true,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

export default r;

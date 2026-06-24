import { Router } from "express";
import Customer from "../models/Customer.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);


r.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;

    const filter = q
      ? {
          $or: [
            { name: new RegExp(q, "i") },
            { email: new RegExp(q, "i") },
          ],
        }
      : {};

    const data = await Customer.find(filter).sort("-createdAt");
    res.json(data);
  } catch (e) {
    next(e);
  }
});

r.post("/", async (req, res, next) => {
  try {
    const data = await Customer.create(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

r.put("/:id", async (req, res, next) => {
  try {
    const data = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
});

r.delete("/:id", async (req, res, next) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default r;
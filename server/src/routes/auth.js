import { Router } from "express";
import User from "../models/User.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const r = Router();

/* SIGNUP */
r.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
});

/* LOGIN */
r.post("/login", async (req, res, next) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.compare(password);

    if (!ok)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
});

/* ME */
r.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default r;
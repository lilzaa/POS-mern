import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Customer from "./models/Customer.js";
import bcrypt from "bcryptjs";

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aurum_pos";

const categories = [
  {
    name: "Beverages",
    description: "Coffee, tea & cold drinks",
    color: "from-emerald-400/30 to-teal-500/20",
  },
  {
    name: "Bakery",
    description: "Fresh breads & pastries",
    color: "from-amber-400/30 to-orange-500/20",
  },
  {
    name: "Electronics",
    description: "Gadgets & accessories",
    color: "from-sky-400/30 to-indigo-500/20",
  },
  {
    name: "Apparel",
    description: "Clothing & footwear",
    color: "from-rose-400/30 to-pink-500/20",
  },
  {
    name: "Grocery",
    description: "Daily essentials",
    color: "from-lime-400/30 to-green-500/20",
  },
  {
    name: "Stationery",
    description: "Paper, pens & office",
    color: "from-violet-400/30 to-purple-500/20",
  },
];

const emoji = [
  "☕",
  "🥐",
  "🎧",
  "👟",
  "🍫",
  "📒",
  "🍷",
  "🥑",
  "🧴",
  "📱",
  "🕶️",
  "🧣",
];
const names = [
  "Artisan Espresso",
  "Sourdough Loaf",
  "Wireless Earbuds",
  "Premium Sneakers",
  "Dark Chocolate Bar",
  "Leather Notebook",
  "Cabernet Reserve",
  "Organic Avocado",
  "Aroma Diffuser",
  "Smartphone Pro",
  "Polarized Shades",
  "Cashmere Scarf",
];

async function run() {
  await mongoose.connect(URI);
  console.log("✓ Connected");

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Customer.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  console.log("HASH:", hashedPassword);

  await User.create({
    name: "Aria Patel",
    email: "admin@aurum.pos",
    password: "admin123",
    role: "admin",
  });
  console.log("✓ Admin user: admin@aurum.pos / admin123");

  await Category.insertMany(categories);
  await Product.insertMany(
    names.map((n, i) => ({
      name: n,
      sku: `SKU-${1000 + i}`,
      category: categories[i % categories.length].name,
      price: Math.round((9.99 + i * 7.3) * 100) / 100,
      stock: [3, 24, 0, 12, 42, 7, 56, 18, 2, 31, 9, 14][i],
      image: emoji[i % emoji.length],
    })),
  );
  await Customer.insertMany([
    {
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      phone: "+92 300 1234567",
      totalSpent: 4820,
      orders: 23,
    },
    {
      name: "Daniel Reyes",
      email: "daniel@example.com",
      phone: "+1 415 555 9821",
      totalSpent: 12480,
      orders: 41,
    },
    {
      name: "Mei Lin",
      email: "mei.lin@example.com",
      phone: "+65 8123 4567",
      totalSpent: 980,
      orders: 6,
    },
  ]);

  console.log("✓ Seed complete");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

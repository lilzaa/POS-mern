export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  productCount: number;
  color: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  orders: number;
  joined: string;
};

export type Sale = {
  id: string;
  invoice: string;
  customer: string;
  items: number;
  total: number;
  status: "completed" | "pending" | "refunded";
  date: string;
};

export const categories: Category[] = [
  { id: "c1", name: "Beverages", description: "Coffee, tea & cold drinks", productCount: 24, color: "from-emerald-400/30 to-teal-500/20" },
  { id: "c2", name: "Bakery", description: "Fresh breads & pastries", productCount: 18, color: "from-amber-400/30 to-orange-500/20" },
  { id: "c3", name: "Electronics", description: "Gadgets & accessories", productCount: 42, color: "from-sky-400/30 to-indigo-500/20" },
  { id: "c4", name: "Apparel", description: "Clothing & footwear", productCount: 36, color: "from-rose-400/30 to-pink-500/20" },
  { id: "c5", name: "Grocery", description: "Daily essentials", productCount: 51, color: "from-lime-400/30 to-green-500/20" },
  { id: "c6", name: "Stationery", description: "Paper, pens & office", productCount: 22, color: "from-violet-400/30 to-purple-500/20" },
];

const emoji = ["☕","🥐","🎧","👟","🍫","📒","🍷","🥑","🧴","📱","🕶️","🧣"];

export const products: Product[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: [
    "Artisan Espresso","Sourdough Loaf","Wireless Earbuds","Premium Sneakers",
    "Dark Chocolate Bar","Leather Notebook","Cabernet Reserve","Organic Avocado",
    "Aroma Diffuser","Smartphone Pro","Polarized Shades","Cashmere Scarf",
    "Cold Brew Bottle","Croissant","Bluetooth Speaker","Running Shoes",
    "Truffle Box","Fountain Pen",
  ][i],
  sku: `SKU-${1000 + i}`,
  category: categories[i % categories.length].name,
  price: Math.round((9.99 + i * 7.3) * 100) / 100,
  stock: [3, 24, 0, 12, 42, 7, 56, 18, 2, 31, 9, 14, 22, 5, 38, 11, 27, 4][i],
  image: emoji[i % emoji.length],
}));

export const customers: Customer[] = [
  { id: "u1", name: "Ayesha Khan", email: "ayesha@example.com", phone: "+92 300 1234567", totalSpent: 4820, orders: 23, joined: "2024-08-12" },
  { id: "u2", name: "Daniel Reyes", email: "daniel@example.com", phone: "+1 415 555 9821", totalSpent: 12480, orders: 41, joined: "2023-11-02" },
  { id: "u3", name: "Mei Lin", email: "mei.lin@example.com", phone: "+65 8123 4567", totalSpent: 980, orders: 6, joined: "2025-02-14" },
  { id: "u4", name: "Omar Siddiqui", email: "omar@example.com", phone: "+971 50 222 1188", totalSpent: 7350, orders: 19, joined: "2024-05-30" },
  { id: "u5", name: "Sophia Müller", email: "sophia@example.com", phone: "+49 151 234 5678", totalSpent: 2210, orders: 11, joined: "2025-01-09" },
  { id: "u6", name: "Liam O'Connor", email: "liam@example.com", phone: "+353 86 999 4422", totalSpent: 540, orders: 3, joined: "2025-04-21" },
];

export const sales: Sale[] = [
  { id: "s1", invoice: "INV-10293", customer: "Ayesha Khan", items: 4, total: 184.5, status: "completed", date: "2026-06-20" },
  { id: "s2", invoice: "INV-10292", customer: "Daniel Reyes", items: 2, total: 92.0, status: "completed", date: "2026-06-20" },
  { id: "s3", invoice: "INV-10291", customer: "Walk-in", items: 1, total: 24.5, status: "completed", date: "2026-06-19" },
  { id: "s4", invoice: "INV-10290", customer: "Mei Lin", items: 6, total: 312.75, status: "pending", date: "2026-06-19" },
  { id: "s5", invoice: "INV-10289", customer: "Omar Siddiqui", items: 3, total: 156.0, status: "completed", date: "2026-06-18" },
  { id: "s6", invoice: "INV-10288", customer: "Sophia Müller", items: 2, total: 78.25, status: "refunded", date: "2026-06-18" },
  { id: "s7", invoice: "INV-10287", customer: "Liam O'Connor", items: 5, total: 245.9, status: "completed", date: "2026-06-17" },
  { id: "s8", invoice: "INV-10286", customer: "Walk-in", items: 1, total: 19.99, status: "completed", date: "2026-06-17" },
];

export const salesChart = [
  { day: "Mon", sales: 1240, orders: 18 },
  { day: "Tue", sales: 1890, orders: 24 },
  { day: "Wed", sales: 1520, orders: 21 },
  { day: "Thu", sales: 2410, orders: 32 },
  { day: "Fri", sales: 3120, orders: 41 },
  { day: "Sat", sales: 3890, orders: 52 },
  { day: "Sun", sales: 2980, orders: 38 },
];

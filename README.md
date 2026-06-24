# Aurum POS — MERN Stack

A premium, dark-luxury **Point of Sale** system built with the **MERN stack**: MongoDB, Express, React (Vite), and Node.js.

## Stack

- **Frontend** — React 19 + Vite + React Router + Tailwind CSS v4 + Framer Motion + Recharts + shadcn/ui
- **Backend** — Node.js + Express + Mongoose
- **Database** — MongoDB
- **Auth** — JWT (signup/login, role-based: admin/cashier)

## Project structure

```
aurum-pos-mern/
├── client/   # React frontend (Vite)
└── server/   # Express + MongoDB API
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## 1) Backend setup

```bash
cd server
cp .env.example .env       # edit MONGODB_URI and JWT_SECRET
npm install
npm run seed               # creates admin@aurum.pos / admin123 + sample data
npm run dev                # API on http://localhost:5000
```

### API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register (first user becomes admin) |
| POST | `/api/auth/login`  | Login, returns JWT |
| GET  | `/api/auth/me`     | Current user |
| GET/POST/PUT/DELETE | `/api/products` | Product CRUD |
| GET/POST/PUT/DELETE | `/api/categories` | Category CRUD |
| GET/POST/PUT/DELETE | `/api/customers` | Customer CRUD |
| GET/POST | `/api/sales` | List / create sales (decrements stock) |
| GET | `/api/sales/analytics` | 7-day sales chart data |
| PATCH | `/api/sales/:id/refund` | Mark sale refunded |

All `/api/*` routes (except `/auth/*`) require `Authorization: Bearer <token>`.

## 2) Frontend setup

```bash
cd client
npm install
npm run dev               # app on http://localhost:5173
```

Vite proxies `/api/*` → `http://localhost:5000`, so the frontend talks to the API
through relative URLs.

### Default login

```
Email:    admin@aurum.pos
Password: admin123
```

## Features

- 🔐 JWT authentication (signup + login, role-based)
- 📊 Dashboard with animated stat cards, sales chart, low-stock alerts
- 🛒 POS billing — product search, category filter, cart, tax/total, receipt modal
- 📦 Product management (search, CRUD, stock tracking)
- 🏷️ Category management (gradient cards)
- 👥 Customer management (master-detail profile view)
- 🧾 Sales history with filters and analytics
- 📱 Responsive sidebar + mobile bottom navigation
- 🎨 Dark-luxury theme (emerald + gold), glassmorphism, Framer Motion animations

## Production build

```bash
cd client && npm run build      # outputs dist/
cd ../server && npm start       # serves API in production mode
```

You can host the built `client/dist` on any static host (Vercel, Netlify, Nginx)
and point it at your deployed API.

---

**License:** MIT

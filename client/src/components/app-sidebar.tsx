import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  ShoppingCart,
  Receipt,
  LogOut,
  Sparkles,
} from "lucide-react";
import { capitalizeName } from "../lib/utils";

import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "POS Billing", icon: ShoppingCart, highlight: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/sales", label: "Sales History", icon: Receipt },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // const logout = () => {
  //   localStorage.removeItem("aurum_token");
  //   localStorage.removeItem("aurum_user");
  //   navigate("/login");
  // };

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl">
      <div className="px-6 pt-7 pb-8">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl shadow-glow"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold font-[var(--font-display)] gradient-text">
              Aurum POS
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Premium Suite
            </div>
          </div>
        </Link>
      </div>

      <nav className="px-3 flex-1 space-y-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="relative block">
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl border border-primary/30"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.16 162 / 0.18), oklch(0.72 0.16 162 / 0.05))",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative h-4.5 w-4.5 ${active ? "text-primary" : ""}`}
                />
                <span className="relative">{item.label}</span>
                {item.highlight && !active && (
                  <span className="relative ml-auto rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-gold">
                    NEW
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl p-4 glass">
        <div className="text-xs text-muted-foreground">Signed in as</div>
        <div className="mt-0.5 font-semibold">{capitalizeName(user?.name)}</div>
        <button
          onClick={logout}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
        {/* <Link
          to="/login"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </Link> */}
      </div>
    </aside>
  );
}

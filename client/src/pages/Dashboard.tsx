import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/page-shell";
import { products, sales, salesChart } from "@/lib/mock-data";

function Dashboard() {
  const totalSales = sales.reduce((a, s) => a + s.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5);

  const stats = [
    {
      label: "Total Sales",
      value: totalSales,
      prefix: "$",
      icon: DollarSign,
      change: "+12.4%",
      grad: "var(--gradient-primary)",
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      change: "+3 new",
      grad: "linear-gradient(135deg, oklch(0.65 0.18 260), oklch(0.55 0.15 220))",
    },
    {
      label: "Total Customers",
      value: 1284,
      icon: Users,
      change: "+8.2%",
      grad: "var(--gradient-gold)",
    },
    {
      label: "Total Orders",
      value: sales.length * 38,
      icon: ShoppingBag,
      change: "+18.0%",
      grad: "linear-gradient(135deg, oklch(0.65 0.18 25), oklch(0.55 0.18 350))",
    },
  ];

  return (
    <PageShell
      title="Dashboard"
      subtitle="A snapshot of your store performance today."
      actions={
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="rounded-full px-3 py-1.5 bg-primary/10 text-primary border border-primary/20">
            Live
          </span>
          <span className="text-muted-foreground">Updated just now</span>
        </div>
      }
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      {/* Chart + Low stock */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 glass rounded-3xl p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sales overview</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <TrendingUp className="h-3.5 w-3.5" /> +24.6% vs last week
            </div>
          </div>
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesChart}
                margin={{ left: -10, right: 10, top: 10 }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.16 162)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.72 0.16 162)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(1 0 0 / 0.05)"
                />
                <XAxis
                  dataKey="day"
                  stroke="oklch(0.68 0.02 250)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.68 0.02 250)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.014 250)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "oklch(0.96 0.005 250)" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="oklch(0.72 0.16 162)"
                  strokeWidth={2.5}
                  fill="url(#grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-warning/15 text-warning">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="font-semibold">Low stock alerts</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {lowStock.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-background text-xl">
                  {p.image}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {p.sku}
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold ${p.stock === 0 ? "text-destructive" : "text-warning"}`}
                >
                  {p.stock === 0 ? "Out" : `${p.stock} left`}
                </div>
              </div>
            ))}
            {!lowStock.length && (
              <p className="text-sm text-muted-foreground">
                All inventory healthy.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 glass rounded-3xl overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent transactions</h3>
            <p className="text-xs text-muted-foreground">
              Latest orders processed in your store
            </p>
          </div>
          <button className="hidden md:inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
                <th className="text-left font-medium px-6 py-3">Invoice</th>
                <th className="text-left font-medium px-6 py-3">Customer</th>
                <th className="text-left font-medium px-6 py-3">Items</th>
                <th className="text-left font-medium px-6 py-3">Status</th>
                <th className="text-right font-medium px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 6).map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border hover:bg-secondary/30 transition"
                >
                  <td className="px-6 py-3.5 font-mono text-xs">{s.invoice}</td>
                  <td className="px-6 py-3.5">{s.customer}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">
                    {s.items}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold">
                    ${s.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  prefix,
  icon: Icon,
  change,
  grad,
  delay,
}: any) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => {
    const n = Math.round(v);
    return prefix === "$" ? `$${n.toLocaleString()}` : n.toLocaleString();
  });
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    return c.stop;
  }, [value, mv]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl opacity-30 transition group-hover:opacity-50"
        style={{ background: grad }}
      />
      <div className="relative flex items-center justify-between">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl shadow-glow"
          style={{ background: grad }}
        >
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
          {change}
        </span>
      </div>
      <div className="relative mt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <motion.div className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
          {rounded}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function StatusPill({
  status,
}: {
  status: "completed" | "pending" | "refunded";
}) {
  const cfg = {
    completed: "bg-primary/15 text-primary border-primary/25",
    pending: "bg-gold/15 text-gold border-gold/25",
    refunded: "bg-destructive/15 text-destructive border-destructive/25",
  }[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${cfg}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}

export default Dashboard;

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, Download, Search, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { PageShell } from "@/components/page-shell";

const StatusPill = ({ children }: any) => (
  <span className="px-3 py-1 rounded-full text-xs">{children}</span>
);

function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);

  const [filter, setFilter] = useState<
    "all" | "completed" | "pending" | "refunded"
  >("all");

  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.log(err));
  }, []);

  const salesChart = sales.map((item: any) => ({
    day: new Date(item.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    }),

    sales: item.total,
  }));

  const list = sales.filter(
    (s) =>
      (filter === "all" || s.status === filter) &&
      s.invoice.toLowerCase().includes(q.toLowerCase()),
  );

  const revenue = list.reduce(
    (a, s) => a + (s.status !== "refunded" ? s.total : 0),
    0,
  );

  return (
    <PageShell
      title="Sales History"
      subtitle="Browse every transaction and uncover trends."
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-border hover:bg-secondary">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-5">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Revenue
          </div>

          <div className="mt-1 text-3xl font-bold gradient-text">
            ${revenue.toFixed(2)}
          </div>

          <div className="mt-1 text-xs text-primary flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +24.6% vs last week
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Transactions
          </div>

          <div className="mt-1 text-3xl font-bold">{list.length}</div>

          <div className="mt-1 text-xs text-muted-foreground">
            Average ${(revenue / Math.max(list.length, 1)).toFixed(2)}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 xl:col-span-1 col-span-1 sm:col-span-2 h-32">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Weekly trend
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesChart}
              margin={{ top: 5, right: 0, left: -28, bottom: -5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(1 0 0 / 0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                stroke="oklch(0.68 0.02 250)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />

              <YAxis hide />

              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.014 250)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />

              <Bar dataKey="sales" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search invoice or customer…"
            className="w-full rounded-xl bg-input/40 border border-border pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "completed", "pending", "refunded"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border capitalize transition ${
                filter === f
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}

          <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border border-border text-muted-foreground hover:text-foreground">
            <Calendar className="h-3.5 w-3.5" />
            This week
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
                <th className="text-left font-medium px-6 py-3">Invoice</th>

                <th className="text-left font-medium px-6 py-3">Date</th>

                <th className="text-left font-medium px-6 py-3">Customer</th>

                <th className="text-left font-medium px-6 py-3">Items</th>

                <th className="text-left font-medium px-6 py-3">Status</th>

                <th className="text-right font-medium px-6 py-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {list.map((s, i) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-t border-border hover:bg-secondary/30 transition"
                >
                  <td className="px-6 py-3.5 font-mono text-xs">{s.invoice}</td>

                  <td className="px-6 py-3.5 text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-3.5">Walk-in Customer</td>

                  <td className="px-6 py-3.5 text-muted-foreground">
                    {s.items.length}
                  </td>

                  <td className="px-6 py-3.5">
                    <StatusPill>{s.status}</StatusPill>
                  </td>

                  <td className="px-6 py-3.5 text-right font-semibold">
                    ${s.total.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

export default SalesPage;

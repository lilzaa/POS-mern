import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Search,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Receipt,
  X,
  Check,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { products, categories, type Product } from "@/lib/mock-data";

type CartItem = { product: Product; qty: number };

function POS() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receipt, setReceipt] = useState<{
    items: CartItem[];
    total: number;
    invoice: string;
  } | null>(null);

  const items = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          p.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, cat],
  );

  const subtotal = cart.reduce((a, c) => a + c.product.price * c.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const add = (p: Product) =>
    setCart((c) => {
      const ex = c.find((x) => x.product.id === p.id);
      return ex
        ? c.map((x) => (x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { product: p, qty: 1 }];
    });
  const update = (id: string, d: number) =>
    setCart((c) =>
      c.flatMap((x) =>
        x.product.id === id
          ? x.qty + d <= 0
            ? []
            : [{ ...x, qty: x.qty + d }]
          : [x],
      ),
    );
  const remove = (id: string) =>
    setCart((c) => c.filter((x) => x.product.id !== id));

  const checkout = () => {
    if (!cart.length) return;
    setReceipt({
      items: cart,
      total,
      invoice: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
    });
    setCart([]);
  };

  return (
    <PageShell
      title="POS Billing"
      subtitle="The fastest way to ring up a sale."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        {/* Products */}
        <div className="glass rounded-3xl p-5">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Scan or search product…"
                className="w-full rounded-xl bg-input/40 border border-border pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
            {["All", ...categories.map((c) => c.name)].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition ${cat === c ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((p) => (
              <motion.button
                key={p.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => add(p)}
                disabled={p.stock === 0}
                className="group relative text-left rounded-2xl border border-border bg-secondary/30 p-4 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.16 162 / 0.12), transparent)",
                  }}
                />
                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-background text-2xl mb-3">
                    {p.image}
                  </div>
                  <div className="text-sm font-semibold leading-tight">
                    {p.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {p.category}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="font-bold gold-text">
                      ${p.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-5 flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Current order</h3>
              <p className="text-xs text-muted-foreground">
                {cart.length} item{cart.length !== 1 && "s"}
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <div className="mt-4 flex-1 overflow-y-auto -mx-2 px-2 space-y-2 min-h-[200px]">
            <AnimatePresence initial={false}>
              {cart.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10 text-muted-foreground"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary/60 mb-3">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div className="text-sm">Tap a product to start an order</div>
                </motion.div>
              )}
              {cart.map((c) => (
                <motion.div
                  key={c.product.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 p-3"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-background text-xl">
                    {c.product.image}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {c.product.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${c.product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-background/50">
                    <button
                      onClick={() => update(c.product.id, -1)}
                      className="grid h-7 w-7 place-items-center hover:text-primary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {c.qty}
                    </span>
                    <button
                      onClick={() => update(c.product.id, +1)}
                      className="grid h-7 w-7 place-items-center hover:text-primary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(c.product.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
            <Row label="Subtotal" value={subtotal} />
            <Row label="Tax (8%)" value={tax} />
            <Row label="Total" value={total} large />
          </div>

          <motion.button
            whileHover={{ scale: cart.length ? 1.01 : 1 }}
            whileTap={{ scale: 0.99 }}
            disabled={!cart.length}
            onClick={checkout}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-primary-foreground shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-primary)" }}
          >
            <CreditCard className="h-4 w-4" /> Charge ${total.toFixed(2)}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {receipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-md p-4"
            onClick={() => setReceipt(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-7 w-full max-w-md"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="grid h-14 w-14 place-items-center rounded-full shadow-glow"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Check className="h-7 w-7 text-primary-foreground" />
                </motion.div>
                <h3 className="mt-4 text-2xl font-bold">Payment successful</h3>
                <p className="text-sm text-muted-foreground">
                  Invoice {receipt.invoice}
                </p>
              </div>
              <div className="mt-6 rounded-2xl bg-secondary/30 border border-border p-4 space-y-2 max-h-56 overflow-y-auto">
                {receipt.items.map((c) => (
                  <div
                    key={c.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {c.qty}× {c.product.name}
                    </span>
                    <span className="font-medium">
                      ${(c.product.price * c.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-lg font-bold">
                <span>Total paid</span>
                <span className="gradient-text">
                  ${receipt.total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setReceipt(null)}
                className="mt-6 w-full rounded-xl py-3 font-semibold border border-border hover:bg-secondary"
              >
                New order
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function Row({
  label,
  value,
  large,
}: {
  label: string;
  value: number;
  large?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${large ? "text-lg font-bold pt-2" : "text-muted-foreground"}`}
    >
      <span>{label}</span>
      <span className={large ? "gradient-text" : "text-foreground font-medium"}>
        ${value.toFixed(2)}
      </span>
    </div>
  );
}

export default POS;

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Filter } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import api from "../lib/api";

type Product = {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  emoji: string;
};

function Products() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    emoji: "📦",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const createProduct = async () => {
    try {
      const res = await api.post("/products", form);

      setProducts((prev) => [res.data, ...prev]);

      setOpen(false);

      setForm({
        name: "",
        sku: "",
        category: "",
        price: 0,
        stock: 0,
      });
    } catch (err: any) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  const updateProduct = async () => {
    try {
      const res = await api.put(`/products/${editId}`, form);

      setProducts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));

      setOpen(false);
      setEditId(null);
    } catch (err: any) {
      console.log(err);

      alert(err.response?.data?.message || "Update failed");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const emojis = ["💻", "📱", "👟", "👕", "☕", "📚", "🎧", "⚽", "🍔", "🧴"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = cat === "All" || p.category === cat;

      const matchSearch =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, query, cat]);

  if (loading) {
    return (
      <PageShell title="Products" subtitle="Loading products...">
        <div className="p-6 text-sm text-muted-foreground">Loading...</div>
      </PageShell>
    );
  }

  return (
    <>
      <PageShell
        title="Products"
        subtitle="Manage your catalog, pricing, and stock levels."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="h-4 w-4" /> Add product
          </button>
        }
      >
        <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full rounded-xl bg-input/40 border border-border pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

            {[
              "All",
              ...Array.from(new Set(products.map((p) => p.category))),
            ].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                  cat === c
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">SKU</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-right px-6 py-3 font-medium">Price</th>
                  <th className="text-right px-6 py-3 font-medium">Stock</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-t border-border hover:bg-secondary/30 transition"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary/60 text-xl">
                          {p.emoji || "📦"}
                        </div>
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">
                      {p.sku}
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground border border-border">
                        {p.category}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-right font-semibold">
                      ${Number(p.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <span
                        className={`text-xs font-semibold ${
                          p.stock === 0
                            ? "text-destructive"
                            : p.stock <= 5
                              ? "text-gold"
                              : "text-primary"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditId(p._id);

                            setForm({
                              name: p.name,
                              sku: p.sku,
                              category: p.category,
                              price: p.price,
                              stock: p.stock,
                              emoji: p.emoji,
                            });

                            setOpen(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageShell>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-[400px] space-y-3">
            <h2 className="text-lg font-bold">Add Product</h2>

            <input
              placeholder="Product name"
              className="w-full p-2 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="SKU"
              className="w-full p-2 border rounded"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />

            <input
              placeholder="Category"
              className="w-full p-2 border rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <div>
              <p className="text-sm mb-2">Emoji</p>

              <div className="flex gap-2 flex-wrap">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        emoji: e,
                      })
                    }
                    className={`text-2xl p-2 rounded-lg border ${
                      form.emoji === e
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <input
              placeholder="Enter price (e.g. 29.99)"
              type="number"
              className="w-full p-2 border rounded"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />

            <input
              placeholder="Enter stock quantity"
              type="number"
              className="w-full p-2 border rounded"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
            />

            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)}>Cancel</button>

              <button
                onClick={editId ? updateProduct : createProduct}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;

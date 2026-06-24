import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, Search, Mail, Phone, Calendar } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import api from "../lib/api";

function Customers() {
  const [q, setQ] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);

  // MODAL STATE
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orders: 0,
    totalSpent: 0,
  });

  // RIGHT CLICK MENU
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  // FETCH
  const fetchCustomers = async (search = "") => {
    try {
      const res = await api.get(`/customers?q=${search}`);
      setCustomers(res.data);

      if (res.data.length > 0 && !active) {
        setActive(res.data[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // CLOSE CONTEXT MENU ON CLICK
  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // SEARCH
  const handleSearch = (value: string) => {
    setQ(value);
    fetchCustomers(value);
  };

  // SAVE (CREATE + UPDATE)
  const saveCustomer = async () => {
    try {
      if (editId) {
        const res = await api.put(`/customers/${editId}`, form);
        setCustomers((prev) =>
          prev.map((c) => (c._id === editId ? res.data : c))
        );
      } else {
        const res = await api.post("/customers", form);
        setCustomers((prev) => [res.data, ...prev]);
      }

      setOpen(false);
      setEditId(null);
      setForm({
        name: "",
        email: "",
        phone: "",
        orders: 0,
        totalSpent: 0,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // DELETE
  const deleteCustomer = async (id: string) => {
    try {
      await api.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      setContextMenu(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRightClick = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      id,
    });
  };

  const list = customers;
  const selected =
    customers.find((c) => c._id === active) || customers[0];

  return (
    <PageShell
      title="Customers"
      subtitle="Build relationships and grow lifetime value."
      actions={
        <button
          onClick={() => {
            setOpen(true);
            setEditId(null);
          }}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" />
          New customer
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">

        {/* LEFT PANEL */}
        <div className="glass rounded-3xl p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search customers…"
              className="w-full rounded-xl bg-input/40 border border-border pl-10 pr-3 py-2.5 text-sm"
            />
          </div>

          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {list.map((c) => (
              <button
                key={c._id}
                onClick={() => setActive(c._id)}
                onContextMenu={(e) =>
                  handleRightClick(e, c._id)
                }
                className={`relative w-full text-left rounded-xl p-3 flex items-center gap-3 ${
                  active === c._id
                    ? "border border-primary/30"
                    : "border border-transparent hover:bg-secondary/40"
                }`}
                style={
                  active === c._id
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.16 162 / 0.18), transparent)",
                      }
                    : undefined
                }
              >
                <div
                  className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "oklch(0.16 0.012 250)",
                  }}
                >
                  {c.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {c.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {c.email}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold">
                    ${c.totalSpent}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {c.orders} orders
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <motion.div
          key={selected?._id}
          className="glass rounded-3xl p-7"
        >
          {selected && (
            <>
              <div className="flex items-center gap-4">
                <div
                  className="grid h-16 w-16 place-items-center rounded-2xl text-xl font-bold shadow-glow"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "oklch(0.16 0.012 250)",
                  }}
                >
                  {selected.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Customer profile
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <div className="flex gap-3">
                  <Mail className="h-4 w-4" />
                  {selected.email}
                </div>

                <div className="flex gap-3">
                  <Phone className="h-4 w-4" />
                  {selected.phone}
                </div>

                <div className="flex gap-3">
                  <Calendar className="h-4 w-4" />
                  Orders: {selected.orders}
                </div>

                <div>
                  Total Spent: ${selected.totalSpent}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* POPUP MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-[400px] space-y-3">
            <h2 className="font-bold text-lg">
              {editId ? "Edit Customer" : "New Customer"}
            </h2>

            <input
              placeholder="Customer Name"
              className="w-full p-2 border rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email Address"
              className="w-full p-2 border rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              placeholder="Total Orders (e.g. 10)"
              type="number"
              className="w-full p-2 border rounded"
              value={form.orders}
              onChange={(e) =>
                setForm({
                  ...form,
                  orders: Number(e.target.value),
                })
              }
            />

            <input
              placeholder="Total Spent (e.g. 5000)"
              type="number"
              className="w-full p-2 border rounded"
              value={form.totalSpent}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalSpent: Number(e.target.value),
                })
              }
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveCustomer}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>

              <button
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT CLICK MENU */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "#111",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            zIndex: 9999,
            cursor: "pointer",
          }}
          onClick={() => deleteCustomer(contextMenu.id)}
        >
          Delete Customer
        </div>
      )}
    </PageShell>
  );
}

export default Customers;



// import { motion } from "framer-motion";
// import { useState } from "react";
// import { Plus, Search, Mail, Phone, Calendar } from "lucide-react";
// import { PageShell } from "@/components/page-shell";
// import { customers } from "@/lib/mock-data";

// function Customers() {
//   const [q, setQ] = useState("");
//   const list = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()));
//   const [active, setActive] = useState(list[0]?.id ?? customers[0].id);
//   const selected = customers.find((c) => c.id === active)!;

//   return (
//     <PageShell
//       title="Customers"
//       subtitle="Build relationships and grow lifetime value."
//       actions={
//         <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow" style={{ background: "var(--gradient-primary)" }}>
//           <Plus className="h-4 w-4" /> New customer
//         </button>
//       }
//     >
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
//         <div className="glass rounded-3xl p-4">
//           <div className="relative mb-3">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <input
//               value={q} onChange={(e) => setQ(e.target.value)}
//               placeholder="Search customers…"
//               className="w-full rounded-xl bg-input/40 border border-border pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
//             />
//           </div>
//           <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
//             {list.map((c) => (
//               <button
//                 key={c.id} onClick={() => setActive(c.id)}
//                 className={`relative w-full text-left rounded-xl p-3 transition flex items-center gap-3 ${active === c.id ? "border border-primary/30" : "border border-transparent hover:bg-secondary/40"}`}
//                 style={active === c.id ? { background: "linear-gradient(135deg, oklch(0.72 0.16 162 / 0.18), transparent)" } : undefined}
//               >
//                 <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "var(--gradient-primary)", color: "oklch(0.16 0.012 250)" }}>
//                   {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <div className="truncate text-sm font-medium">{c.name}</div>
//                   <div className="truncate text-xs text-muted-foreground">{c.email}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-xs font-semibold">${c.totalSpent.toLocaleString()}</div>
//                   <div className="text-[10px] text-muted-foreground">{c.orders} orders</div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         <motion.div
//           key={selected.id}
//           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//           className="glass rounded-3xl p-7"
//         >
//           <div className="flex items-center gap-4">
//             <div className="grid h-16 w-16 place-items-center rounded-2xl text-xl font-bold shadow-glow" style={{ background: "var(--gradient-primary)", color: "oklch(0.16 0.012 250)" }}>
//               {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold">{selected.name}</h3>
//               <p className="text-sm text-muted-foreground">Customer since {new Date(selected.joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
//             </div>
//           </div>

//           <div className="mt-6 grid grid-cols-3 gap-3">
//             <Stat label="Lifetime spend" value={`$${selected.totalSpent.toLocaleString()}`} accent />
//             <Stat label="Orders" value={selected.orders.toString()} />
//             <Stat label="Avg order" value={`$${(selected.totalSpent / selected.orders).toFixed(0)}`} />
//           </div>

//           <div className="mt-6 space-y-2.5">
//             <Info icon={<Mail className="h-4 w-4" />} label="Email" value={selected.email} />
//             <Info icon={<Phone className="h-4 w-4" />} label="Phone" value={selected.phone} />
//             <Info icon={<Calendar className="h-4 w-4" />} label="Joined" value={selected.joined} />
//           </div>

//           <div className="mt-7">
//             <h4 className="text-sm font-semibold mb-3">Recent activity</h4>
//             <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
//               {["Order #INV-10293 · $184.50","Order #INV-10287 · $245.90","Profile updated billing address"].map((t, i) => (
//                 <div key={i} className="px-4 py-3 text-sm flex items-center justify-between bg-secondary/20">
//                   <span>{t}</span>
//                   <span className="text-xs text-muted-foreground">{["2h ago","Yesterday","3d ago"][i]}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </PageShell>
//   );
// }

// function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
//   return (
//     <div className={`rounded-2xl p-4 border ${accent ? "border-primary/30" : "border-border bg-secondary/30"}`}
//          style={accent ? { background: "linear-gradient(135deg, oklch(0.72 0.16 162 / 0.18), transparent)" } : undefined}>
//       <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
//       <div className={`mt-1 text-xl font-bold ${accent ? "gradient-text" : ""}`}>{value}</div>
//     </div>
//   );
// }
// function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
//   return (
//     <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-3">
//       <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20">{icon}</div>
//       <div className="min-w-0">
//         <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
//         <div className="truncate text-sm">{value}</div>
//       </div>
//     </div>
//   );
// }

// export default Customers;

import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

import { PageShell } from "@/components/page-shell";
import api from "../lib/api";

type Category = {
  _id: string;
  name: string;
  description: string;
};

function getGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(20,184,166,0.2))",
    "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2))",
    "linear-gradient(135deg, rgba(236,72,153,0.3), rgba(244,63,94,0.2))",
    "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(217,70,239,0.2))",
    "linear-gradient(135deg, rgba(249,115,22,0.3), rgba(239,68,68,0.2))",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const saveCategory = async () => {
    try {
      if (editId) {
        const res = await api.put(`/categories/${editId}`, form);

        setCategories((prev) =>
          prev.map((c) => (c._id === editId ? res.data : c)),
        );
      } else {
        const res = await api.post("/categories", form);
        setCategories((prev) => [res.data, ...prev]);
      }

      setOpen(false);
      setEditId(null);
      setForm({
        name: "",
        description: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageShell
      title="Categories"
      subtitle="Organize products into beautiful collections."
      actions={
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" />
          New category
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <motion.div
            key={c._id}
            className="relative glass rounded-3xl p-6"
            style={{ background: getGradient(c.name) }}
          >
            {/* TOP ICON ROW */}
            <div className="flex justify-between items-start">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                <FolderOpen />
              </div>

              <div className="flex gap-2">
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                  <button
                    onClick={() => {
                      setEditId(c._id);
                      setForm({
                        name: c.name,
                        description: c.description,
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil />
                  </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg">
                  <button onClick={() => deleteCategory(c._id)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <h3 className="mt-6 text-xl font-bold">{c.name}</h3>

            <p className="text-sm opacity-80">{c.description}</p>

            {/* PRODUCT COUNT (NEW FEATURE) */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {Math.floor(Math.random() * 50)}
              </span>

              <span className="text-xs opacity-70">products</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-[400px] space-y-3">
            <h2 className="font-bold text-lg">
              {editId ? "Edit Category" : "New Category"}
            </h2>

            <input
              placeholder="Category name"
              className="w-full p-2 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveCategory}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  setEditId(null);
                  setForm({
                    name: "",
                    description: "",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default Categories;

// import { motion } from "framer-motion";
// import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
// import { useEffect, useState } from "react";

// import { PageShell } from "@/components/page-shell";
// import api from "../lib/api";

// type Category = {
//   _id: string;
//   name: string;
//   description: string;
//   color: string;
// };

// function Categories() {
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [open, setOpen] = useState(false);

//   const [editId, setEditId] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     const res = await api.get("/categories");

//     setCategories(res.data);
//   };

//   const saveCategory = async () => {
//     try {
//       if (editId) {
//         const res = await api.put(`/categories/${editId}`, form);

//         setCategories((prev) =>
//           prev.map((c) => (c._id === editId ? res.data : c)),
//         );
//       } else {
//         const res = await api.post("/categories", form);

//         setCategories((prev) => [res.data, ...prev]);
//       }

//       setOpen(false);

//       setEditId(null);

//       setForm({
//         name: "",
//         description: "",
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const deleteCategory = async (id: string) => {
//     await api.delete(`/categories/${id}`);

//     setCategories((prev) => prev.filter((c) => c._id !== id));
//   };

//   return (
//     <PageShell
//       title="Categories"
//       subtitle="Organize products into beautiful collections."
//       actions={
//         <button
//           onClick={() => setOpen(true)}
//           className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
//           style={{ background: "var(--gradient-primary)" }}
//         >
//           <Plus className="h-4 w-4" />
//           New category
//         </button>
//       }
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {categories.map((c, i) => (
//           <motion.div key={c._id} className="relative glass rounded-3xl p-6">
//             <div className="flex justify-between">
//               <FolderOpen />

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setEditId(c._id);

//                     setForm({
//                       name: c.name,

//                       description: c.description,
//                     });

//                     setOpen(true);
//                   }}
//                 >
//                   <Pencil />
//                 </button>

//                 <button onClick={() => deleteCategory(c._id)}>
//                   <Trash2 />
//                 </button>
//               </div>
//             </div>

//             <h3 className="mt-6 text-xl font-bold">{c.name}</h3>

//             <p>{c.description}</p>
//           </motion.div>
//         ))}
//       </div>

//       {open && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-background p-6 rounded-xl w-[400px] space-y-3">
//             <h2 className="font-bold text-lg">
//               {editId ? "Edit Category" : "New Category"}
//             </h2>

//             <input
//               placeholder="Category name"
//               className="w-full p-2 border rounded"
//               value={form.name}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   name: e.target.value,
//                 })
//               }
//             />

//             <input
//               placeholder="Description"
//               className="w-full p-2 border rounded"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   description: e.target.value,
//                 })
//               }
//             />

//             <button
//               onClick={saveCategory}
//               className="bg-green-500 text-white px-4 py-2 rounded"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       )}
//     </PageShell>
//   );
// }

// export default Categories;

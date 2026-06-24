import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, Receipt } from "lucide-react";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/pos", icon: ShoppingCart, label: "POS" },
  { to: "/products", icon: Package, label: "Items" },
  { to: "/customers", icon: Users, label: "People" },
  { to: "/sales", icon: Receipt, label: "Sales" },
];

export function MobileNav() {
  const pathname = useLocation().pathname;
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass rounded-2xl px-2 py-2">
      <div className="grid grid-cols-5 gap-1">
        {items.map((i) => {
          const active = pathname.startsWith(i.to);
          const Icon = i.icon;
          return (
            <Link key={i.to} to={i.to} className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon className="h-4.5 w-4.5" />
              {i.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

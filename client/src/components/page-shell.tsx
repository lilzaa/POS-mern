import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({
  title, subtitle, actions, children,
}: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 md:p-10 pb-28 md:pb-10 max-w-[1500px] mx-auto"
    >
      <header className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm md:text-base text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </header>
      {children}
    </motion.div>
  );
}

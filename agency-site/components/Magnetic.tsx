"use client";

import { motion, useMotionValue, useSpring } from "motion/react";

export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });
  return (
    <motion.div
      className="inline-block"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Button({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "white" | "lemon" }) {
  const styles = { primary: "bg-cobalt text-white", white: "bg-white text-ink", lemon: "bg-lemon text-ink" }[variant];
  return (
    <Magnetic>
      <a href={href} className={`group lift inline-flex items-center gap-3 rounded-full border-2 border-ink px-7 py-3.5 text-sm font-bold shadow-[4px_4px_0_var(--ink)] ${styles}`}>
        {children}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </Magnetic>
  );
}

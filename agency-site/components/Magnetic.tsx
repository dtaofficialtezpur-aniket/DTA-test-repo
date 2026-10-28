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

export function Button({ href, children, variant = "dark" }: { href: string; children: React.ReactNode; variant?: "dark" | "light" | "blue" }) {
  const styles = {
    dark: "bg-ink text-white hover:bg-blue",
    blue: "bg-gradient-to-r from-blue to-sky text-white",
    light: "bg-white/80 text-ink border border-line backdrop-blur hover:bg-white",
  }[variant];
  return (
    <Magnetic>
      <a href={href} className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium shadow-lg shadow-blue/10 transition-colors ${styles}`}>
        {children}
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </Magnetic>
  );
}

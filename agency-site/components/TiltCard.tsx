"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const gx = useTransform(x, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(y, [-0.5, 0.5], [0, 100]);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(47,155,242,0.16), transparent 60%)`;

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        className={`relative ${className ?? ""}`}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glow }} />
        {children}
      </motion.div>
    </div>
  );
}

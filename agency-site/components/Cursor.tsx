"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const ss = useSpring(scale, { stiffness: 300, damping: 22 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 14);
      y.set(e.clientY - 14);
      const t = e.target as HTMLElement | null;
      scale.set(t?.closest("a, button, input, select, textarea") ? 2.2 : 1);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y, scale]);

  return <motion.div className="cursor-ring h-7 w-7 rounded-full border-2 border-ink bg-lemon/70" style={{ x: sx, y: sy, scale: ss }} aria-hidden />;
}

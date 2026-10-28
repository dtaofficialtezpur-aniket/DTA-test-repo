"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg" aria-hidden>
      <div className="blob blob-a -left-40 -top-40 h-[34rem] w-[34rem] bg-ice" />
      <div className="blob blob-b -right-40 top-1/4 h-[30rem] w-[30rem] bg-violet/50" />
      <div className="blob blob-c -bottom-40 left-1/4 h-[32rem] w-[32rem] bg-sky/30" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(10,21,48,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
    </div>
  );
}

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const ss = useSpring(scale, { stiffness: 300, damping: 22 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 16);
      y.set(e.clientY - 16);
      const t = e.target as HTMLElement | null;
      scale.set(t?.closest("a, button, input, select, textarea") ? 2 : 1);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y, scale]);

  return (
    <motion.div className="cursor-ring h-8 w-8 rounded-full border border-blue/60 bg-sky/10 mix-blend-multiply" style={{ x: sx, y: sy, scale: ss }} aria-hidden />
  );
}

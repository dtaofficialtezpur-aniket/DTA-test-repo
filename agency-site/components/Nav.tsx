"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { brand, nav } from "@/lib/content";

export function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-display text-xl font-bold tracking-tight">
          {brand.name}<span className="text-accent-2">.</span>
        </a>
        <nav className="hidden gap-8 text-sm text-muted md:flex" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg transition hover:bg-accent-2">
          Let&apos;s talk
        </a>
      </div>
      <motion.div style={{ scaleX }} className="h-px origin-left bg-gradient-to-r from-accent to-accent-2" />
    </header>
  );
}

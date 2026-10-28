"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { nav } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 -rotate-6 place-items-center rounded-lg border-2 border-ink bg-cobalt font-display text-lg font-extrabold text-white shadow-[2px_2px_0_var(--ink)]">D</span>
          <span className="font-display text-xl font-extrabold tracking-tight">DTA</span>
          <span className="hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60 xl:inline">Digital · Trading · Accounts</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-lemon">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="lift hidden whitespace-nowrap rounded-full border-2 border-ink bg-cobalt px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_var(--ink)] sm:block">
            Free consultation
          </a>
          <button className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-lemon md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <motion.div style={{ scaleX }} className="h-1 origin-left bg-cobalt" />
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t-2 border-ink bg-paper md:hidden">
            <div className="p-3">
              {[...nav, { label: "Free consultation", href: "#contact" }].map((n) => (
                <a key={n.href + n.label} href={n.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-semibold hover:bg-lemon">
                  {n.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

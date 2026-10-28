"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { nav } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
          DTA<span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-ink">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden rounded-full border border-ink/15 px-5 py-2 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white sm:block">
            Free consultation
          </a>
          <button className="grid h-10 w-10 place-items-center md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden md:hidden">
            <div className="px-6 pb-4">
              {[...nav, { label: "Free consultation", href: "#contact" }].map((n) => (
                <a key={n.href + n.label} href={n.href} onClick={() => setOpen(false)} className="block border-t border-line py-3 text-sm">{n.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

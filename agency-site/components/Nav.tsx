"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { nav } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);
  const { scrollY } = useScroll();

  const measure = (y: number) => {
    setScrolled(y > 24);
    const hero = document.getElementById("top");
    if (!hero) return setDark(false);
    const r = hero.getBoundingClientRect();
    // the hero fades to a light page in its last 6% of scroll, so the nav switches theme with it
    setDark(-r.top / Math.max(1, r.height - window.innerHeight) < 0.94);
  };
  useMotionValueEvent(scrollY, "change", measure);

  const fg = dark ? "text-white" : "text-ink";
  const sub = dark ? "text-white/70 hover:text-white" : "text-muted hover:text-ink";
  const bar = dark ? "bg-white" : "bg-ink";
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? (dark ? "border-b border-white/10 bg-[#060B16]/75 backdrop-blur-xl" : "border-b border-line bg-bg/80 backdrop-blur-xl") : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className={`flex items-baseline gap-1 text-lg font-semibold tracking-tight ${fg}`}>
          DTA<span className="h-1.5 w-1.5 rounded-full bg-[#2f9bf2]" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={`text-sm transition-colors ${sub}`}>{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className={`hidden rounded-full border px-5 py-2 text-sm font-medium transition-colors sm:block ${dark ? "border-white/30 text-white hover:bg-white hover:text-[#060B16]" : "border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white"}`}>
            Free consultation
          </a>
          <button className="grid h-11 w-11 place-items-center md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 transition-transform ${bar} ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 transition-transform ${bar} ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden md:hidden">
            <div className="px-6 pb-4">
              {[...nav, { label: "Free consultation", href: "#contact" }].map((n) => (
                <a key={n.href + n.label} href={n.href} onClick={() => setOpen(false)} className={`block border-t py-3 text-sm ${dark ? "border-white/10 text-white" : "border-line text-ink"}`}>{n.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { brand, nav } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <>
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-blue via-sky to-violet" />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 px-4"
      >
        <div className="glass mx-auto flex h-14 max-w-4xl gap-4 items-center justify-between rounded-full pl-6 pr-2">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            {brand.name}
            <span className="ml-2 hidden whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-muted xl:inline">Digital · Trading · Accounts</span>
          </a>
          <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Primary">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-muted transition-colors hover:bg-white hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue sm:block">
              Free consultation
            </a>
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-white md:hidden"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-ink transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              className="glass mx-auto mt-2 max-w-4xl rounded-3xl p-3 md:hidden"
            >
              {[...nav, { label: "Free consultation", href: "#contact" }].map((n) => (
                <a key={n.href + n.label} href={n.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-ink hover:bg-white">
                  {n.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

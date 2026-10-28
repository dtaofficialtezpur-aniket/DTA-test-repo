"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { brand } from "@/lib/content";
import { Button } from "./Magnetic";
import { SplitText } from "./Text";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

function Chip({ className, delay, children, drift = 10 }: { className: string; delay: number; children: React.ReactNode; drift?: number }) {
  return (
    <motion.div
      className={`glass absolute z-10 rounded-2xl p-4 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: [0, -drift, 0] }}
      transition={{ opacity: { delay, duration: 0.6 }, scale: { delay, duration: 0.6 }, y: { delay, duration: 5 + delay, repeat: Infinity, ease: "easeInOut" } }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const fade = useTransform(scrollY, [0, 600], [1, 0]);
  const textY = useTransform(scrollY, [0, 700], [0, -60]);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div style={{ y, opacity: fade }} className="absolute inset-0">
        <Scene3D />
      </motion.div>

      {/* floating glass UI chips (mirrors the CRM/ERP, GST and growth story) */}
      <Chip className="right-[6%] top-[22%] hidden lg:block" delay={1.4} drift={12}>
        <p className="text-[11px] uppercase tracking-widest text-muted">Monthly revenue</p>
        <p className="font-display text-2xl font-bold">₹ 24.6L <span className="text-sm text-emerald-500">▲ 18%</span></p>
        <svg viewBox="0 0 120 32" className="mt-2 h-8 w-32" fill="none">
          <motion.path d="M2 28 C20 24 26 10 44 14 S72 24 86 10 108 6 118 4" stroke="#2f9bf2" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 1.6, repeat: Infinity, repeatDelay: 2 }} />
        </svg>
      </Chip>
      <Chip className="right-[30%] bottom-[16%] hidden lg:block" delay={1.7} drift={8}>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
          <div>
            <p className="text-sm font-semibold">GST filed on time</p>
            <p className="text-xs text-muted">TDS reconciled · ITR submitted</p>
          </div>
        </div>
      </Chip>
      <Chip className="right-[4%] bottom-[26%] hidden xl:block" delay={2} drift={14}>
        <p className="text-[11px] uppercase tracking-widest text-muted">New lead</p>
        <p className="text-sm font-semibold">Rahul Traders</p>
        <p className="text-xs text-sky">just now <span className="ml-1 animate-pulse">●</span></p>
      </Chip>

      <motion.div style={{ y: textY }} className="relative z-20 mx-auto w-full max-w-6xl px-5 pb-16 pt-72 sm:pt-28 sm:pb-0">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-sky" />
          </span>
          Tezpur · Bangalore
        </motion.p>
        <h1 className="font-display max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          <SplitText text={brand.headline.join(" ")} delay={0.4} gradient={[3, 4]} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 max-w-xl text-lg text-muted"
        >
          {brand.sub}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="mt-10 flex flex-wrap gap-4">
          <Button href="#contact" variant="dark">Get a custom quote</Button>
          <Button href="#departments" variant="light">See what we build</Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-widest text-muted sm:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll
        <span className="h-8 w-px bg-gradient-to-b from-muted to-transparent" />
      </motion.div>
    </section>
  );
}

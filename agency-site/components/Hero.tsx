"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { brand } from "@/lib/content";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const words = brand.tagline.split(" ");

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <motion.div style={{ y, opacity: fade }} className="absolute inset-0">
        <Scene3D />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,transparent,var(--bg))]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 inline-block rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted backdrop-blur"
        >
          Digital agency
        </motion.p>
        <h1 className="font-display max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2 pr-3 align-bottom">
              <motion.span
                className={`inline-block ${i > 3 ? "text-gradient" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-8 max-w-xl text-lg text-muted"
        >
          {brand.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#work" className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 py-3.5 font-medium text-bg transition hover:scale-105">
            See our work
          </a>
          <a href="#services" className="rounded-full border border-line px-7 py-3.5 font-medium backdrop-blur transition hover:bg-white/5">
            What we do
          </a>
        </motion.div>
      </div>
    </section>
  );
}

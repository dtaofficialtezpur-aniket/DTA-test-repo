"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { brand } from "@/lib/content";
import { Button } from "./Magnetic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (i: number) => ({ initial: { y: "112%" }, animate: { y: 0 }, transition: { delay: 0.25 + i * 0.12, duration: 0.9, ease } });

function Mask({ children }: { children: React.ReactNode }) {
  return <span className="block overflow-hidden pb-[0.12em]">{children}</span>;
}

function Sticker({ className, delay, rotate, children }: { className: string; delay: number; rotate: number; children: React.ReactNode }) {
  return (
    <motion.div
      className={`brut-sm absolute z-10 px-4 py-3 ${className}`}
      initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate, y: [0, -8, 0] }}
      transition={{ opacity: { delay }, scale: { delay, type: "spring", stiffness: 200, damping: 12 }, rotate: { delay, type: "spring" }, y: { delay: delay + 0.5, duration: 4 + delay, repeat: Infinity, ease: "easeInOut" } }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-20 pt-28 lg:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        {/* copy */}
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="brut-sm mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tang opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-tang" />
            </span>
            Tezpur · Bangalore
          </motion.p>

          <h1 className="font-display text-[3.3rem] font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-[4.6rem] lg:text-[5.3rem]">
            <Mask><motion.span className="block" {...rise(0)}>One team for</motion.span></Mask>
            <Mask>
              <motion.span className="relative z-0 inline-block" {...rise(1)}>
                <motion.span className="absolute -inset-x-2 bottom-[0.06em] top-[0.42em] -z-10 origin-left -skew-x-6 bg-lemon" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.7, ease }} />
                Digital,
              </motion.span>
            </Mask>
            <Mask>
              <motion.span className="block" {...rise(2)}>
                <span className="relative inline-block font-serif font-normal italic tracking-[-0.02em] text-cobalt">
                  Trading
                  <svg viewBox="0 0 220 14" className="absolute -bottom-1 left-0 h-3 w-full" fill="none" preserveAspectRatio="none" aria-hidden>
                    <motion.path d="M2 9 C 20 0, 36 14, 56 7 S 92 1, 112 8 S 150 14, 168 6 S 200 2, 218 8" stroke="#ff7a45" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.9 }} />
                  </svg>
                </span>{" "}
                &amp;
              </motion.span>
            </Mask>
            <Mask><motion.span className="block" {...rise(3)}>Accounts.</motion.span></Mask>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-8 max-w-md text-lg leading-relaxed text-ink/75">
            {brand.sub}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="mt-9 flex flex-wrap gap-4">
            <Button href="#contact" variant="primary">Get a custom quote</Button>
            <Button href="#departments" variant="white">See what we build</Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[["D", "bg-lilac"], ["T", "bg-lemon"], ["A", "bg-mint"]].map(([l, c]) => (
                <span key={l} className={`grid h-10 w-10 place-items-center rounded-full border-2 border-ink font-display text-sm font-extrabold ${c}`}>{l}</span>
              ))}
            </div>
            <p className="text-sm leading-snug text-ink/70"><b className="text-ink">500+ businesses</b> trust DTA<br />across Digital, Trading &amp; Accounts</p>
          </motion.div>
        </div>

        {/* 3D stage */}
        <div className="relative mx-auto w-full max-w-[34rem]">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease }}
            className="brut dots relative aspect-[1/1.05] overflow-hidden bg-[linear-gradient(160deg,#bfe3ff_0%,#e4dcff_55%,#ffe9a8_100%)]"
          >
            <Scene3D />
          </motion.div>

          {/* rotating free-offer badge */}
          <motion.div className="absolute -left-6 -top-8 z-20 hidden h-28 w-28 sm:block" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: "spring" }}>
            <svg viewBox="0 0 120 120" className="h-full w-full animate-[spin_16s_linear_infinite]" aria-hidden>
              <defs><path id="ring" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" /></defs>
              <circle cx="60" cy="60" r="58" fill="#ffd84a" stroke="#15120e" strokeWidth="2.5" />
              <text fontSize="10.5" fontWeight="800" fill="#15120e"><textPath href="#ring" textLength="272" lengthAdjust="spacing">FREE FIRST MONTH • FREE FIRST MONTH • </textPath></text>
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-2xl font-extrabold">₹0</span>
          </motion.div>

          <Sticker className="-right-3 top-10 hidden bg-white sm:block" delay={1.5} rotate={5}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/60">Monthly revenue</p>
            <p className="font-display text-xl font-extrabold">₹ 24.6L <span className="text-sm text-emerald-600">▲ 18%</span></p>
          </Sticker>
          <Sticker className="-left-4 bottom-12 bg-mint" delay={1.8} rotate={-4}>
            <p className="flex items-center gap-2 text-sm font-bold"><span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs text-white">✓</span> GST filed on time</p>
          </Sticker>
          <Sticker className="-bottom-5 right-6 bg-peach" delay={2.1} rotate={3}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink/60">New lead</p>
            <p className="text-sm font-bold">Rahul Traders <span className="ml-1 animate-pulse text-cobalt">●</span></p>
          </Sticker>
        </div>
      </div>
    </section>
  );
}

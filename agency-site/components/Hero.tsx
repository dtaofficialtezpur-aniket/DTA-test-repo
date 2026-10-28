"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { brand } from "@/lib/content";
import { Button } from "./Text";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });
const ease = [0.22, 1, 0.36, 1] as const;
const fade = (d: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.9, ease } });

const facts = [
  ["Offices", "Tezpur · Bangalore"],
  ["Clients", "500+"],
  ["Departments", "3"],
  ["Reply time", "Within 24h"],
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_40%,var(--soft),transparent_70%)]" />
      {/* 3D */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.4 }}
        className="relative mt-16 h-[22rem] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[58%]"
      >
        <Scene3D />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between px-6 pb-8 pt-4 lg:min-h-screen lg:pt-32">
        <div className="max-w-xl lg:max-w-[34rem]">
          <motion.p {...fade(0.1)} className="label mb-8 flex items-center gap-3 text-muted">
            <span className="h-px w-8 bg-accent" /> Digital · Trading · Accounts
          </motion.p>
          <motion.h1 {...fade(0.25)} className="text-[2.6rem] font-medium leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[4.1rem]">
            <span className="text-muted">One team for</span> Digital, Trading &amp; Accounts.
          </motion.h1>
          <motion.p {...fade(0.45)} className="mt-7 max-w-md text-lg leading-relaxed text-muted">{brand.sub}</motion.p>
          <motion.div {...fade(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="#contact">Get a custom quote</Button>
            <Button href="#departments" variant="line">See what we build</Button>
          </motion.div>
        </div>

        <motion.dl {...fade(0.9)} className="mt-16 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="label text-muted">{k}</dt>
              <dd className="mt-1.5 text-sm font-medium">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

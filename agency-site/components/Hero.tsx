"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "./Text";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });
const ease = [0.22, 1, 0.36, 1] as const;
const fade = (d: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 1, ease } });

const facts = [
  ["Offices", "Tezpur · Bangalore"],
  ["Clients", "500+"],
  ["Departments", "3"],
  ["Reply time", "Within 24h"],
];

export function Hero() {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const textY = useTransform(scrollY, [0, 380], [0, -50]);

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_50%_52%,var(--soft),transparent_70%)]" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1.2 }} className="absolute inset-0">
        <Scene3D />
      </motion.div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-8 pt-28 lg:pt-32">
        <motion.div style={{ opacity: textOpacity, y: textY }} className="text-center">
          <motion.p {...fade(0.1)} className="label mb-7 text-muted">— Digital · Trading · Accounts —</motion.p>
          <motion.h1 {...fade(0.25)} className="mx-auto max-w-5xl text-[2.5rem] font-medium leading-[1.03] tracking-[-0.045em] sm:text-6xl lg:text-[5.25rem]">
            <span className="text-muted">One team for</span>
            <br />
            Digital, Trading &amp; Accounts.
          </motion.h1>
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="pointer-events-auto mt-auto flex flex-wrap items-center justify-center gap-3 pb-14 pt-24">
          <motion.div {...fade(0.6)} className="flex flex-wrap items-center justify-center gap-3">
            <Button href="#contact">Get a custom quote</Button>
            <Button href="#departments" variant="line">See what we build</Button>
          </motion.div>
        </motion.div>

        <motion.dl {...fade(0.9)} className="grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-4 sm:[&>div:nth-child(2)]:text-center sm:[&>div:nth-child(3)]:text-center sm:[&>div:last-child]:text-right">
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

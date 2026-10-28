"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./Reveal";

function Word({ w, progress, range }: { w: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{w}</motion.span>;
}

/** Text that darkens word-by-word as it scrolls into view. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
    </p>
  );
}

export function Heading({ index, kicker, title, muted }: { index: string; kicker: string; title: string; muted?: string }) {
  return (
    <div className="mb-16 grid gap-6 md:grid-cols-12">
      <Reveal className="md:col-span-3">
        <p className="label text-muted"><span className="text-accent">{index}</span> — {kicker}</p>
      </Reveal>
      <Reveal className="md:col-span-9" delay={0.08}>
        <h2 className="text-3xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          {title}{muted && <span className="text-muted"> {muted}</span>}
        </h2>
      </Reveal>
    </div>
  );
}

export function Button({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "line" }) {
  return variant === "solid" ? (
    <a href={href} className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent">
      {children}<span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  ) : (
    <a href={href} className="group inline-flex items-center gap-3 px-2 py-3.5 text-sm font-medium text-ink">
      <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-accent group-hover:text-accent">{children}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

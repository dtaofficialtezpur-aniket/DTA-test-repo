"use client";

import { motion, MotionValue, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Words slide up from a mask, staggered. Words listed in `gradient` get the animated gradient. */
export function SplitText({ text, className, delay = 0, gradient = [], inView = false }: { text: string; className?: string; delay?: number; gradient?: number[]; inView?: boolean }) {
  const words = text.split(" ");
  // observe the (unclipped) wrapper, not the masked children, or the trigger never fires
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const show = inView ? seen : true;
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] pr-[0.22em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${gradient.includes(i) ? "text-gradient" : ""}`}
            initial={{ y: "115%" }}
            animate={{ y: show ? 0 : "115%" }}
            transition={{ delay: delay + i * 0.07, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Word({ w, progress, range }: { w: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{w}</motion.span>;
}

/** Text that fills in word-by-word as you scroll past it. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

export function Heading({ kicker, title, center = false }: { kicker: string; title: string; center?: boolean }) {
  return (
    <div className={`mb-14 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-blue backdrop-blur"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky" />
        {kicker}
      </motion.p>
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
        <SplitText text={title} inView />
      </h2>
    </div>
  );
}

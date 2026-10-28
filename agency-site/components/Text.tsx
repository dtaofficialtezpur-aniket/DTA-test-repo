"use client";

import { motion, MotionValue, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Words rise from a mask. `serif` lists word indices set in the italic serif accent. */
export function SplitText({ text, className, delay = 0, serif = [], inView = false }: { text: string; className?: string; delay?: number; serif?: number[]; inView?: boolean }) {
  const words = text.split(" ");
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const show = inView ? seen : true;
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.14em] pr-[0.22em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${serif.includes(i) ? "font-serif font-normal italic text-cobalt" : ""}`}
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
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">{w}</motion.span>;
}

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

export function Heading({ kicker, title, serif = [], color = "bg-lemon" }: { kicker: string; title: string; serif?: number[]; color?: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <motion.p
        initial={{ opacity: 0, rotate: -6, y: 10 }}
        whileInView={{ opacity: 1, rotate: -2, y: 0 }}
        viewport={{ once: true }}
        className={`brut-sm mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${color}`}
      >
        {kicker}
      </motion.p>
      <h2 className="font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
        <SplitText text={title} inView serif={serif} />
      </h2>
    </div>
  );
}

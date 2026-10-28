"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { departments, wa } from "@/lib/content";
import { Heading } from "./Text";
import { AccountsVisual, DigitalVisual, TradingVisual } from "./Visuals";

const visuals = [DigitalVisual, TradingVisual, AccountsVisual];
const bg = ["bg-lilac", "bg-lemon", "bg-mint"];

function StackCard({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const d = departments[i];
  const Visual = visuals[i];
  const n = departments.length;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  return (
    <div className="sticky" style={{ top: 96 + i * 20 }}>
      <motion.article style={{ scale }} className={`brut grid origin-top gap-8 p-7 md:grid-cols-2 md:p-10 ${bg[i]}`}>
        <div className="flex flex-col">
          <span className="font-display text-8xl font-extrabold leading-none text-ink/15">{d.n}</span>
          <h3 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{d.name}</h3>
          <p className="mt-3 text-ink/75">{d.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {d.items.map((it, k) => (
              <motion.li key={it} initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + k * 0.06, type: "spring" }} className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold">
                {it}
              </motion.li>
            ))}
          </ul>
          <a href={wa(`Hi DTA! I would like to know more about your ${d.name} services.`)} className="group mt-auto inline-flex items-center gap-2 pt-8 text-sm font-extrabold underline decoration-2 underline-offset-4">
            Enquire on WhatsApp <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
        <div className="brut-sm bg-paper p-5"><Visual /></div>
      </motion.article>
    </div>
  );
}

export function Departments() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="departments" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Our departments" title="Three departments. One trusted team." serif={[3, 4]} color="bg-lilac" />
      <div ref={ref} className="space-y-10 pb-10">
        {departments.map((d, i) => <StackCard key={d.name} i={i} progress={scrollYProgress} />)}
      </div>
    </section>
  );
}

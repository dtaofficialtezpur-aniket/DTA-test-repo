"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { departments, wa } from "@/lib/content";
import { AccountsVisual, DigitalVisual, TradingVisual } from "./Visuals";
import { Heading } from "./Text";

const visuals = [DigitalVisual, TradingVisual, AccountsVisual];
const tints = ["from-ice/70 to-white", "from-violet/20 to-white", "from-sky/20 to-white"];

function StackCard({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const d = departments[i];
  const Visual = visuals[i];
  const n = departments.length;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05]);
  return (
    <div className="sticky" style={{ top: 100 + i * 22 }}>
      <motion.article style={{ scale }} className={`card grid origin-top gap-8 overflow-hidden bg-gradient-to-br ${tints[i]} p-8 md:grid-cols-2 md:p-12`}>
        <div className="flex flex-col">
          <span className="font-display text-7xl font-bold text-ink/10">{d.n}</span>
          <h3 className="font-display mt-2 text-3xl font-bold sm:text-4xl">{d.name}</h3>
          <p className="mt-4 text-muted">{d.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {d.items.map((it, k) => (
              <motion.li
                key={it}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + k * 0.06 }}
                className="rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-xs font-medium"
              >
                {it}
              </motion.li>
            ))}
          </ul>
          <a href={wa(`Hi DTA! I would like to know more about your ${d.name} services.`)} className="group mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-blue">
            Enquire on WhatsApp <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
        <Visual />
      </motion.article>
    </div>
  );
}

export function Departments() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section id="departments" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Our departments" title="Three departments. One trusted team." />
      <div ref={ref} className="space-y-10 pb-10">
        {departments.map((d, i) => (
          <StackCard key={d.name} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

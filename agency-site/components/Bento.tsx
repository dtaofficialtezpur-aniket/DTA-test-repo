"use client";

import { motion } from "motion/react";
import { software } from "@/lib/content";
import { Button } from "./Magnetic";
import { Reveal } from "./Reveal";
import { Heading } from "./Text";

const loop = { repeat: Infinity, ease: "easeInOut" as const };

function Kanban() {
  const cols = [
    { t: "New", cards: ["Rahul Traders", "Sen & Co."], c: "bg-sky" },
    { t: "In talks", cards: ["Bora Foods", "Das Hardware"], c: "bg-lilac" },
    { t: "Won", cards: ["Kalita Stores"], c: "bg-mint" },
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {cols.map((col, ci) => (
        <div key={col.t} className="rounded-xl border-2 border-ink bg-paper p-2.5">
          <p className={`mb-2 inline-block rounded-full border-2 border-ink px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${col.c}`}>{col.t}</p>
          {col.cards.map((c, k) => (
            <motion.div key={c} className="mb-2 rounded-lg border-2 border-ink bg-white p-2 text-xs font-bold" animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + k * 0.5, delay: ci * 0.3 + k * 0.4, ...loop }}>
              {c}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Phone() {
  return (
    <div className="relative mx-auto mt-4 h-60 w-32 rounded-[1.6rem] border-2 border-ink bg-white p-2 shadow-[4px_4px_0_var(--ink)]">
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-ink" />
      <motion.div className="absolute inset-x-2 top-8 z-10 rounded-lg border-2 border-ink bg-lemon p-1.5 text-[10px] font-bold" animate={{ y: [-30, 0, 0, -30], opacity: [0, 1, 1, 0] }} transition={{ duration: 4, times: [0, 0.2, 0.8, 1], repeat: Infinity }}>
        New lead<br />Rahul Traders
      </motion.div>
      <div className="mt-16 space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="h-7 rounded-lg border-2 border-ink bg-sky" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
        ))}
      </div>
    </div>
  );
}

function Bars() {
  return (
    <div className="mt-4 flex h-24 items-end gap-2">
      {[55, 80, 45, 95, 65, 100, 75].map((h, i) => (
        <motion.span key={i} className="flex-1 rounded-t-lg border-2 border-b-0 border-ink bg-cobalt" animate={{ height: [`${h * 0.45}%`, `${h}%`, `${h * 0.45}%`] }} transition={{ duration: 2.6 + i * 0.15, delay: i * 0.1, ...loop }} />
      ))}
    </div>
  );
}

function Spark() {
  return (
    <div className="mt-4">
      <p className="font-display text-3xl font-extrabold">₹ 8.2L <span className="text-sm text-emerald-700">+18%</span></p>
      <svg viewBox="0 0 160 50" className="mt-2 h-14 w-full" fill="none">
        <motion.path d="M2 44 C20 40 28 18 48 24 S84 40 104 16 144 10 158 4" stroke="#15120e" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 4, times: [0, 0.5, 0.85, 1], repeat: Infinity }} />
      </svg>
    </div>
  );
}

function Toggles() {
  return (
    <div className="mt-4 space-y-2.5">
      {["Send invoice reminders", "Assign new leads", "Monthly report email"].map((t, i) => (
        <div key={t} className="flex items-center justify-between rounded-xl border-2 border-ink bg-white px-3 py-2 text-xs font-bold">
          {t}
          <motion.span className="relative h-5 w-9 rounded-full border-2 border-ink" animate={{ backgroundColor: ["#e7e1d4", "#7ee2b8", "#7ee2b8", "#e7e1d4"] }} transition={{ duration: 5, delay: i * 0.8, repeat: Infinity }}>
            <motion.span className="absolute top-[1px] h-3 w-3 rounded-full bg-ink" animate={{ left: [2, 17, 17, 2] }} transition={{ duration: 5, delay: i * 0.8, repeat: Infinity }} />
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function Pulse() {
  return (
    <div className="mt-4 flex items-center gap-4">
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-mint" />
        <span className="h-5 w-5 rounded-full border-2 border-ink bg-mint" />
      </span>
      <div className="text-xs">
        <p className="font-extrabold">Cloud hosting live</p>
        <p className="text-ink/60">Support team online · Mon–Sat</p>
      </div>
    </div>
  );
}

const layout = [
  { span: "lg:col-span-4", tone: "bg-white", visual: <Kanban /> },
  { span: "lg:col-span-2 lg:row-span-2", tone: "bg-lilac", visual: <Phone /> },
  { span: "lg:col-span-2", tone: "bg-lemon", visual: <Bars /> },
  { span: "lg:col-span-2", tone: "bg-mint", visual: <Spark /> },
  { span: "lg:col-span-3", tone: "bg-sky", visual: <Toggles /> },
  { span: "lg:col-span-3", tone: "bg-peach", visual: <Pulse /> },
];
// features order in content: CRM, Inventory, Dashboards, Automation, Mobile, Hosting
const order = [0, 4, 1, 2, 3, 5];

export function Software() {
  return (
    <section id="software" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Built around you" title="No templates. Custom from day one." serif={[2, 3, 4, 5]} color="bg-sky" />
      <Reveal><p className="-mt-8 mb-12 max-w-xl text-lg text-ink/70">{software.body}</p></Reveal>
      <div className="grid gap-6 lg:grid-cols-6">
        {order.map((fi, i) => {
          const f = software.features[fi];
          return (
            <Reveal key={f.t} delay={i * 0.06} className={layout[i].span}>
              <div className={`brut lift h-full p-6 ${layout[i].tone}`}>
                <h3 className="font-display text-xl font-extrabold tracking-tight">{f.t}</h3>
                <p className="mt-1 text-sm text-ink/70">{f.d}</p>
                {layout[i].visual}
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-12"><Button href="#contact" variant="primary">Get a custom quote</Button></div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { software } from "@/lib/content";
import { Button } from "./Magnetic";
import { Reveal } from "./Reveal";
import { Heading } from "./Text";
import { TiltCard } from "./TiltCard";

const loop = { repeat: Infinity, ease: "easeInOut" as const };

function Kanban() {
  const cols = [
    { t: "New", cards: ["Rahul Traders", "Sen & Co."], c: "bg-sky" },
    { t: "In talks", cards: ["Bora Foods", "Das Hardware"], c: "bg-violet" },
    { t: "Won", cards: ["Kalita Stores"], c: "bg-emerald-500" },
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {cols.map((col, ci) => (
        <div key={col.t} className="rounded-2xl bg-white/60 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${col.c}`} /> {col.t}
          </p>
          {col.cards.map((c, k) => (
            <motion.div
              key={c}
              className="mb-2 rounded-xl bg-white p-2.5 text-xs font-medium shadow-sm"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + k * 0.5, delay: ci * 0.3 + k * 0.4, ...loop }}
            >
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
    <div className="relative mx-auto mt-4 h-56 w-32 rounded-[1.6rem] border-4 border-ink bg-white p-2">
      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-ink" />
      <motion.div className="glass absolute inset-x-2 top-8 rounded-xl p-2 text-[10px]" animate={{ y: [-30, 0, 0, -30], opacity: [0, 1, 1, 0] }} transition={{ duration: 4, times: [0, 0.2, 0.8, 1], repeat: Infinity }}>
        <b>New lead</b><br />Rahul Traders
      </motion.div>
      <div className="mt-14 space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} className="h-7 rounded-lg bg-sky/20" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
        ))}
      </div>
    </div>
  );
}

function Bars() {
  return (
    <div className="mt-4 flex h-24 items-end gap-2">
      {[55, 80, 45, 95, 65, 100, 75].map((h, i) => (
        <motion.span key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-blue to-sky" animate={{ height: [`${h * 0.45}%`, `${h}%`, `${h * 0.45}%`] }} transition={{ duration: 2.6 + i * 0.15, delay: i * 0.1, ...loop }} />
      ))}
    </div>
  );
}

function Spark() {
  return (
    <div className="mt-4">
      <p className="font-display text-3xl font-bold">₹ 8.2L <span className="text-sm text-emerald-500">+18%</span></p>
      <svg viewBox="0 0 160 50" className="mt-2 h-14 w-full" fill="none">
        <motion.path d="M2 44 C20 40 28 18 48 24 S84 40 104 16 144 10 158 4" stroke="#2f9bf2" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 4, times: [0, 0.5, 0.85, 1], repeat: Infinity }} />
      </svg>
    </div>
  );
}

function Toggles() {
  return (
    <div className="mt-4 space-y-2.5">
      {["Send invoice reminders", "Assign new leads", "Monthly report email"].map((t, i) => (
        <div key={t} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs font-medium">
          {t}
          <motion.span className="relative h-5 w-9 rounded-full" animate={{ backgroundColor: ["#d5deee", "#2f9bf2", "#2f9bf2", "#d5deee"] }} transition={{ duration: 5, delay: i * 0.8, repeat: Infinity }}>
            <motion.span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow" animate={{ left: [2, 18, 18, 2] }} transition={{ duration: 5, delay: i * 0.8, repeat: Infinity }} />
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
        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/50" />
        <span className="h-4 w-4 rounded-full bg-emerald-500" />
      </span>
      <div className="text-xs">
        <p className="font-semibold">Cloud hosting live</p>
        <p className="text-muted">Support team online · Mon–Sat</p>
      </div>
    </div>
  );
}

const layout = [
  { span: "lg:col-span-4", visual: <Kanban /> },
  { span: "lg:col-span-2 lg:row-span-2", visual: <Phone /> },
  { span: "lg:col-span-2", visual: <Bars /> },
  { span: "lg:col-span-2", visual: <Spark /> },
  { span: "lg:col-span-3", visual: <Toggles /> },
  { span: "lg:col-span-3", visual: <Pulse /> },
];
// features order: CRM, Inventory, Dashboards, Automation, Mobile, Hosting
const order = [0, 4, 1, 2, 3, 5];

export function Software() {
  return (
    <section id="software" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Built around you" title={software.title} />
      <Reveal><p className="-mt-8 mb-12 max-w-xl text-lg text-muted">{software.body}</p></Reveal>
      <div className="grid gap-5 lg:grid-cols-6">
        {order.map((fi, i) => {
          const f = software.features[fi];
          return (
            <Reveal key={f.t} delay={i * 0.06} className={layout[i].span}>
              <TiltCard className="card h-full p-6">
                <h3 className="font-display text-xl font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted">{f.d}</p>
                {layout[i].visual}
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-12"><Button href="#contact" variant="blue">Get a custom quote</Button></div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";

const loop = { repeat: Infinity, ease: "easeInOut" as const };

export function DigitalVisual() {
  const bars = [40, 62, 48, 80, 58, 92, 70];
  return (
    <div className="relative h-full min-h-64 w-full">
      <svg viewBox="0 0 320 170" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none">
        <motion.path d="M0 150 C40 140 50 90 90 100 S150 140 190 80 260 50 320 20 L320 170 L0 170Z" fill="#bfe3ff" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, ...loop }} />
        <motion.path d="M0 150 C40 140 50 90 90 100 S150 140 190 80 260 50 320 20" stroke="#15120e" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 4, times: [0, 0.5, 0.85, 1], ...loop }} />
      </svg>
      <div className="absolute bottom-4 left-4 flex h-20 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span key={i} className="w-3.5 rounded-t border-2 border-b-0 border-ink bg-lilac" animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }} transition={{ duration: 2.4 + i * 0.2, delay: i * 0.12, ...loop }} />
        ))}
      </div>
      <motion.div className="brut-sm absolute right-2 top-2 bg-mint px-3 py-1.5 text-xs font-bold" animate={{ y: [0, -5, 0], rotate: [2, -2, 2] }} transition={{ duration: 3, ...loop }}>
        <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-ink" />
        Google Ads · Live campaign
      </motion.div>
    </div>
  );
}

export function TradingVisual() {
  const docs = [
    { t: "Trade License", s: "Approved", c: "bg-mint" },
    { t: "Digital Signature", s: "Class 3 DSC", c: "bg-sky" },
    { t: "FSSAI License", s: "Issued", c: "bg-mint" },
    { t: "GeM Registration", s: "Onboarded", c: "bg-lilac" },
  ];
  return (
    <div className="relative flex min-h-64 w-full flex-col justify-center gap-3">
      {docs.map((d, i) => (
        <motion.div
          key={d.t}
          className="brut-sm flex items-center justify-between bg-white px-4 py-3"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: i % 2 ? 18 : 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.7 }}
        >
          <motion.span className="flex items-center gap-3 text-sm font-bold" animate={{ y: [0, -3, 0] }} transition={{ duration: 3 + i * 0.4, delay: i * 0.3, ...loop }}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-xs text-white">✍</span>
            {d.t}
          </motion.span>
          <span className={`rounded-full border-2 border-ink px-3 py-0.5 text-xs font-bold ${d.c}`}>{d.s}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function AccountsVisual() {
  const rows = ["GST filed on time", "TDS reconciled", "ITR submitted", "Audit report ready"];
  return (
    <div className="relative flex min-h-64 w-full flex-col justify-center">
      <motion.p className="font-display text-6xl font-extrabold tracking-tight" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, ...loop }}>
        ₹ 24,500
      </motion.p>
      <p className="mb-5 text-sm font-semibold text-ink/60">GST return</p>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r}
            className="brut-sm flex items-center gap-3 bg-white px-4 py-2 text-sm font-semibold"
            animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, 20] }}
            transition={{ duration: 5, delay: i * 0.55, times: [0, 0.15, 0.8, 1], repeat: Infinity }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-[10px] font-extrabold">✓</span>
            {r}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

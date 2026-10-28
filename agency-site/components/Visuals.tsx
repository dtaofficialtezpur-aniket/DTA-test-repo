"use client";

import { motion } from "motion/react";

const loop = { repeat: Infinity, ease: "easeInOut" as const };

export function DigitalVisual() {
  const bars = [40, 62, 48, 80, 58, 92, 70];
  return (
    <div className="relative h-full min-h-64 w-full">
      <svg viewBox="0 0 320 170" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f9bf2" stopOpacity=".35" />
            <stop offset="1" stopColor="#2f9bf2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d="M0 150 C40 140 50 90 90 100 S150 140 190 80 260 50 320 20 L320 170 L0 170Z" fill="url(#dg)" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, ...loop }} />
        <motion.path d="M0 150 C40 140 50 90 90 100 S150 140 190 80 260 50 320 20" stroke="#0b5fcc" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 4, times: [0, 0.5, 0.85, 1], ...loop }} />
      </svg>
      <div className="absolute bottom-4 left-4 flex h-20 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span key={i} className="w-3 rounded-t bg-violet/60" animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] }} transition={{ duration: 2.4 + i * 0.2, delay: i * 0.12, ...loop }} />
        ))}
      </div>
      <motion.div className="glass absolute right-3 top-3 rounded-xl px-3 py-2 text-xs font-medium" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, ...loop }}>
        <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Google Ads · Live campaign
      </motion.div>
    </div>
  );
}

export function TradingVisual() {
  const docs = [
    { t: "Trade License", s: "Approved", c: "text-emerald-600 bg-emerald-100" },
    { t: "Digital Signature", s: "Class 3 DSC", c: "text-blue bg-ice" },
    { t: "FSSAI License", s: "Issued", c: "text-emerald-600 bg-emerald-100" },
    { t: "GeM Registration", s: "Onboarded", c: "text-violet bg-violet/15" },
  ];
  return (
    <div className="relative flex min-h-64 w-full flex-col justify-center gap-3">
      {docs.map((d, i) => (
        <motion.div
          key={d.t}
          className="glass flex items-center justify-between rounded-2xl px-4 py-3"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: i % 2 ? 24 : 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.7 }}
        >
          <motion.span className="flex items-center gap-3 text-sm font-medium" animate={{ y: [0, -3, 0] }} transition={{ duration: 3 + i * 0.4, delay: i * 0.3, ...loop }}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-xs text-white">✍</span>
            {d.t}
          </motion.span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${d.c}`}>{d.s}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function AccountsVisual() {
  const rows = ["GST filed on time", "TDS reconciled", "ITR submitted", "Audit report ready"];
  return (
    <div className="relative flex min-h-64 w-full flex-col justify-center">
      <motion.p className="font-display text-5xl font-bold" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, ...loop }}>
        ₹ <span className="text-gradient">24,500</span>
      </motion.p>
      <p className="mb-5 text-sm text-muted">GST return</p>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={r}
            className="glass flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm"
            animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, 20] }}
            transition={{ duration: 5, delay: i * 0.55, times: [0, 0.15, 0.8, 1], repeat: Infinity }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
            {r}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { brand, process, services, stats, work } from "@/lib/content";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

function Heading({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-2">{kicker}</p>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
    </Reveal>
  );
}

export function Marquee() {
  const items = ["Strategy", "Branding", "Web", "Marketing", "Content", "Growth"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line py-6" aria-hidden>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap text-3xl font-bold text-white/15">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Services" title={<>Everything your brand needs to <span className="text-gradient">stand out</span></>} />
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <TiltCard className="group h-full rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent/60">
              <span className="font-mono text-sm text-accent-2" style={{ transform: "translateZ(30px)", display: "inline-block" }}>
                {s.tag}
              </span>
              <h3 className="font-display mt-6 text-2xl font-semibold" style={{ transform: "translateZ(50px)" }}>
                {s.title}
              </h3>
              <p className="mt-3 text-muted" style={{ transform: "translateZ(20px)" }}>{s.body}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  return (
    <section id="work" className="overflow-hidden py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-5">
        <Heading kicker="Selected work" title="Projects we're proud of" />
      </div>
      <motion.div style={{ x }} className="flex gap-6 px-5">
        {work.map((w) => (
          <TiltCard
            key={w.title}
            className="relative h-[26rem] w-[18rem] shrink-0 overflow-hidden rounded-3xl border border-line sm:w-[26rem]"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 90% at 20% 10%, hsl(${w.hue} 90% 60% / .85), transparent 60%), radial-gradient(100% 80% at 90% 100%, hsl(${w.hue + 60} 90% 50% / .6), transparent 60%), var(--surface)`,
              }}
            />
            <div className="absolute bottom-0 p-7" style={{ transform: "translateZ(40px)" }}>
              <p className="text-xs uppercase tracking-widest text-white/70">{w.cat}</p>
              <h3 className="font-display text-3xl font-bold">{w.title}</h3>
            </div>
          </TiltCard>
        ))}
      </motion.div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Process" title="From first call to full launch" />
      <ol className="grid gap-5 md:grid-cols-4">
        {process.map((p, i) => (
          <Reveal key={p.step} delay={i * 0.1}>
            <li className="h-full list-none rounded-3xl border border-line p-7">
              <span className="font-display text-6xl font-bold text-white/10">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{p.step}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Stats() {
  return (
    <section className="border-y border-line bg-surface/50">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-16 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-5xl font-bold text-gradient">
              <Counter to={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-2 text-sm text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-line p-10 sm:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-2/20 blur-3xl" />
          <div className="relative grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Have a project? <span className="text-gradient">Let&apos;s talk.</span>
              </h2>
              <ul className="mt-8 space-y-2 text-muted">
                <li>{brand.email}</li>
                <li>{brand.phone}</li>
                <li>{brand.address}</li>
              </ul>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
              ].map((f) => (
                <label key={f.id} htmlFor={f.id} className="block text-sm text-muted">
                  {f.label}
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    className="mt-1 w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-fg"
                  />
                </label>
              ))}
              <label htmlFor="msg" className="block text-sm text-muted">
                Message
                <textarea id="msg" rows={4} className="mt-1 w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-fg" />
              </label>
              <button className="rounded-full bg-fg px-7 py-3 font-medium text-bg transition hover:bg-accent-2">
                Send message
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-8 text-center text-sm text-muted">
      © 2026 {brand.name}. All rights reserved.
    </footer>
  );
}

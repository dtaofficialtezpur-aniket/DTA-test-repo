"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { brand, founder, marquee, offers, process, stats, why, wa } from "@/lib/content";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { Heading, ScrollText } from "./Text";
import { TiltCard } from "./TiltCard";

export function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <div className="space-y-4 overflow-hidden border-y border-line bg-white/50 py-8 backdrop-blur" aria-hidden>
      <div className="marquee-l flex w-max gap-10 whitespace-nowrap font-display text-5xl font-bold">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className={i % 2 ? "outline-text" : ""}>{t}</span>
            <span className="text-sky">✦</span>
          </span>
        ))}
      </div>
      <div className="marquee-r flex w-max gap-10 whitespace-nowrap font-display text-5xl font-bold">
        {[...row.slice().reverse(), ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className={i % 2 ? "" : "outline-text"}>{t}</span>
            <span className="text-violet">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="New-client offers" title="Start with zero risk." />
      <div className="grid gap-5 md:grid-cols-3">
        {offers.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.1} className="h-full">
            <TiltCard className="card shimmer flex h-full flex-col p-8">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">{o.tag}</p>
              <motion.p className="font-display mt-6 text-7xl font-bold text-gradient" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                FREE
              </motion.p>
              <h3 className="font-display mt-2 text-xl font-semibold">{o.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted">{o.body}</p>
              <a href={wa(o.msg)} className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue">
                Claim on WhatsApp <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 pb-28">
      <Heading kicker="How it works" title="Our process, step by step." />
      <div ref={ref} className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-line md:left-0 md:top-5 md:h-0.5 md:w-full" />
        <motion.div style={{ scaleY: line }} className="absolute left-5 top-0 h-full w-0.5 origin-top bg-gradient-to-b from-blue to-sky md:hidden" />
        <motion.div style={{ scaleX: line }} className="absolute left-0 top-5 hidden h-0.5 w-full origin-left bg-gradient-to-r from-blue to-sky md:block" />
        <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
          {process.map((p, i) => (
            <Step key={p.step} i={i} progress={line} p={p} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ i, progress, p }: { i: number; progress: ReturnType<typeof useSpring>; p: { step: string; body: string } }) {
  const bg = useTransform(progress, [i / 4 - 0.05, i / 4 + 0.08], ["#ffffff", "#0b5fcc"]);
  const color = useTransform(progress, [i / 4 - 0.05, i / 4 + 0.08], ["#0a1530", "#ffffff"]);
  return (
    <li className="relative pl-14 md:pl-0 md:pt-14">
      <motion.span style={{ backgroundColor: bg, color }} className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-line font-display font-bold shadow-lg shadow-blue/10">
        {i + 1}
      </motion.span>
      <Reveal>
        <h3 className="font-display text-xl font-semibold">{p.step}</h3>
        <p className="mt-2 text-sm text-muted">{p.body}</p>
      </Reveal>
    </li>
  );
}

export function Why() {
  return (
    <section className="relative border-y border-line bg-white/50 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <Heading kicker="Why DTA" title="Why businesses trust us." />
        <div className="mb-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.08} className="h-full">
              <div className="card h-full p-6">
                <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue to-sky text-white">{i + 1}</span>
                <h3 className="font-display font-semibold">{w.t}</h3>
                <p className="mt-2 text-sm text-muted">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-6xl font-bold text-gradient sm:text-7xl">
                <Counter to={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Our story" title="Built by professionals. Trusted by businesses." />
      <ScrollText text={founder.story.join(" ")} className="font-display text-2xl font-semibold leading-snug sm:text-4xl" />
      <Reveal className="mt-8 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue to-sky font-display text-xl font-bold text-white">AP</span>
        <div>
          <p className="font-display text-lg font-semibold">{founder.name}</p>
          <p className="text-sm text-muted">{founder.role}</p>
        </div>
      </Reveal>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {founder.values.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.1} className="h-full">
            <TiltCard className="card h-full p-7">
              <h3 className="font-display text-xl font-semibold text-gradient">{v.t}</h3>
              <p className="mt-2 text-sm text-muted">{v.d}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const field = "mt-1 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Hi DTA! I'd like a callback.\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nDepartment: ${f.get("dept")}\n${f.get("message") || ""}`;
    window.open(wa(msg), "_blank", "noopener");
    setSent(true);
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-28 pt-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink p-8 text-white sm:p-14">
          <div className="blob blob-a -right-20 -top-20 h-80 w-80 bg-blue" />
          <div className="blob blob-b -bottom-24 -left-10 h-80 w-80 bg-violet" />
          <div className="blob blob-c right-1/3 top-1/2 h-60 w-60 bg-sky/60" />
          <div className="relative grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                Ready to take your business <span className="bg-gradient-to-r from-ice to-sky bg-clip-text text-transparent">forward?</span>
              </h2>
              <p className="mt-4 text-white/70">Free consultation — no obligation, no hidden charges. We reply within 24 hours. {brand.hours}.</p>
              <ul className="mt-8 space-y-2">
                <li><a className="text-lg font-medium hover:text-ice" href={brand.phoneHref}>{brand.phone}</a></li>
                <li><a className="text-white/80 hover:text-ice" href={`mailto:${brand.email}`}>{brand.email}</a></li>
              </ul>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {brand.offices.map((o) => (
                  <address key={o.city} className="text-sm not-italic text-white/65">
                    <p className="mb-1 font-semibold text-white">{o.city} office</p>
                    {o.lines.map((l) => <span key={l} className="block">{l}</span>)}
                  </address>
                ))}
              </div>
            </div>
            <form className="space-y-4" onSubmit={submit}>
              <label className="block text-sm text-white/70">Full name *<input name="name" required className={field} /></label>
              <label className="block text-sm text-white/70">Phone *<input name="phone" type="tel" required className={field} /></label>
              <label className="block text-sm text-white/70">Department
                <select name="dept" className={field} defaultValue="Not sure">
                  {["Digital", "Trading", "Accounts", "Not sure"].map((d) => <option key={d} className="text-ink">{d}</option>)}
                </select>
              </label>
              <label className="block text-sm text-white/70">Message<textarea name="message" rows={3} className={field} /></label>
              <button className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 font-medium text-ink transition hover:bg-ice">
                Request a call back <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              {sent && <p className="text-sm text-ice" role="status">Opening WhatsApp — we&apos;ll contact you within 24 hours.</p>}
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-10 text-center text-sm text-muted">
      <div className="mb-4 flex justify-center gap-6">
        {brand.social.map((s) => (
          <a key={s.label} href={s.href} className="hover:text-ink" target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}
      </div>
      © 2026 DTA — {brand.full}. Tezpur, Assam · Bangalore, Karnataka
    </footer>
  );
}

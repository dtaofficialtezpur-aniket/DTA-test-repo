"use client";

import { useState } from "react";
import { brand, departments, founder, marquee, offers, process, software, stats, why, wa } from "@/lib/content";
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
  const row = [...marquee, ...marquee];
  return (
    <div className="overflow-hidden border-y border-line py-6" aria-hidden>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap text-3xl font-bold text-white/15">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Departments() {
  return (
    <section id="departments" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="Our departments" title={<>Three departments. <span className="text-gradient">One trusted team.</span></>} />
      <div className="grid gap-5 md:grid-cols-3">
        {departments.map((d, i) => (
          <Reveal key={d.name} delay={i * 0.1}>
            <TiltCard className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent/60">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                style={{ background: `hsl(${d.hue} 90% 55% / .35)` }}
              />
              <span className="relative font-mono text-sm text-accent-2" style={{ transform: "translateZ(30px)", display: "inline-block" }}>
                {d.n}
              </span>
              <h3 className="font-display relative mt-6 text-2xl font-semibold" style={{ transform: "translateZ(50px)" }}>
                {d.name}
              </h3>
              <p className="relative mt-3 text-muted" style={{ transform: "translateZ(20px)" }}>{d.body}</p>
              <ul className="relative mt-6 flex flex-wrap gap-2" style={{ transform: "translateZ(25px)" }}>
                {d.items.map((it) => (
                  <li key={it} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{it}</li>
                ))}
              </ul>
              <a
                href={wa(`Hi DTA! I would like to know more about your ${d.name} services.`)}
                className="relative mt-8 inline-block text-sm text-accent-2 hover:underline"
              >
                Enquire on WhatsApp →
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Software() {
  return (
    <section id="software" className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <Heading kicker="Built around you" title={<span className="text-gradient">{software.title}</span>} />
        <Reveal><p className="-mt-8 mb-12 max-w-xl text-muted">{software.body}</p></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {software.features.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.06}>
              <TiltCard className="h-full rounded-2xl border border-line bg-bg/60 p-6">
                <h3 className="font-display text-lg font-semibold" style={{ transform: "translateZ(30px)" }}>{f.t}</h3>
                <p className="mt-2 text-sm text-muted">{f.d}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <a href="#contact" className="mt-12 inline-block rounded-full bg-gradient-to-r from-accent-3 to-accent px-7 py-3.5 font-medium text-white transition hover:scale-105">
          Get a custom quote
        </a>
      </div>
    </section>
  );
}

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl px-5 py-28">
      <Heading kicker="New-client offers" title={<>Start with <span className="text-gradient">zero risk.</span></>} />
      <div className="grid gap-5 md:grid-cols-3">
        {offers.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.1}>
            <TiltCard className="flex h-full flex-col rounded-3xl border border-line p-8">
              <p className="text-xs uppercase tracking-widest text-muted">{o.tag}</p>
              <p className="font-display mt-6 text-5xl font-bold text-gradient" style={{ transform: "translateZ(40px)" }}>FREE</p>
              <h3 className="font-display mt-2 text-xl font-semibold">{o.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted">{o.body}</p>
              <a href={wa(o.msg)} className="mt-6 text-sm text-accent-2 hover:underline">Claim on WhatsApp →</a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 pb-28">
      <Heading kicker="How it works" title="Our process" />
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

export function Why() {
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Heading kicker="Why DTA" title="Why businesses trust us" />
        <div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <Reveal key={w.t}>
              <h3 className="font-semibold">{w.t}</h3>
              <p className="mt-2 text-sm text-muted">{w.d}</p>
            </Reveal>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-5xl font-bold text-gradient">
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
      <Heading kicker="Our story" title={<>Built by professionals. <span className="text-gradient">Trusted by businesses.</span></>} />
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <div className="space-y-4 text-muted">
            {founder.story.map((p) => <p key={p}>{p}</p>)}
          </div>
          <p className="mt-8 font-display text-xl font-semibold">{founder.name}</p>
          <p className="text-sm text-accent-2">{founder.role}</p>
        </Reveal>
        <div className="space-y-4">
          {founder.values.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="rounded-2xl border border-line p-6">
                <h3 className="font-semibold">{v.t}</h3>
                <p className="mt-1 text-sm text-muted">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const field = "mt-1 w-full rounded-xl border border-line bg-bg/60 px-4 py-3 text-fg";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Hi DTA! I'd like a callback.\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nDepartment: ${f.get("dept")}\n${f.get("message") || ""}`;
    window.open(wa(msg), "_blank", "noopener");
    setSent(true);
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-line p-10 sm:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-3/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Ready to take your business <span className="text-gradient">forward?</span>
              </h2>
              <p className="mt-4 text-muted">Free consultation — no obligation, no hidden charges. We reply within 24 hours. {brand.hours}.</p>
              <ul className="mt-8 space-y-2 text-sm">
                <li><a className="hover:text-accent-2" href={brand.phoneHref}>{brand.phone}</a></li>
                <li><a className="hover:text-accent-2" href={`mailto:${brand.email}`}>{brand.email}</a></li>
              </ul>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {brand.offices.map((o) => (
                  <address key={o.city} className="text-sm not-italic text-muted">
                    <p className="mb-1 font-semibold text-fg">{o.city} office</p>
                    {o.lines.map((l) => <span key={l} className="block">{l}</span>)}
                  </address>
                ))}
              </div>
            </div>
            <form className="space-y-4" onSubmit={submit}>
              <label className="block text-sm text-muted">Full name *
                <input name="name" required className={field} />
              </label>
              <label className="block text-sm text-muted">Phone *
                <input name="phone" type="tel" required className={field} />
              </label>
              <label className="block text-sm text-muted">Department
                <select name="dept" className={field} defaultValue="Not sure">
                  {["Digital", "Trading", "Accounts", "Not sure"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="block text-sm text-muted">Message
                <textarea name="message" rows={3} className={field} />
              </label>
              <button className="rounded-full bg-gradient-to-r from-accent-3 to-accent px-7 py-3 font-medium text-white transition hover:scale-105">
                Request a call back
              </button>
              {sent && <p className="text-sm text-accent-2" role="status">Opening WhatsApp — we&apos;ll contact you within 24 hours.</p>}
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
          <a key={s.label} href={s.href} className="hover:text-fg" target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}
      </div>
      © 2026 DTA — {brand.full}. Tezpur, Assam · Bangalore, Karnataka
    </footer>
  );
}

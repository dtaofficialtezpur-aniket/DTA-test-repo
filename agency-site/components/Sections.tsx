"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { brand, departments, founder, marquee, offers, process, software, stats, why, wa } from "@/lib/content";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { Button, Heading, ScrollText } from "./Text";

export function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <div className="overflow-hidden border-y border-line py-5" aria-hidden>
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="label flex items-center gap-10 text-muted">{t}<span className="h-1 w-1 rounded-full bg-accent" /></span>
        ))}
      </div>
    </div>
  );
}

export function Departments() {
  return (
    <section id="departments" className="mx-auto max-w-6xl px-6 py-28">
      <Heading index="01" kicker="Departments" title="Three departments." muted="One accountable team." />
      <ul className="border-b border-line">
        {departments.map((d, i) => (
          <Reveal key={d.name} delay={i * 0.06}>
            <li className="group relative grid gap-5 border-t border-line py-10 transition-colors duration-300 hover:bg-surface md:grid-cols-12 md:px-4">
              <span className="absolute left-0 top-0 h-0 w-0.5 bg-accent transition-all duration-500 group-hover:h-full" />
              <span className="label text-muted md:col-span-1">{d.n}</span>
              <h3 className="text-2xl font-medium tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl md:col-span-4">{d.name}</h3>
              <div className="md:col-span-5">
                <p className="text-muted">{d.body}</p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {d.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm"><span className="h-1 w-1 rounded-full bg-accent" />{it}</li>
                  ))}
                </ul>
              </div>
              <a href={wa(`Hi DTA! I would like to know more about your ${d.name} services.`)} className="text-sm font-medium md:col-span-2 md:text-right">
                <span className="inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 transition-colors group-hover:border-accent group-hover:text-accent">
                  Enquire <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

const icons = [
  "M5 24a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M33 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M33 36a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M15 22L33 13 M15 26L33 35",
  "M6 26h16v16H6z M26 26h16v16H26z M16 8h16v16H16z",
  "M6 6v36h36 M14 34V26 M24 34V16 M34 34V22",
  "M40 20A16 16 0 0 0 10 16 M8 28a16 16 0 0 0 30 4 M10 8v8h8 M38 40v-8h-8",
  "M16 4h16a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z M21 38h6",
  "M14 36a8 8 0 0 1 0-16 11 11 0 0 1 21-2 7.5 7.5 0 0 1 1 18z",
];

export function Software() {
  return (
    <section id="software" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Heading index="02" kicker="Software" title="Custom CRM + ERP." muted="No templates. Built around you." />
        <div className="-mt-6 mb-14 grid md:grid-cols-12">
          <Reveal className="md:col-span-7 md:col-start-4"><p className="max-w-xl text-lg text-muted">{software.body}</p></Reveal>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {software.features.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.05} y={16}>
              <motion.div whileHover="hover" className="group h-full bg-surface p-8 transition-colors duration-300 hover:bg-soft/60">
                <div className="mb-10 flex items-start justify-between">
                  <motion.svg viewBox="0 0 48 48" className="h-12 w-12 text-ink transition-colors duration-300 group-hover:text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" variants={{ hover: { y: -4, rotate: -3 } }}>
                    <motion.path d={icons[i]} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 + i * 0.1, ease: "easeInOut" }} />
                  </motion.svg>
                  <span className="label text-muted">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-medium tracking-tight">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12"><Button href="#contact">Get a custom quote</Button></div>
      </div>
    </section>
  );
}

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl px-6 py-28">
      <Heading index="03" kicker="New-client offers" title="Start with zero risk." muted="Every offer is free for new clients." />
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {offers.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.08} y={16}>
            <div className="group flex h-full flex-col bg-bg p-8 transition-colors duration-300 hover:bg-surface">
              <p className="label text-muted">{o.tag}</p>
              <p className="mt-10 text-7xl font-light leading-none tracking-[-0.05em] transition-colors group-hover:text-accent">Free</p>
              <h3 className="mt-4 text-lg font-medium">{o.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{o.body}</p>
              <a href={wa(o.msg)} className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-accent group-hover:text-accent">Claim on WhatsApp</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Step({ i, progress, p }: { i: number; progress: ReturnType<typeof useSpring>; p: { step: string; body: string } }) {
  const bg = useTransform(progress, [i / 4 - 0.04, i / 4 + 0.06], ["#fafafa", "#1f5fe0"]);
  const border = useTransform(progress, [i / 4 - 0.04, i / 4 + 0.06], ["#c9ced8", "#1f5fe0"]);
  return (
    <li className="relative pl-10 md:pl-0 md:pt-10">
      <motion.span style={{ backgroundColor: bg, borderColor: border }} className="absolute left-0 top-1 h-3 w-3 rounded-full border md:top-[calc(0px-0.2rem)]" />
      <Reveal>
        <p className="label text-muted">0{i + 1}</p>
        <h3 className="mt-2 text-lg font-medium tracking-tight">{p.step}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
      </Reveal>
    </li>
  );
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.65"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section id="process" className="mx-auto max-w-6xl px-6 pb-28">
      <Heading index="04" kicker="Process" title="How we work." muted="Four steps, no surprises." />
      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-[5px] top-0 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-px md:w-auto" />
        <motion.div style={{ scaleY: line }} className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-accent md:hidden" />
        <motion.div style={{ scaleX: line }} className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-accent md:block" />
        <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
          {process.map((p, i) => <Step key={p.step} i={i} progress={line} p={p} />)}
        </ol>
      </div>
    </section>
  );
}

export function Why() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Heading index="05" kicker="Why DTA" title="Why businesses trust us." muted="One team, full transparency." />
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.06}>
              <div className="border-t border-ink pt-5">
                <p className="label text-accent">0{i + 1}</p>
                <h3 className="mt-3 text-lg font-medium tracking-tight">{w.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <dl className="mt-24 grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <dd className="text-6xl font-light tracking-[-0.05em] sm:text-7xl"><Counter to={s.value} suffix={s.suffix} /></dd>
              <dt className="label mt-3 text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <Heading index="06" kicker="About" title="Built by professionals." muted="Trusted by businesses." />
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-9 md:col-start-4">
          <ScrollText text={founder.story.join(" ")} className="text-2xl font-medium leading-snug tracking-[-0.02em] sm:text-3xl" />
          <Reveal className="mt-8 flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-sm font-medium">AP</span>
            <div>
              <p className="text-sm font-medium">{founder.name}</p>
              <p className="label text-muted">{founder.role}</p>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="mt-20 grid gap-x-10 gap-y-10 md:grid-cols-3">
        {founder.values.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.08}>
            <div className="border-t border-line pt-5">
              <p className="label text-accent">{v.t}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const field = "mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-base outline-none transition-colors focus:border-accent";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Hi DTA! I'd like a callback.\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nDepartment: ${f.get("dept")}\n${f.get("message") || ""}`;
    window.open(wa(msg), "_blank", "noopener");
    setSent(true);
  }

  return (
    <section id="contact" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Heading index="07" kicker="Contact" title="Ready to take your business forward?" muted="Free consultation, no obligation." />
        <div className="grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-4">
            <p className="text-muted">We reply within 24 hours. {brand.hours}.</p>
            <a className="mt-6 block text-3xl font-medium tracking-tight transition-colors hover:text-accent" href={brand.phoneHref}>{brand.phone}</a>
            <a className="mt-2 block text-muted transition-colors hover:text-accent" href={`mailto:${brand.email}`}>{brand.email}</a>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {brand.offices.map((o) => (
                <address key={o.city} className="border-t border-line pt-4 text-sm not-italic text-muted">
                  <p className="label mb-2 text-ink">{o.city}</p>
                  {o.lines.map((l) => <span key={l} className="block">{l}</span>)}
                </address>
              ))}
            </div>
          </Reveal>
          <Reveal className="md:col-span-4" delay={0.1}>
            <form className="space-y-7" onSubmit={submit}>
              <label className="label block text-muted">Full name *<input name="name" required className={field} /></label>
              <label className="label block text-muted">Phone *<input name="phone" type="tel" required className={field} /></label>
              <label className="label block text-muted">Department
                <select name="dept" className={field} defaultValue="Not sure">
                  {["Digital", "Trading", "Accounts", "Not sure"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="label block text-muted">Message<textarea name="message" rows={2} className={field} /></label>
              <button className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent">
                Request a call back <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              {sent && <p className="text-sm text-accent" role="status">Opening WhatsApp — we&apos;ll contact you within 24 hours.</p>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted">
        <p>© 2026 DTA — {brand.full} · Tezpur, Assam · Bangalore, Karnataka</p>
        <div className="flex gap-6">
          {brand.social.map((s) => <a key={s.label} href={s.href} className="transition-colors hover:text-ink" target="_blank" rel="noopener noreferrer">{s.label}</a>)}
        </div>
      </div>
    </footer>
  );
}

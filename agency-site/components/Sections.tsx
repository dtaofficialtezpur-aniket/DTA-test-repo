"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { brand, founder, marquee, offers, process, stats, why, wa } from "@/lib/content";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { Heading, ScrollText } from "./Text";

function Band({ items, className, dir }: { items: string[]; className: string; dir: "l" | "r" }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`overflow-hidden border-y-2 border-ink py-4 ${className}`} aria-hidden>
      <div className={`marquee-${dir} flex w-max gap-8 whitespace-nowrap font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl`}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">{t}<span className="text-tang">✺</span></span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative my-10 h-40 overflow-hidden sm:h-44">
      <div className="absolute inset-x-[-5%] top-2 rotate-[2deg]"><Band items={[...marquee].reverse()} dir="r" className="bg-lemon" /></div>
      <div className="absolute inset-x-[-5%] top-12 -rotate-[2deg]"><Band items={marquee} dir="l" className="bg-ink text-paper" /></div>
    </div>
  );
}

const ticketTones = ["bg-lemon", "bg-mint", "bg-lilac"];
const tilts = [-1.5, 1, -1];

export function Offers() {
  return (
    <section id="offers" className="mx-auto max-w-6xl px-5 py-24">
      <Heading kicker="New-client offers" title="Start with zero risk." serif={[3, 4]} color="bg-mint" />
      <div className="grid gap-8 md:grid-cols-3">
        {offers.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.1} className="h-full">
            <motion.div whileHover={{ rotate: 0, y: -6 }} initial={{ rotate: tilts[i] }} className={`brut relative flex h-full flex-col overflow-hidden ${ticketTones[i]}`}>
              <div className="p-7 pb-6">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink/60">{o.tag}</p>
                <motion.p className="font-display mt-4 text-7xl font-extrabold leading-none tracking-tighter" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>FREE</motion.p>
                <h3 className="font-display mt-2 text-xl font-extrabold">{o.title}</h3>
              </div>
              {/* perforation */}
              <div className="relative border-t-2 border-dashed border-ink">
                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-ink bg-paper" />
                <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border-2 border-ink bg-paper" />
              </div>
              <div className="flex flex-1 flex-col p-7 pt-6">
                <p className="flex-1 text-sm text-ink/75">{o.body}</p>
                <a href={wa(o.msg)} className="group mt-5 inline-flex items-center gap-2 text-sm font-extrabold underline decoration-2 underline-offset-4">
                  Claim on WhatsApp <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Step({ i, progress, p }: { i: number; progress: ReturnType<typeof useSpring>; p: { step: string; body: string } }) {
  const bg = useTransform(progress, [i / 4 - 0.05, i / 4 + 0.08], ["#ffffff", "#1f4fe8"]);
  const color = useTransform(progress, [i / 4 - 0.05, i / 4 + 0.08], ["#15120e", "#ffffff"]);
  return (
    <li className="relative pl-16 md:pl-0 md:pt-16">
      <motion.span style={{ backgroundColor: bg, color }} className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border-2 border-ink font-display text-lg font-extrabold shadow-[3px_3px_0_var(--ink)]">
        {i + 1}
      </motion.span>
      <Reveal>
        <h3 className="font-display text-xl font-extrabold tracking-tight">{p.step}</h3>
        <p className="mt-2 text-sm text-ink/70">{p.body}</p>
      </Reveal>
    </li>
  );
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 pb-28">
      <Heading kicker="How it works" title="Our process, step by step." serif={[3, 4]} color="bg-peach" />
      <div ref={ref} className="relative">
        <div className="absolute left-6 top-0 h-full w-2 rounded-full border-2 border-ink bg-white md:left-0 md:top-5 md:h-2 md:w-full" />
        <motion.div style={{ scaleY: line }} className="absolute left-6 top-0 h-full w-2 origin-top rounded-full bg-cobalt md:hidden" />
        <motion.div style={{ scaleX: line }} className="absolute left-0 top-5 hidden h-2 w-full origin-left rounded-full bg-cobalt md:block" />
        <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
          {process.map((p, i) => <Step key={p.step} i={i} progress={line} p={p} />)}
        </ol>
      </div>
    </section>
  );
}

export function Why() {
  const tones = ["bg-sky", "bg-lemon", "bg-mint", "bg-lilac"];
  return (
    <section className="px-5 pb-28">
      <div className="mx-auto max-w-6xl">
        <Heading kicker="Why DTA" title="Why businesses trust us." serif={[2, 3]} color="bg-lemon" />
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.08} className="h-full">
              <div className={`brut lift h-full p-6 ${tones[i]}`}>
                <span className="font-serif text-6xl italic leading-none">{i + 1}</span>
                <h3 className="font-display mt-3 text-lg font-extrabold">{w.t}</h3>
                <p className="mt-2 text-sm text-ink/75">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="brut bg-ink p-8 text-paper sm:p-12">
          <dl className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label}>
                <dd className="font-display text-6xl font-extrabold tracking-tighter sm:text-7xl" style={{ color: ["#ffd84a", "#7ee2b8", "#c9b8ff", "#ff7a45"][i] }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-sm text-paper/70">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const tones = ["bg-peach", "bg-sky", "bg-lilac"];
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 pb-28">
      <Heading kicker="Our story" title="Built by professionals. Trusted by businesses." serif={[3, 4]} color="bg-tang" />
      <ScrollText text={founder.story.join(" ")} className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-4xl" />
      <Reveal className="mt-8 flex items-center gap-4">
        <span className="grid h-14 w-14 -rotate-6 place-items-center rounded-full border-2 border-ink bg-lemon font-display text-lg font-extrabold shadow-[3px_3px_0_var(--ink)]">AP</span>
        <div>
          <p className="font-display text-lg font-extrabold">{founder.name}</p>
          <p className="text-sm text-ink/60">{founder.role}</p>
        </div>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {founder.values.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.1} className="h-full">
            <div className={`brut lift h-full p-7 ${tones[i]}`}>
              <h3 className="font-serif text-4xl italic">{v.t}</h3>
              <p className="mt-3 text-sm text-ink/80">{v.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const field = "mt-1 w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-ink";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Hi DTA! I'd like a callback.\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nDepartment: ${f.get("dept")}\n${f.get("message") || ""}`;
    window.open(wa(msg), "_blank", "noopener");
    setSent(true);
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-24">
      <Reveal>
        <div className="brut relative overflow-hidden bg-cobalt p-8 text-white sm:p-14">
          <motion.span className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-2 border-ink bg-lemon" animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.span className="absolute -bottom-10 right-1/3 h-24 w-24 rotate-12 rounded-2xl border-2 border-ink bg-tang" animate={{ rotate: [12, 24, 12] }} transition={{ duration: 7, repeat: Infinity }} />
          <div className="relative grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                Ready to take your business <span className="font-serif font-normal italic text-lemon">forward?</span>
              </h2>
              <p className="mt-4 text-white/80">Free consultation — no obligation, no hidden charges. We reply within 24 hours. {brand.hours}.</p>
              <ul className="mt-8 space-y-2">
                <li><a className="font-display text-2xl font-extrabold hover:text-lemon" href={brand.phoneHref}>{brand.phone}</a></li>
                <li><a className="text-white/90 hover:text-lemon" href={`mailto:${brand.email}`}>{brand.email}</a></li>
              </ul>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {brand.offices.map((o) => (
                  <address key={o.city} className="brut-sm bg-paper p-4 text-sm not-italic text-ink">
                    <p className="mb-1 font-extrabold">{o.city} office</p>
                    {o.lines.map((l) => <span key={l} className="block text-ink/70">{l}</span>)}
                  </address>
                ))}
              </div>
            </div>
            <form className="brut-sm space-y-4 self-start bg-paper p-6 text-ink" onSubmit={submit}>
              <label className="block text-sm font-bold">Full name *<input name="name" required className={field} /></label>
              <label className="block text-sm font-bold">Phone *<input name="phone" type="tel" required className={field} /></label>
              <label className="block text-sm font-bold">Department
                <select name="dept" className={field} defaultValue="Not sure">
                  {["Digital", "Trading", "Accounts", "Not sure"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold">Message<textarea name="message" rows={3} className={field} /></label>
              <button className="group lift inline-flex items-center gap-3 rounded-full border-2 border-ink bg-lemon px-7 py-3.5 font-bold shadow-[4px_4px_0_var(--ink)]">
                Request a call back <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              {sent && <p className="text-sm font-semibold text-cobalt" role="status">Opening WhatsApp — we&apos;ll contact you within 24 hours.</p>}
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pt-10 text-sm">
        <p>© 2026 DTA — {brand.full} · Tezpur, Assam · Bangalore, Karnataka</p>
        <div className="flex gap-6">
          {brand.social.map((s) => <a key={s.label} href={s.href} className="font-bold hover:text-lemon" target="_blank" rel="noopener noreferrer">{s.label}</a>)}
        </div>
      </div>
      <p className="select-none whitespace-nowrap text-center font-display text-[30vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-paper/95 sm:text-[26vw]" aria-hidden>
        DTA<span className="text-tang">.</span>
      </p>
    </footer>
  );
}

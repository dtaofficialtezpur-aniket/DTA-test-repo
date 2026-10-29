"use client";

import dynamic from "next/dynamic";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { brand, wa } from "@/lib/content";

const MapScene = dynamic(() => import("./MapScene"), { ssr: false });

function OfficeLabel({ innerRef, name, state }: { innerRef: React.RefObject<HTMLDivElement | null>; name: string; state: string }) {
  return (
    <div ref={innerRef} className="pointer-events-none absolute left-0 top-0 z-[5] opacity-0 will-change-transform" aria-hidden>
      <div className="whitespace-nowrap rounded-lg border border-white/15 bg-[#0B1B33]/80 px-3 py-1.5 text-white shadow-lg backdrop-blur">
        <p className="font-[family-name:var(--f-lexend)] text-[13px] font-semibold leading-tight">{name}</p>
        <p className="text-[11px] leading-tight text-[#9bb4d6]">{state}</p>
      </div>
    </div>
  );
}
const lexend = "font-[family-name:var(--f-lexend)]";
const source = "font-[family-name:var(--f-source)]";

const stages: { n: string; h: string; lines: string[]; range: number[] }[] = [
  { n: "Tezpur, Assam", h: "Our first office", lines: brand.offices[0].lines, range: [0.2, 0.28, 0.42, 0.5] },
  { n: "Bangalore, Karnataka", h: "Our second office", lines: brand.offices[1].lines, range: [0.52, 0.6, 0.72, 0.8] },
];

function Caption({ s, p }: { s: (typeof stages)[number]; p: MotionValue<number> }) {
  const opacity = useTransform(p, s.range, [0, 1, 1, 0]);
  const y = useTransform(p, s.range, [24, 0, 0, -24]);
  return (
    <motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-x-5 bottom-8 motion-reduce:hidden md:inset-x-auto md:bottom-auto md:left-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:top-1/2 md:max-w-md md:-translate-y-1/2">
      <div className="rounded-2xl border border-white/10 bg-[#0B1B33]/70 p-6 text-white backdrop-blur-md md:p-8">
        <p className={`${lexend} text-sm font-medium text-[#6fd0ff]`}>{s.n}</p>
        <h2 className={`${lexend} mt-2 text-3xl font-semibold tracking-[-0.02em] md:text-4xl`}>{s.h}</h2>
        <address className={`${source} mt-4 text-[17px] not-italic leading-relaxed text-[#C3D1E6]`}>
          {s.lines.map((l) => <span key={l} className="block">{l}</span>)}
        </address>
        <p className={`${source} mt-3 text-[15px] text-[#9bb4d6]`}>{brand.hours}</p>
      </div>
    </motion.div>
  );
}

export function MapHero() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const tezLabel = useRef<HTMLDivElement>(null);
  const blrLabel = useRef<HTMLDivElement>(null);
  const labels = [tezLabel, blrLabel];
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const intro = useTransform(p, [0, 0.06, 0.13], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.13], [0, -40]);
  const finale = useTransform(p, [0.8, 0.88, 0.95], [0, 1, 0]);
  const lightBg = useTransform(p, [0.94, 1], [0, 1]);
  const canvasFade = useTransform(p, [0.9, 0.97], [1, 0]);
  const rail = [0, 0.3, 0.62, 0.9, 1];

  return (
    <section id="top" ref={ref} className="relative h-[420svh] motion-reduce:h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#060B16] text-white">
        {/* animated background */}
        <div className="absolute inset-0" aria-hidden>
          <div className="aurora-a absolute -left-1/4 top-[10%] h-[70vh] w-[70vw] rounded-full bg-[#0b5fcc]/30 blur-[110px]" />
          <div className="aurora-b absolute -right-1/4 bottom-[-10%] h-[60vh] w-[60vw] rounded-full bg-[#2f9bf2]/25 blur-[120px]" />
          <div className="scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6fd0ff]/50 to-transparent" />
        </div>

        <motion.div style={{ opacity: canvasFade }} className="absolute inset-0 motion-reduce:opacity-100!">
          <MapScene reduce={reduce} labels={labels} />
          <OfficeLabel innerRef={tezLabel} name="Tezpur office" state="Assam" />
          <OfficeLabel innerRef={blrLabel} name="Bangalore office" state="Karnataka" />
        </motion.div>

        {/* stage 0 · headline */}
        <motion.div style={{ opacity: intro, y: introY }} className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 text-center motion-reduce:translate-y-0! motion-reduce:opacity-100! sm:pt-28">
          <h1 className={`${lexend} text-balance text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]`}>
            Websites, GST filing and business licences, handled by one team.
          </h1>
          <p className={`${source} mt-5 hidden max-w-2xl text-pretty text-lg leading-relaxed text-[#A9B8D0] sm:block`}>
            DTA builds your website or CRM, files your GST and income tax returns, and gets your trade licence and FSSAI registration. We work from our offices in Tezpur and Bangalore.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#contact" className={`${lexend} inline-flex min-h-12 items-center rounded-lg bg-[#0B5FCC] px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#2f7be0]`}>Book a free consultation</a>
            <a href={wa("Hi DTA! I'd like to talk about my business.")} className={`${lexend} inline-flex min-h-12 items-center rounded-lg border border-white/30 bg-white/5 px-5 text-[15px] font-medium transition-colors duration-200 hover:border-white`}>Chat on WhatsApp</a>
          </div>
          <p className={`${source} mt-5 hidden text-[15px] text-[#A9B8D0] sm:block`}>500+ businesses served. We reply within 24 hours, Monday to Saturday.</p>
        </motion.div>

        {/* stages 1–2 · offices */}
        {stages.map((s) => <Caption key={s.n} s={s} p={p} />)}

        {/* stage 3 · finish */}
        {(
          <motion.div style={{ opacity: finale }} className="pointer-events-none absolute inset-x-5 top-[14%] z-10 text-center motion-reduce:hidden sm:top-[16%]">
            <p className={`${lexend} mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl`}>Two offices. One team. 500+ businesses.</p>
          </motion.div>
        )}

        {/* progress rail */}
        {(
          <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 motion-reduce:!hidden md:flex" aria-hidden>
            {rail.slice(0, 4).map((r, i) => <RailDot key={i} p={p} from={r} to={rail[i + 1]} />)}
          </div>
        )}

        {(
          <motion.div style={{ opacity: intro }} className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-2 text-sm text-[#A9B8D0] motion-reduce:hidden" aria-hidden>
            Scroll to see our offices
            <span className="h-8 w-px animate-pulse bg-gradient-to-b from-[#6fd0ff] to-transparent" />
          </motion.div>
        )}

        <motion.div style={{ opacity: lightBg }} className="pointer-events-none absolute inset-0 z-20 bg-[#FAFAFA] motion-reduce:hidden" aria-hidden />
      </div>
    </section>
  );
}

function RailDot({ p, from, to }: { p: MotionValue<number>; from: number; to: number }) {
  const c = (v: number) => Math.min(1, Math.max(0, v)); // scroll offsets must stay inside 0–1
  const h = useTransform(p, [c(from), c(from + 0.04), c(to - 0.04), c(to)], [8, 28, 28, 8]);
  const o = useTransform(p, [c(from - 0.02), c(from + 0.04), c(to - 0.04), c(to)], [0.3, 1, 1, 0.3]);
  return <motion.span style={{ height: h, opacity: o }} className="block w-1.5 rounded-full bg-[#6fd0ff]" />;
}

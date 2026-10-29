"use client";

import dynamic from "next/dynamic"; // Not on Next.js? See README: swap for React.lazy + Suspense.
import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { INDIA_OUTLINE } from "./india-outline";
import { makeTimeline } from "./timeline";
import { defaultColors, type MapHeroProps, type Stage } from "./types";

const MapScene = dynamic(() => import("./MapScene"), { ssr: false });

const heading = "font-[family-name:var(--mh-heading,inherit)]";
const body = "font-[family-name:var(--mh-body,inherit)]";

function OfficeLabel({ name, sub, setRef }: { name: string; sub?: string; setRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={setRef} className="pointer-events-none absolute left-0 top-0 z-[5] opacity-0 will-change-transform" aria-hidden>
      <div className="whitespace-nowrap rounded-lg border border-white/15 bg-[#0B1B33]/80 px-3 py-1.5 text-white shadow-lg backdrop-blur">
        <p className={`${heading} text-[13px] font-semibold leading-tight`}>{name}</p>
        {sub && <p className="text-[11px] leading-tight text-[#9bb4d6]">{sub}</p>}
      </div>
    </div>
  );
}

function Caption({ stage, range, p }: { stage: Stage; range: number[]; p: MotionValue<number> }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, range, [24, 0, 0, -24]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-x-5 bottom-8 motion-reduce:hidden md:inset-x-auto md:bottom-auto md:left-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:top-1/2 md:max-w-md md:-translate-y-1/2"
    >
      <div className="rounded-2xl border border-white/10 bg-[#0B1B33]/70 p-6 text-white backdrop-blur-md md:p-8">
        <p className={`${heading} text-sm font-medium text-[var(--mh-glow)]`}>{stage.eyebrow}</p>
        <h2 className={`${heading} mt-2 text-3xl font-semibold tracking-[-0.02em] md:text-4xl`}>{stage.title}</h2>
        {stage.lines && (
          <address className={`${body} mt-4 text-[17px] not-italic leading-relaxed text-[#C3D1E6]`}>
            {stage.lines.map((l) => <span key={l} className="block">{l}</span>)}
          </address>
        )}
        {stage.meta && <p className={`${body} mt-3 text-[15px] text-[#9bb4d6]`}>{stage.meta}</p>}
      </div>
    </motion.div>
  );
}

function RailDot({ p, from, to }: { p: MotionValue<number>; from: number; to: number }) {
  const c = (v: number) => Math.min(1, Math.max(0, v)); // scroll offsets must stay inside 0–1
  const h = useTransform(p, [c(from), c(from + 0.04), c(to - 0.04), c(to)], [8, 28, 28, 8]);
  const o = useTransform(p, [c(from - 0.02), c(from + 0.04), c(to - 0.04), c(to)], [0.3, 1, 1, 0.3]);
  return <motion.span style={{ height: h, opacity: o }} className="block w-1.5 rounded-full bg-[var(--mh-glow)]" />;
}

export function MapHero({
  id = "top",
  headline,
  description,
  primaryCta,
  secondaryCta,
  footnote,
  pins,
  stages,
  arc = [0, 1],
  cities = [],
  outline = INDIA_OUTLINE,
  finale,
  scrollHint = "Scroll to explore",
  colors: colorOverrides,
  heightVh,
}: MapHeroProps) {
  const colors = { ...defaultColors, ...colorOverrides };
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const tl = makeTimeline(stages.length);

  const intro = useTransform(p, [0, tl.intro * 0.6, tl.intro * 1.3], [1, 1, 0]);
  const introY = useTransform(p, [0, tl.intro * 1.3], [0, -40]);
  const finaleOpacity = useTransform(p, tl.finale, [0, 1, 0]);
  const lightBg = useTransform(p, tl.light, [0, 1]);
  const canvasFade = useTransform(p, tl.canvasFade, [1, 0]);
  const vh = heightVh ?? 160 + 130 * stages.length;

  const cssVars = {
    "--mh-bg": colors.background,
    "--mh-glow": colors.glow,
    "--mh-accent": colors.accent,
    "--mh-light": colors.light,
    height: `${vh}svh`,
  } as React.CSSProperties;

  return (
    <section id={id} ref={ref} style={cssVars} className="relative motion-reduce:!h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--mh-bg)] text-white">
        {/* animated background: aurora glow + scan line (the moving floor, sparkles and ripples live in the 3D scene) */}
        <div className="absolute inset-0" aria-hidden>
          <div className="mh-aurora-a absolute -left-1/4 top-[10%] h-[70vh] w-[70vw] rounded-full bg-[var(--mh-accent)]/30 blur-[110px]" />
          <div className="mh-aurora-b absolute -right-1/4 bottom-[-10%] h-[60vh] w-[60vw] rounded-full bg-[var(--mh-glow)]/20 blur-[120px]" />
          <div className="mh-scan absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--mh-glow)]/50 to-transparent" />
        </div>

        {/* 3D map + floating pin labels */}
        <motion.div style={{ opacity: canvasFade }} className="absolute inset-0 motion-reduce:!opacity-100">
          <MapScene reduce={reduce} heroRef={ref} labelRefs={labelRefs} pins={pins} stages={stages} arc={arc} cities={cities} outline={outline} colors={colors} />
          {pins.map((pin, i) => (
            <OfficeLabel key={i} name={pin.label} sub={pin.sub} setRef={(el) => { labelRefs.current[i] = el; }} />
          ))}
        </motion.div>

        {/* stage 0: headline */}
        <motion.div style={{ opacity: intro, y: introY }} className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 text-center motion-reduce:!translate-y-0 motion-reduce:!opacity-100 sm:pt-28">
          <h1 className={`${heading} text-balance text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]`}>{headline}</h1>
          {description && <p className={`${body} mt-5 hidden max-w-2xl text-pretty text-lg leading-relaxed text-[#A9B8D0] sm:block`}>{description}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {primaryCta && (
                <a href={primaryCta.href} className={`${heading} inline-flex min-h-12 items-center rounded-lg bg-[var(--mh-accent)] px-6 text-[15px] font-medium text-white transition-[filter] duration-200 hover:brightness-125`}>{primaryCta.label}</a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href} className={`${heading} inline-flex min-h-12 items-center rounded-lg border border-white/30 bg-white/5 px-5 text-[15px] font-medium transition-colors duration-200 hover:border-white`}>{secondaryCta.label}</a>
              )}
            </div>
          )}
          {footnote && <p className={`${body} mt-5 hidden text-[15px] text-[#A9B8D0] sm:block`}>{footnote}</p>}
        </motion.div>

        {/* one card per stage */}
        {stages.map((s, i) => <Caption key={i} stage={s} range={tl.stages[i].caption} p={p} />)}

        {/* closing line */}
        {finale && (
          <motion.div style={{ opacity: finaleOpacity }} className="pointer-events-none absolute inset-x-5 top-[14%] z-10 text-center motion-reduce:hidden sm:top-[16%]">
            <p className={`${heading} mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-5xl`}>{finale}</p>
          </motion.div>
        )}

        {/* progress rail */}
        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 motion-reduce:!hidden md:flex" aria-hidden>
          {tl.rail.slice(0, -1).map((r, i) => <RailDot key={i} p={p} from={r} to={tl.rail[i + 1]} />)}
        </div>

        <motion.div style={{ opacity: intro }} className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-2 text-sm text-[#A9B8D0] motion-reduce:hidden" aria-hidden>
          {scrollHint}
          <span className="h-8 w-px animate-pulse bg-gradient-to-b from-[var(--mh-glow)] to-transparent" />
        </motion.div>

        {/* fades the dark hero into a light page at the very end */}
        <motion.div style={{ opacity: lightBg }} className="pointer-events-none absolute inset-0 z-20 bg-[var(--mh-light)] motion-reduce:hidden" aria-hidden />
      </div>
    </section>
  );
}

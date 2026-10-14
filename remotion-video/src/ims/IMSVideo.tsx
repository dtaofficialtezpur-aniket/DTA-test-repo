import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import {
  ACCENTS,
  Accent,
  C,
  Caption,
  FONT,
  Letters,
  ProgressBar,
  Scene,
  Stage,
} from "./kit";

export const FPS = 30;
export const IMS_DURATION = 45 * FPS; // 1350 frames

// ---- Timeline (frames) ------------------------------------------------------
const HOOK = { from: 0, dur: 150 }; //                 0s  - 5s
const PROBLEM = { from: 150, dur: 180 }; //            5s  - 11s
const WHAT = { from: 330, dur: 180 }; //              11s  - 17s
const BENEFITS = { from: 510, each: 108, count: 5 }; // 17s - 35s
const PAYOFF = { from: 1050, each: 70, count: 3 }; //  35s - 42s
const OUTRO = { from: 1260, dur: 90 }; //              42s - 45s

const Hook: React.FC = () => (
  <Scene>
    <Caption text="INVENTORY MANAGEMENT SYSTEMS" size={44} delay={4} color={C.cyan} />
    <Letters text="YOUR STOCK" size={230} delay={6} />
    <Letters text="IS YOUR MONEY" size={170} delay={28} accent={ACCENTS.yellow} />
  </Scene>
);

const PROBLEMS: { word: string; note: string; accent: Accent }[] = [
  { word: "STOCKOUTS", note: "Empty shelves. Lost sales.", accent: ACCENTS.red },
  { word: "OVERSTOCK", note: "Cash frozen in dead inventory.", accent: ACCENTS.orange },
  { word: "GUESSWORK", note: "Spreadsheets. Hunches. Errors.", accent: ACCENTS.magenta },
];

const Problem: React.FC = () => (
  <>
    {PROBLEMS.map((p, i) => (
      <Sequence key={p.word} from={i * 60} durationInFrames={60} name={p.word}>
        <Scene swing={1.3}>
          <Letters text={p.word} size={260} accent={p.accent} stagger={1.5} from={i === 1 ? "above" : "back"} />
          <Caption text={p.note} delay={14} />
        </Scene>
      </Sequence>
    ))}
  </>
);

const WhatIsIMS: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={70} name="what-title">
      <Scene>
        <Letters text="WHAT IS AN" size={140} delay={0} />
        <Letters text="IMS?" size={400} delay={10} accent={ACCENTS.cyan} stagger={4} />
      </Scene>
    </Sequence>
    <Sequence from={70} durationInFrames={110} name="what-definition">
      <Scene swing={0.8}>
        <Letters text="ONE SYSTEM." size={130} delay={0} stagger={1.5} />
        <Letters text="EVERY ITEM." size={130} delay={20} stagger={1.5} accent={ACCENTS.cyan} />
        <Letters text="EVERY LOCATION." size={130} delay={40} stagger={1.5} accent={ACCENTS.magenta} />
        <Letters text="REAL TIME." size={130} delay={60} stagger={1.5} accent={ACCENTS.lime} />
      </Scene>
    </Sequence>
  </>
);

const BENEFIT_LIST: {
  lines: [string, string];
  note: string;
  accent: Accent;
}[] = [
  { lines: ["REAL-TIME", "VISIBILITY"], note: "Know exactly what you have, and where.", accent: ACCENTS.cyan },
  { lines: ["FEWER", "STOCKOUTS"], note: "Never lose a sale to an empty shelf.", accent: ACCENTS.orange },
  { lines: ["LOWER", "COSTS"], note: "Cut overstock and free up your cash.", accent: ACCENTS.lime },
  { lines: ["AUTO", "REORDERING"], note: "Smart alerts restock before you run out.", accent: ACCENTS.magenta },
  { lines: ["BETTER", "DECISIONS"], note: "Reports and forecasts turn data into growth.", accent: ACCENTS.yellow },
];

const BigNumber: React.FC<{ n: string; color: string }> = ({ n, color }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 108], [-80, 80]);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 820,
        color,
        opacity: 0.09,
        transform: `translate3d(${x}px, 0, -600px) rotateY(${x / 4}deg)`,
        lineHeight: 1,
      }}
    >
      {n}
    </div>
  );
};

const Benefit: React.FC<{ i: number }> = ({ i }) => {
  const b = BENEFIT_LIST[i];
  return (
    <Scene>
      <BigNumber n={`0${i + 1}`} color={b.accent.main} />
      <Caption text={`BENEFIT 0${i + 1}`} size={40} delay={2} color={b.accent.main} />
      <Letters text={b.lines[0]} size={190} accent={ACCENTS.white} delay={4} stagger={1.8} />
      <Letters text={b.lines[1]} size={190} accent={b.accent} delay={14} stagger={1.8} />
      <Caption text={b.note} delay={32} />
    </Scene>
  );
};

const PAYOFF_WORDS: { a: string; b: string; accent: Accent }[] = [
  { a: "SMARTER", b: "STOCK", accent: ACCENTS.cyan },
  { a: "HAPPIER", b: "CUSTOMERS", accent: ACCENTS.magenta },
  { a: "BIGGER", b: "PROFITS", accent: ACCENTS.lime },
];

const Payoff: React.FC<{ i: number }> = ({ i }) => {
  const w = PAYOFF_WORDS[i];
  return (
    <Scene swing={1.4}>
      <Letters text={w.a} size={250} delay={0} stagger={1.5} from={i === 1 ? "above" : "back"} />
      <Letters text={w.b} size={250} delay={10} stagger={1.5} accent={w.accent} from={i === 1 ? "above" : "back"} />
    </Scene>
  );
};

const Outro: React.FC = () => (
  <Scene swing={0.7}>
    <Letters text="IMS" size={520} accent={ACCENTS.cyan} stagger={5} depth={22} />
    <Caption text="INVENTORY MANAGEMENT SYSTEM" size={52} delay={26} color={C.white} />
    <Caption text="Take control of your stock." size={44} delay={38} />
  </Scene>
);

/** Backdrop tint follows the story: cyan -> red (problem) -> cyan -> accents -> cyan. */
const useTint = (frame: number): string => {
  if (frame >= PROBLEM.from && frame < PROBLEM.from + PROBLEM.dur) return C.red;
  if (frame >= BENEFITS.from && frame < PAYOFF.from) {
    const i = Math.floor((frame - BENEFITS.from) / BENEFITS.each);
    return BENEFIT_LIST[Math.min(i, BENEFIT_LIST.length - 1)].accent.main;
  }
  return C.cyan;
};

export const IMSVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const tint = useTint(frame);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Stage tint={tint} />

      <Sequence from={HOOK.from} durationInFrames={HOOK.dur} name="Hook">
        <Hook />
      </Sequence>
      <Sequence from={PROBLEM.from} durationInFrames={PROBLEM.dur} name="Problem">
        <Problem />
      </Sequence>
      <Sequence from={WHAT.from} durationInFrames={WHAT.dur} name="What is IMS">
        <WhatIsIMS />
      </Sequence>
      {Array.from({ length: BENEFITS.count }).map((_, i) => (
        <Sequence
          key={`b${i}`}
          from={BENEFITS.from + i * BENEFITS.each}
          durationInFrames={BENEFITS.each}
          name={`Benefit ${i + 1}`}
        >
          <Benefit i={i} />
        </Sequence>
      ))}
      {Array.from({ length: PAYOFF.count }).map((_, i) => (
        <Sequence
          key={`p${i}`}
          from={PAYOFF.from + i * PAYOFF.each}
          durationInFrames={PAYOFF.each}
          name={`Payoff ${i + 1}`}
        >
          <Payoff i={i} />
        </Sequence>
      ))}
      <Sequence from={OUTRO.from} durationInFrames={OUTRO.dur} name="Outro">
        <Outro />
      </Sequence>

      <ProgressBar color={tint} />
    </AbsoluteFill>
  );
};

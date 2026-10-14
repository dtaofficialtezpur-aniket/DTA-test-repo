import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  A,
  Accent,
  Badge,
  Col,
  Letters,
  Note,
  P,
  ProgressBar,
  SANS,
  Scene,
  Stage,
} from "./kit";
import { Subtitles } from "./Subtitles";
import {
  CostViz,
  DashViz,
  ForecastViz,
  GuessViz,
  LocationsViz,
  OutViz,
  OverViz,
  ReorderViz,
  ShelfViz,
} from "./viz";

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
    <Badge text="INVENTORY MANAGEMENT SYSTEM" accent={A.indigo} delay={2} size={26} />
    <Letters text="AAPKA STOCK" size={215} delay={6} />
    <Letters text="aapka paisa." font="serif" size={300} accent={A.emerald} delay={26} stagger={2.5} />
    <Note text="Ise kismat par kyun chhodna?" size={58} delay={62} />
  </Scene>
);

const PROBLEMS: { word: string; note: string; accent: Accent; Viz: React.FC }[] = [
  { word: "STOCKOUT", note: "Khaali shelf, gayi sale.", accent: A.coral, Viz: OutViz },
  { word: "OVERSTOCK", note: "Cash phansa, godown full.", accent: A.amber, Viz: OverViz },
  { word: "ANDAAZE", note: "Spreadsheet, hunch, galtiyaan.", accent: A.violet, Viz: GuessViz },
];

const Problem: React.FC = () => (
  <>
    {PROBLEMS.map((p, i) => (
      <Sequence key={p.word} from={i * 60} durationInFrames={60} name={p.word}>
        <Scene row swing={1.1}>
          <Col>
            <Badge text={`PROBLEM 0${i + 1}`} accent={p.accent} delay={0} size={24} />
            <Letters text={p.word} size={150} accent={p.accent} align="left" stagger={1.5} />
            <Note text={p.note} size={54} align="left" delay={12} />
          </Col>
          <p.Viz />
        </Scene>
      </Sequence>
    ))}
  </>
);

const WhatIsIMS: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={70} name="what-title">
      <Scene>
        <Letters text="IMS" size={440} accent={A.indigo} delay={0} stagger={4} />
        <Letters text="kya hai?" font="serif" size={190} accent={A.violet} delay={14} stagger={2.5} />
      </Scene>
    </Sequence>
    <Sequence from={70} durationInFrames={110} name="what-definition">
      <Scene row swing={0.8}>
        <Col gap={12}>
          <Letters text="EK SYSTEM." size={112} delay={0} stagger={1.5} align="left" />
          <Letters text="HAR ITEM." size={112} delay={16} stagger={1.5} align="left" accent={A.indigo} />
          <Letters text="HAR LOCATION." size={112} delay={32} stagger={1.5} align="left" accent={A.coral} />
          <Letters text="REAL TIME." size={112} delay={48} stagger={1.5} align="left" accent={A.emerald} />
        </Col>
        <DashViz />
      </Scene>
    </Sequence>
  </>
);

const BENEFIT_LIST: {
  lines: [string, string];
  note: string;
  accent: Accent;
  Viz: React.FC;
}[] = [
  { lines: ["REAL-TIME", "visibility"], note: "Kya kahan hai, sab pata.", accent: A.indigo, Viz: LocationsViz },
  { lines: ["KAM", "stockouts."], note: "Khaali shelf se sale nahi jaayegi.", accent: A.coral, Viz: ShelfViz },
  { lines: ["KAM", "kharcha."], note: "Overstock hatao, cash free karo.", accent: A.emerald, Viz: CostViz },
  { lines: ["AUTO", "reorder."], note: "Stock khatam hone se pehle order.", accent: A.violet, Viz: ReorderViz },
  { lines: ["BEHTAR", "faisle."], note: "Report aur forecast se growth.", accent: A.amber, Viz: ForecastViz },
];

const GhostNumber: React.FC<{ n: string; accent: Accent }> = ({ n, accent }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 108], [-60, 60]);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 900,
        lineHeight: 1,
        color: accent.main,
        opacity: 0.07,
        transform: `translate3d(${x}px, 0, -700px)`,
      }}
    >
      {n}
    </div>
  );
};

const Benefit: React.FC<{ i: number }> = ({ i }) => {
  const b = BENEFIT_LIST[i];
  return (
    <Scene row>
      <GhostNumber n={`0${i + 1}`} accent={b.accent} />
      <Col gap={14}>
        <Badge text={`FAYDA 0${i + 1}`} accent={b.accent} delay={2} size={24} />
        <Letters text={b.lines[0]} size={140} delay={4} stagger={1.8} align="left" />
        <Letters text={b.lines[1]} font="serif" size={215} accent={b.accent} delay={14} stagger={2} align="left" />
        <Note text={b.note} size={52} align="left" delay={32} />
      </Col>
      <b.Viz />
    </Scene>
  );
};

const PAYOFF_WORDS: { a: string; b: string; accent: Accent }[] = [
  { a: "SMART", b: "stock.", accent: A.indigo },
  { a: "KHUSH", b: "customers.", accent: A.coral },
  { a: "ZYADA", b: "profit.", accent: A.emerald },
];

const Payoff: React.FC<{ i: number }> = ({ i }) => {
  const w = PAYOFF_WORDS[i];
  return (
    <Scene swing={1.3}>
      <Letters text={w.a} size={250} delay={0} stagger={1.5} from={i === 1 ? "above" : "back"} />
      <Letters text={w.b} font="serif" size={330} accent={w.accent} delay={10} stagger={2} from={i === 1 ? "above" : "back"} />
    </Scene>
  );
};

const Outro: React.FC = () => (
  <Scene swing={0.7}>
    <Letters text="IMS" size={520} accent={A.indigo} stagger={5} />
    <Badge text="INVENTORY MANAGEMENT SYSTEM" accent={A.indigo} delay={26} size={30} />
    <Note text="Apni inventory ko control karo." size={70} delay={38} color={P.ink} />
  </Scene>
);

/** Backdrop tint follows the story. */
const useTint = (frame: number): Accent => {
  if (frame >= PROBLEM.from && frame < PROBLEM.from + PROBLEM.dur) return A.coral;
  if (frame >= BENEFITS.from && frame < PAYOFF.from) {
    const i = Math.floor((frame - BENEFITS.from) / BENEFITS.each);
    return BENEFIT_LIST[Math.min(i, BENEFIT_LIST.length - 1)].accent;
  }
  return A.indigo;
};

export const IMSVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const tint = useTint(frame);
  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      <Stage tint={tint} />
      <Audio src={staticFile("audio/music.mp3")} volume={1} />
      <Audio src={staticFile("audio/voice.mp3")} volume={1} />

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

      <Subtitles accent={tint} />
      <ProgressBar accent={tint} />
    </AbsoluteFill>
  );
};

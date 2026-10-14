import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { A, Accent, UI } from "./kit";

type Word = { w: string; s: number; e: number };
type Cap = { start: number; end: number; words: Word[] };

/**
 * Voiceover captions on a dark frosted bar. `captions.json` holds the start time
 * of every line and word (generated with the voiceover), so the highlight follows the voice.
 */
export const Subtitles: React.FC<{ accent?: Accent }> = ({ accent = A.indigo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cap = (captions as Cap[]).find((c) => t >= c.start - 0.12 && t <= c.end + 0.4);
  if (!cap) return null;

  const enter = spring({
    frame: frame - Math.round((cap.start - 0.12) * fps),
    fps,
    config: { damping: 16, stiffness: 170 },
  });
  const fade = interpolate(t, [cap.end + 0.2, cap.end + 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 50,
        display: "flex",
        justifyContent: "center",
        opacity: fade * interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          textAlign: "center",
          fontFamily: UI,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.25,
          padding: "18px 46px",
          borderRadius: 38,
          background: "rgba(20,20,43,0.86)",
          border: "1.5px solid rgba(255,255,255,0.14)",
          boxShadow: "0 22px 50px -12px rgba(20,20,43,0.5)",
          backdropFilter: "blur(14px)",
        }}
      >
        {cap.words.map((word, i) => {
          const spoken = t >= word.e;
          const current = t >= word.s && t < word.e;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "0 7px",
                marginRight: 6,
                borderRadius: 12,
                color: current ? "#fff" : spoken ? "#fff" : "rgba(255,255,255,0.42)",
                background: current ? `linear-gradient(135deg, ${accent.light}, ${accent.main})` : "transparent",
                transform: current ? "scale(1.07)" : "scale(1)",
              }}
            >
              {word.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "./captions.json";
import { C, FONT } from "./kit";

type Word = { w: string; s: number; e: number };
type Cap = { start: number; end: number; words: Word[] };

/**
 * Voiceover captions. `captions.json` holds the start time of every line and
 * word, generated alongside the voiceover audio, so the highlight follows the voice.
 */
export const Subtitles: React.FC<{ color?: string }> = ({ color = C.cyan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cap = (captions as Cap[]).find(
    (c) => t >= c.start - 0.12 && t <= c.end + 0.4,
  );
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
        bottom: 46,
        display: "flex",
        justifyContent: "center",
        opacity: fade * interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1560,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.25,
          padding: "16px 44px",
          borderRadius: 40,
          background: "rgba(255,255,255,0.94)",
          border: "2px solid rgba(15,23,42,0.06)",
          boxShadow: "0 14px 40px rgba(15,23,42,0.18)",
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
                marginRight: 0,
                padding: "0 7px",
                borderRadius: 12,
                color: current ? C.white : spoken ? C.ink : "#94a3b8",
                background: current ? color : "transparent",
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

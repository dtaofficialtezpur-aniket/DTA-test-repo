import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

export const C = {
  bg: "#060a18",
  white: "#f8fafc",
  muted: "#94a3b8",
  cyan: "#22d3ee",
  cyanSide: "#0e7490",
  orange: "#fb923c",
  orangeSide: "#9a3412",
  magenta: "#e879f9",
  magentaSide: "#86198f",
  lime: "#a3e635",
  limeSide: "#4d7c0f",
  yellow: "#facc15",
  yellowSide: "#854d0e",
  red: "#f87171",
  redSide: "#991b1b",
  whiteSide: "#475569",
};

export type Accent = { main: string; side: string };
export const ACCENTS: Record<string, Accent> = {
  white: { main: C.white, side: C.whiteSide },
  cyan: { main: C.cyan, side: C.cyanSide },
  orange: { main: C.orange, side: C.orangeSide },
  magenta: { main: C.magenta, side: C.magentaSide },
  lime: { main: C.lime, side: C.limeSide },
  yellow: { main: C.yellow, side: C.yellowSide },
  red: { main: C.red, side: C.redSide },
};

/**
 * One line of extruded 3D text. Every letter flies in from deep space with its
 * own spring, staggered left to right.
 */
export const Letters: React.FC<{
  text: string;
  size: number;
  accent?: Accent;
  delay?: number;
  stagger?: number;
  depth?: number;
  from?: "back" | "below" | "above";
}> = ({
  text,
  size,
  accent = ACCENTS.white,
  delay = 0,
  stagger = 2,
  depth = 14,
  from = "back",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dir = from === "above" ? -1 : 1;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        transformStyle: "preserve-3d",
        fontSize: size,
        lineHeight: 1,
        fontFamily: FONT,
        fontWeight: 900,
        letterSpacing: -size * 0.02,
        whiteSpace: "pre",
      }}
    >
      {[...text].map((ch, i) => {
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 12, stiffness: 110, mass: 0.7 },
        });
        const ry = interpolate(p, [0, 1], [-110, 0]);
        const rx = interpolate(p, [0, 1], [from === "back" ? 50 : 90 * dir, 0]);
        const z = interpolate(p, [0, 1], [from === "back" ? -1000 : -200, 0]);
        const y = interpolate(p, [0, 1], [from === "back" ? 80 : 260 * dir, 0]);
        const opacity = interpolate(p, [0, 0.2], [0, 1], {
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              transformStyle: "preserve-3d",
              transform: `translate3d(0, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
              opacity,
              color: accent.main,
              textShadow: `0 0 ${size * 0.25}px ${accent.main}55`,
            }}
          >
            {Array.from({ length: depth }).map((_, k) => (
              <span
                key={k}
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  color: accent.side,
                  textShadow: "none",
                  transform: `translateZ(${-(k + 1) * 3}px)`,
                }}
              >
                {ch}
              </span>
            ))}
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Small supporting line that tilts up into place. */
export const Caption: React.FC<{
  text: string;
  size?: number;
  delay?: number;
  color?: string;
}> = ({ text, size = 54, delay = 0, color = C.muted }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color,
        textAlign: "center",
        opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) rotateX(${interpolate(p, [0, 1], [-70, 0])}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {text}
    </div>
  );
};

/**
 * Wraps a scene: sets up perspective, a slowly orbiting camera, and a push-through
 * exit so every scene dives toward the viewer as the next one arrives.
 */
export const Scene: React.FC<{ children: React.ReactNode; swing?: number }> = ({
  children,
  swing = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitStart = durationInFrames - 14;
  const e = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ry = Math.sin(frame / 38) * 9 * swing;
  const rx = Math.cos(frame / 52) * 4 * swing;

  return (
    <AbsoluteFill
      style={{
        perspective: 1500,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          transform: `translateZ(${e * 900}px) rotateX(${rx + e * -25}deg) rotateY(${ry}deg)`,
          opacity: 1 - e,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Cube: React.FC<{ size: number; frame: number; seed: string }> = ({
  size,
  frame,
  seed,
}) => {
  const h = size / 2;
  const face: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: "rgba(34, 211, 238, 0.06)",
    border: "2px solid rgba(34, 211, 238, 0.45)",
    boxShadow: "inset 0 0 30px rgba(34, 211, 238, 0.18)",
  };
  const spinX = random(seed + "x") * 360 + frame * (0.4 + random(seed + "sx"));
  const spinY = random(seed + "y") * 360 + frame * (0.6 + random(seed + "sy"));
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: `rotateX(${spinX}deg) rotateY(${spinY}deg)`,
      }}
    >
      <div style={{ ...face, transform: `translateZ(${h}px)` }} />
      <div style={{ ...face, transform: `rotateY(180deg) translateZ(${h}px)` }} />
      <div style={{ ...face, transform: `rotateY(90deg) translateZ(${h}px)` }} />
      <div style={{ ...face, transform: `rotateY(-90deg) translateZ(${h}px)` }} />
      <div style={{ ...face, transform: `rotateX(90deg) translateZ(${h}px)` }} />
      <div style={{ ...face, transform: `rotateX(-90deg) translateZ(${h}px)` }} />
    </div>
  );
};

/** Persistent backdrop: glowing perspective floor grid + drifting wireframe crates. */
export const Stage: React.FC<{ tint?: string }> = ({ tint = C.cyan }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const crates = Array.from({ length: 14 }).map((_, i) => {
    const seed = `crate-${i}`;
    const x = random(seed + "px") * width;
    const size = 70 + random(seed + "s") * 120;
    const speed = 0.25 + random(seed + "v") * 0.6;
    const total = height + 400;
    const y = height + 200 - ((random(seed + "py") * total + frame * speed * 2) % total);
    const z = -900 + random(seed + "pz") * 700;
    return { seed, x, y, z, size };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${tint}22 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill style={{ perspective: 800, perspectiveOrigin: "50% 38%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: 5200,
            height: 4200,
            marginLeft: -2600,
            transformOrigin: "50% 0%",
            transform: "rotateX(76deg)",
            backgroundImage: `linear-gradient(${tint}66 2px, transparent 2px), linear-gradient(90deg, ${tint}66 2px, transparent 2px)`,
            backgroundSize: "130px 130px",
            backgroundPosition: `0px ${frame * 3}px`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg}00 35%, ${C.bg}00 70%, ${C.bg}cc 100%)`,
        }}
      />
      <AbsoluteFill style={{ perspective: 1100, opacity: 0.85 }}>
        {crates.map((c) => (
          <div
            key={c.seed}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: `translateZ(${c.z}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <Cube size={c.size} frame={frame} seed={c.seed} />
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ProgressBar: React.FC<{ color?: string }> = ({ color = C.cyan }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 8,
        width: `${(frame / durationInFrames) * 100}%`,
        background: color,
        boxShadow: `0 0 20px ${color}`,
      }}
    />
  );
};

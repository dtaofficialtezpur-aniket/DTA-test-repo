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

// Bright palette: pale sky background, deep-navy ink, saturated accents.
export const C = {
  bg: "#f4f8ff",
  ink: "#0f172a",
  white: "#ffffff",
  muted: "#475569",
  // names kept from the dark version so scene code stays readable
  cyan: "#2f6bff",
  cyanSide: "#1e3a8a",
  orange: "#ff7a1a",
  orangeSide: "#9a3412",
  magenta: "#ec4899",
  magentaSide: "#9d174d",
  lime: "#12b76a",
  limeSide: "#065f46",
  yellow: "#ffb703",
  yellowSide: "#a16207",
  red: "#ef4444",
  redSide: "#991b1b",
  inkSide: "#64748b",
};

export type Accent = { main: string; side: string };
export const ACCENTS: Record<string, Accent> = {
  white: { main: C.ink, side: C.inkSide },
  cyan: { main: C.cyan, side: C.cyanSide },
  orange: { main: C.orange, side: C.orangeSide },
  magenta: { main: C.magenta, side: C.magentaSide },
  lime: { main: C.lime, side: C.limeSide },
  yellow: { main: C.yellow, side: C.yellowSide },
  red: { main: C.red, side: C.redSide },
};

const CRATE_COLORS = [C.cyan, C.orange, C.magenta, C.lime, C.yellow];

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
              textShadow: `0 ${size * 0.07}px ${size * 0.1}px ${accent.main}38`,
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
        fontWeight: 700,
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

/** Sticker-style pill label that pops in. */
export const Badge: React.FC<{
  text: string;
  color: string;
  delay?: number;
  size?: number;
}> = ({ text, color, delay = 0, size = 36 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.6 },
  });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: size * 0.12,
        color: C.white,
        background: color,
        padding: `${size * 0.28}px ${size * 0.9}px`,
        borderRadius: 999,
        boxShadow: `0 12px 30px ${color}66`,
        transform: `scale(${interpolate(p, [0, 1], [0.2, 1])}) rotate(${interpolate(p, [0, 1], [-12, 0])}deg)`,
        opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
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
        paddingBottom: 110, // leaves room for the subtitle bar
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

const Cube: React.FC<{ size: number; frame: number; seed: string; color: string }> = ({
  size,
  frame,
  seed,
  color,
}) => {
  const h = size / 2;
  const face = (fill: string): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    background: `${color}${fill}`,
    border: `3px solid ${color}`,
    borderRadius: size * 0.06,
    boxShadow: `inset 0 0 ${size * 0.25}px ${color}55`,
  });
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
      <div style={{ ...face("55"), transform: `translateZ(${h}px)` }} />
      <div style={{ ...face("33"), transform: `rotateY(180deg) translateZ(${h}px)` }} />
      <div style={{ ...face("44"), transform: `rotateY(90deg) translateZ(${h}px)` }} />
      <div style={{ ...face("44"), transform: `rotateY(-90deg) translateZ(${h}px)` }} />
      <div style={{ ...face("66"), transform: `rotateX(90deg) translateZ(${h}px)` }} />
      <div style={{ ...face("33"), transform: `rotateX(-90deg) translateZ(${h}px)` }} />
    </div>
  );
};

/** Persistent bright backdrop: color glows, perspective floor, drifting crates and dots. */
export const Stage: React.FC<{ tint?: string }> = ({ tint = C.cyan }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const crates = Array.from({ length: 13 }).map((_, i) => {
    const seed = `crate-${i}`;
    const x = random(seed + "px") * width;
    const size = 70 + random(seed + "s") * 120;
    const speed = 0.25 + random(seed + "v") * 0.6;
    const total = height + 400;
    const y = height + 200 - ((random(seed + "py") * total + frame * speed * 2) % total);
    const z = -900 + random(seed + "pz") * 700;
    return { seed, x, y, z, size, color: CRATE_COLORS[i % CRATE_COLORS.length] };
  });

  const dots = Array.from({ length: 22 }).map((_, i) => {
    const seed = `dot-${i}`;
    const size = 12 + random(seed + "s") * 30;
    const total = height + 100;
    const y = height + 50 - ((random(seed + "y") * total + frame * (0.8 + random(seed + "v") * 1.4)) % total);
    const x = random(seed + "x") * width + Math.sin(frame / 40 + i) * 24;
    return { seed, x, y, size, color: CRATE_COLORS[(i + 2) % CRATE_COLORS.length] };
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #ffffff 0%, #eef4ff 50%, #dbe7ff 100%)`,
        overflow: "hidden",
      }}
    >
      {/* drifting colour glows */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${28 + Math.sin(frame / 90) * 8}% ${30 + Math.cos(frame / 70) * 8}%, ${tint}40 0%, transparent 38%),
                       radial-gradient(circle at ${74 + Math.cos(frame / 80) * 8}% ${62 + Math.sin(frame / 100) * 8}%, ${CRATE_COLORS[2]}30 0%, transparent 34%),
                       radial-gradient(circle at 60% 12%, ${CRATE_COLORS[4]}33 0%, transparent 30%)`,
        }}
      />

      {/* perspective floor */}
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
            backgroundImage: `linear-gradient(${tint}77 3px, transparent 3px), linear-gradient(90deg, ${tint}77 3px, transparent 3px)`,
            backgroundSize: "130px 130px",
            backgroundPosition: `0px ${frame * 3}px`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #eef4ff00 0%, #eef4ff00 48%, #eef4ff 52%, #eef4ff00 66%, #eef4ff00 100%)`,
          opacity: 0.55,
        }}
      />

      {/* confetti dots */}
      {dots.map((d) => (
        <div
          key={d.seed}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            opacity: 0.28,
          }}
        />
      ))}

      {/* floating crates */}
      <AbsoluteFill style={{ perspective: 1100, opacity: 0.9 }}>
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
            <Cube size={c.size} frame={frame} seed={c.seed} color={c.color} />
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
        height: 10,
        width: `${(frame / durationInFrames) * 100}%`,
        background: color,
        boxShadow: `0 0 18px ${color}99`,
      }}
    />
  );
};

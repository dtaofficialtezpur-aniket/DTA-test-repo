import React, { CSSProperties } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./fonts";

export const SANS = "Bricolage, Inter, 'Helvetica Neue', Arial, sans-serif";
export const SERIF = "Instrument, 'Times New Roman', serif";
export const UI = "Inter, 'Helvetica Neue', Arial, sans-serif";

export type Accent = { light: string; main: string; side: string };

// Premium palette: warm ivory, deep indigo ink, a few refined jewel accents.
export const P = {
  bg: "#faf8f4",
  ink: "#14142b",
  soft: "#5b5b78",
  faint: "#9a9ab4",
  white: "#ffffff",
};

export const A: Record<
  "ink" | "indigo" | "coral" | "emerald" | "amber" | "violet",
  Accent
> = {
  ink: { light: "#52528a", main: "#14142b", side: "#7d7da8" },
  indigo: { light: "#8f8cff", main: "#4338ca", side: "#231a7a" },
  coral: { light: "#ff9d8f", main: "#f0443f", side: "#8f1d24" },
  emerald: { light: "#6ee7b7", main: "#059669", side: "#064e3b" },
  amber: { light: "#fbbf24", main: "#d97706", side: "#78350f" },
  violet: { light: "#d2b8ff", main: "#7c3aed", side: "#3b1380" },
};

const BOX_COLORS: Accent[] = [A.indigo, A.coral, A.amber, A.emerald, A.violet];

type FontKind = "sans" | "serif";

const fontStyle = (kind: FontKind, size: number): CSSProperties =>
  kind === "sans"
    ? {
        fontFamily: SANS,
        fontWeight: 800,
        letterSpacing: -size * 0.03,
        textTransform: "uppercase",
      }
    : {
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 400,
        letterSpacing: -size * 0.012,
      };

/**
 * One line of extruded 3D text with a gradient face, a stepped extrusion and a
 * soft contact shadow. Each letter springs in from deep space, staggered.
 */
export const Letters: React.FC<{
  text: string;
  size: number;
  accent?: Accent;
  font?: FontKind;
  delay?: number;
  stagger?: number;
  align?: "center" | "left";
  from?: "back" | "above";
}> = ({
  text,
  size,
  accent = A.ink,
  font = "sans",
  delay = 0,
  stagger = 2,
  align = "center",
  from = "back",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const depth = font === "sans" ? 15 : 9;
  const step = font === "sans" ? 3 : 3.2;
  const dir = from === "above" ? -1 : 1;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: align === "left" ? "flex-start" : "center",
        transformStyle: "preserve-3d",
        fontSize: size,
        lineHeight: font === "sans" ? 1 : 0.95,
        whiteSpace: "pre",
        ...fontStyle(font, size),
      }}
    >
      {[...text].map((ch, i) => {
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 13, stiffness: 105, mass: 0.75 },
        });
        const ry = interpolate(p, [0, 1], [-100, 0]);
        const rx = interpolate(p, [0, 1], [from === "back" ? 45 : 85 * dir, 0]);
        const z = interpolate(p, [0, 1], [from === "back" ? -1100 : -250, 0]);
        const y = interpolate(p, [0, 1], [from === "back" ? 70 : 240 * dir, 0]);
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
            }}
          >
            {/* soft contact shadow, deepest layer */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: size * 0.07,
                color: "rgba(30,20,90,0.22)",
                filter: `blur(${size * 0.05}px)`,
                transform: `translateZ(${-(depth + 3) * step}px)`,
              }}
            >
              {ch}
            </span>
            {Array.from({ length: depth }).map((_, k) => (
              <span
                key={k}
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  color: accent.side,
                  transform: `translateZ(${-(k + 1) * step}px)`,
                }}
              >
                {ch}
              </span>
            ))}
            <span
              style={{
                position: "relative",
                backgroundImage: `linear-gradient(175deg, ${accent.light} 0%, ${accent.main} 62%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Supporting line in the editorial serif italic. */
export const Note: React.FC<{
  text: string;
  size?: number;
  delay?: number;
  color?: string;
  align?: "center" | "left";
}> = ({ text, size = 62, delay = 0, color = P.soft, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 90 } });
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontStyle: "italic",
        fontSize: size,
        color,
        textAlign: align,
        lineHeight: 1.1,
        opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px) rotateX(${interpolate(p, [0, 1], [-60, 0])}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      {text}
    </div>
  );
};

/** Frosted-glass pill label that pops in. */
export const Badge: React.FC<{
  text: string;
  accent: Accent;
  delay?: number;
  size?: number;
}> = ({ text, accent, delay = 0, size = 28 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 140, mass: 0.6 } });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.5,
        fontFamily: UI,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.14,
        color: P.ink,
        background: "rgba(255,255,255,0.78)",
        border: "1.5px solid rgba(255,255,255,0.95)",
        padding: `${size * 0.32}px ${size * 0.9}px`,
        borderRadius: 999,
        boxShadow: `0 14px 34px -8px ${accent.main}55, 0 2px 8px rgba(20,20,43,0.08)`,
        transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`,
        opacity: interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      <span
        style={{
          width: size * 0.44,
          height: size * 0.44,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${accent.light}, ${accent.main})`,
          boxShadow: `0 0 0 ${size * 0.16}px ${accent.main}22`,
        }}
      />
      {text}
    </div>
  );
};

/**
 * Wraps a scene: perspective, a slowly orbiting camera, and a push-through exit.
 * `row` lays out text on the left and a visual on the right.
 */
export const Scene: React.FC<{
  children: React.ReactNode;
  swing?: number;
  row?: boolean;
}> = ({ children, swing = 1, row = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const e = interpolate(frame, [durationInFrames - 14, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ry = Math.sin(frame / 38) * 6 * swing;
  const rx = Math.cos(frame / 52) * 3 * swing;

  return (
    <AbsoluteFill
      style={{
        perspective: 1600,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 150,
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: row ? "row" : "column",
          alignItems: row ? "center" : "center",
          justifyContent: "center",
          gap: row ? 125 : 26,
          transform: `translateZ(${e * 900}px) rotateX(${rx + e * -22}deg) rotateY(${ry}deg)`,
          opacity: 1 - e,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Left-aligned text column used beside a visual card. */
export const Col: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 20,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap,
      transformStyle: "preserve-3d",
    }}
  >
    {children}
  </div>
);

const Box3D: React.FC<{ size: number; frame: number; seed: string; c: Accent }> = ({
  size,
  frame,
  seed,
  c,
}) => {
  const h = size / 2;
  const face = (shade: number): CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size * 0.1,
    backgroundImage:
      shade >= 0
        ? `linear-gradient(rgba(10,5,40,${shade}), rgba(10,5,40,${shade})), linear-gradient(135deg, ${c.light}, ${c.main})`
        : `linear-gradient(rgba(255,255,255,${-shade}), rgba(255,255,255,${-shade})), linear-gradient(135deg, ${c.light}, ${c.main})`,
    border: "1.5px solid rgba(255,255,255,0.55)",
    overflow: "hidden",
  });
  const tape = (
    <div
      style={{
        position: "absolute",
        left: "40%",
        width: "20%",
        top: 0,
        bottom: 0,
        background: "rgba(255,255,255,0.34)",
      }}
    />
  );
  const spinX = random(seed + "x") * 360 + frame * (0.35 + random(seed + "sx") * 0.6);
  const spinY = random(seed + "y") * 360 + frame * (0.5 + random(seed + "sy") * 0.7);
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
      <div style={{ ...face(0), transform: `translateZ(${h}px)` }}>{tape}</div>
      <div style={{ ...face(0.34), transform: `rotateY(180deg) translateZ(${h}px)` }} />
      <div style={{ ...face(0.16), transform: `rotateY(90deg) translateZ(${h}px)` }} />
      <div style={{ ...face(0.26), transform: `rotateY(-90deg) translateZ(${h}px)` }} />
      <div style={{ ...face(-0.28), transform: `rotateX(90deg) translateZ(${h}px)` }}>{tape}</div>
      <div style={{ ...face(0.4), transform: `rotateX(-90deg) translateZ(${h}px)` }} />
    </div>
  );
};

const STAR = "M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z";
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.2  0 0 0 .7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Persistent premium backdrop: mesh gradient, soft floor grid, glossy boxes, sparkles, grain. */
export const Stage: React.FC<{ tint?: Accent }> = ({ tint = A.indigo }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const boxes = Array.from({ length: 11 }).map((_, i) => {
    const seed = `box-${i}`;
    const x = random(seed + "px") * width;
    const size = 70 + random(seed + "s") * 110;
    const speed = 0.25 + random(seed + "v") * 0.55;
    const total = height + 420;
    const y = height + 210 - ((random(seed + "py") * total + frame * speed * 2) % total);
    const z = -1000 + random(seed + "pz") * 800;
    return { seed, x, y, z, size, c: BOX_COLORS[i % BOX_COLORS.length] };
  });

  const sparkles = Array.from({ length: 16 }).map((_, i) => {
    const seed = `sp-${i}`;
    const tw = 0.5 + 0.5 * Math.sin(frame / (14 + random(seed + "t") * 20) + i * 2);
    return {
      seed,
      x: random(seed + "x") * width,
      y: random(seed + "y") * height * 0.85,
      s: 14 + random(seed + "s") * 26,
      o: 0.15 + tw * 0.7,
      c: i % 2 ? A.amber.main : A.indigo.light,
    };
  });

  const m = (f: number, a: number, ph = 0) => Math.sin(frame / f + ph) * a;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #fdfcf9 0%, #f4f1ea 100%)",
        overflow: "hidden",
      }}
    >
      {/* drifting mesh gradient */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at ${24 + m(110, 7)}% ${28 + m(90, 8, 1)}%, ${tint.light}66 0%, transparent 34%),
            radial-gradient(circle at ${78 + m(100, 7, 2)}% ${24 + m(130, 6)}%, #ffd2c077 0%, transparent 32%),
            radial-gradient(circle at ${70 + m(95, 8, 3)}% ${78 + m(120, 7)}%, #b9f2dd66 0%, transparent 34%),
            radial-gradient(circle at ${18 + m(105, 6, 4)}% ${82 + m(85, 7)}%, #d9ccff66 0%, transparent 32%)`,
        }}
      />

      {/* faint perspective floor */}
      <AbsoluteFill style={{ perspective: 800, perspectiveOrigin: "50% 38%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "54%",
            width: 5200,
            height: 4200,
            marginLeft: -2600,
            transformOrigin: "50% 0%",
            transform: "rotateX(76deg)",
            backgroundImage: `linear-gradient(${tint.main}26 2px, transparent 2px), linear-gradient(90deg, ${tint.main}26 2px, transparent 2px)`,
            backgroundSize: "130px 130px",
            backgroundPosition: `0px ${frame * 3}px`,
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%, transparent 70%)",
            maskImage: "linear-gradient(180deg, transparent 0%, #000 22%, transparent 70%)",
          }}
        />
      </AbsoluteFill>

      {/* glossy boxes with depth of field */}
      <AbsoluteFill style={{ perspective: 1100 }}>
        {boxes.map((b) => (
          <div
            key={b.seed}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              transform: `translateZ(${b.z}px)`,
              transformStyle: "preserve-3d",
              opacity: 0.92,
              filter: b.z < -650 ? "blur(4px)" : undefined,
            }}
          >
            <Box3D size={b.size} frame={frame} seed={b.seed} c={b.c} />
          </div>
        ))}
      </AbsoluteFill>

      {/* sparkles */}
      {sparkles.map((s) => (
        <svg
          key={s.seed}
          width={s.s}
          height={s.s}
          viewBox="0 0 24 24"
          style={{ position: "absolute", left: s.x, top: s.y, opacity: s.o }}
        >
          <path d={STAR} fill={s.c} />
        </svg>
      ))}

      {/* vignette + film grain */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(30,20,90,0.10) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ backgroundImage: GRAIN, opacity: 0.16, mixBlendMode: "multiply" }}
      />
    </AbsoluteFill>
  );
};

export const ProgressBar: React.FC<{ accent?: Accent }> = ({ accent = A.indigo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 7,
        width: `${(frame / durationInFrames) * 100}%`,
        background: `linear-gradient(90deg, ${accent.light}, ${accent.main})`,
        boxShadow: `0 0 16px ${accent.main}88`,
      }}
    />
  );
};

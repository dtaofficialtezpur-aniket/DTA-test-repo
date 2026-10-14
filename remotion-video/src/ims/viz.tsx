import React, { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { A, Accent, P, SANS, UI } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inr = (n: number) => n.toLocaleString("en-IN");

/** Entrance spring 0 -> 1 starting at `delay` frames. */
const useIn = (delay: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 120, mass: 0.7 } });
};

/** Frosted-glass card, tilted in 3D, floating gently. */
export const Card: React.FC<{
  title: string;
  tag?: { text: string; accent: Accent };
  delay?: number;
  children: React.ReactNode;
  footnote?: string;
  width?: number;
}> = ({ title, tag, delay = 6, children, footnote = "Sample data", width = 690 }) => {
  const frame = useCurrentFrame();
  const p = useIn(delay, 15);
  const bob = Math.sin(frame / 26) * 7;
  return (
    <div
      style={{
        width,
        borderRadius: 40,
        padding: "34px 38px 26px",
        background: "linear-gradient(150deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62))",
        border: "1.5px solid rgba(255,255,255,0.95)",
        boxShadow:
          "0 50px 90px -30px rgba(50,35,150,0.35), 0 12px 30px rgba(20,20,43,0.08), inset 0 1px 0 #fff",
        backdropFilter: "blur(26px)",
        fontFamily: UI,
        color: P.ink,
        opacity: interpolate(p, [0, 0.35], [0, 1], clamp),
        transform: `translate3d(0, ${(1 - p) * 90 + bob}px, ${(p - 1) * 450}px) rotateY(${-15 + (1 - p) * 35}deg) rotateX(4deg)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink }}>{title}</div>
        {tag && <Pill accent={tag.accent}>{tag.text}</Pill>}
      </div>
      {children}
      <div style={{ marginTop: 18, fontSize: 18, color: P.faint, fontWeight: 600, letterSpacing: 1 }}>{footnote}</div>
    </div>
  );
};

const Pill: React.FC<{ accent: Accent; children: React.ReactNode; solid?: boolean; style?: CSSProperties }> = ({
  accent,
  children,
  solid,
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 800,
      fontSize: 20,
      letterSpacing: 1.5,
      padding: "7px 16px",
      borderRadius: 999,
      color: solid ? "#fff" : accent.main,
      background: solid ? `linear-gradient(135deg, ${accent.light}, ${accent.main})` : `${accent.main}1c`,
      ...style,
    }}
  >
    {children}
  </span>
);

const LiveDot: React.FC<{ accent: Accent }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
  return (
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: accent.main,
        boxShadow: `0 0 0 ${3 + pulse * 7}px ${accent.main}33`,
        display: "inline-block",
      }}
    />
  );
};

const Bar: React.FC<{ pct: number; accent: Accent; h?: number }> = ({ pct, accent, h = 14 }) => (
  <div style={{ height: h, borderRadius: h, background: "rgba(20,20,43,0.08)", overflow: "hidden", flex: 1 }}>
    <div
      style={{
        width: `${Math.max(0, Math.min(100, pct))}%`,
        height: "100%",
        borderRadius: h,
        background: `linear-gradient(90deg, ${accent.light}, ${accent.main})`,
      }}
    />
  </div>
);

const Row: React.FC<{
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "16px 20px",
      borderRadius: 24,
      background: "rgba(255,255,255,0.82)",
      border: "1px solid rgba(20,20,43,0.06)",
      boxShadow: "0 6px 18px -8px rgba(20,20,43,0.14)",
      marginBottom: 14,
      ...style,
    }}
  >
    {children}
  </div>
);

const Avatar: React.FC<{ letter: string; accent: Accent }> = ({ letter, accent }) => (
  <div
    style={{
      width: 52,
      height: 52,
      borderRadius: 16,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 26,
      color: "#fff",
      background: `linear-gradient(135deg, ${accent.light}, ${accent.main})`,
    }}
  >
    {letter}
  </div>
);

const Name: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div style={{ minWidth: 230 }}>
    <div style={{ fontWeight: 700, fontSize: 26 }}>{title}</div>
    {sub && <div style={{ fontWeight: 500, fontSize: 19, color: P.soft, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Qty: React.FC<{ n: number; color?: string }> = ({ n, color = P.ink }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color, minWidth: 96, textAlign: "right" }}>
    {inr(n)}
  </div>
);

/* ------------------------------------------------------------------ problems */

export const OutViz: React.FC = () => {
  const p = useIn(18, 11);
  return (
    <Card title="Shelf Status" tag={{ text: "ALERT", accent: A.coral }} footnote="Illustration">
      <Row>
        <Avatar letter="S" accent={A.coral} />
        <Name title="Sneakers" sub="Size 9 · Black" />
        <div style={{ flex: 1 }} />
        <Pill accent={A.coral} solid>OUT OF STOCK</Pill>
      </Row>
      <Row>
        <Avatar letter="B" accent={A.indigo} />
        <Name title="Backpack" sub="Navy" />
        <Bar pct={66} accent={A.indigo} />
        <Qty n={48} />
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Avatar letter="W" accent={A.violet} />
        <Name title="Watch" sub="Classic" />
        <Bar pct={44} accent={A.violet} />
        <Qty n={31} />
      </Row>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 22px",
          borderRadius: 22,
          background: `${A.coral.main}14`,
          border: `1.5px dashed ${A.coral.main}77`,
          fontWeight: 800,
          fontSize: 26,
          color: A.coral.side,
          opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${(1 - p) * 30}px)`,
        }}
      >
        <span style={{ fontSize: 34 }}>✕</span> Customer wapas gaya · Sale lost
      </div>
    </Card>
  );
};

export const OverViz: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [8, 40], [0, 142], clamp);
  const over = fill > 100;
  return (
    <Card title="Godown Capacity" tag={{ text: "OVERFLOW", accent: A.amber }} footnote="Illustration">
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, lineHeight: 1, color: over ? A.coral.main : P.ink }}>
        {Math.round(fill)}%
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: P.soft, margin: "8px 0 22px" }}>godown full</div>
      <div style={{ position: "relative", height: 30, borderRadius: 30, background: "rgba(20,20,43,0.08)", overflow: "hidden" }}>
        <div
          style={{
            width: `${Math.min(100, (fill / 142) * 100)}%`,
            height: "100%",
            background: over
              ? `repeating-linear-gradient(135deg, ${A.coral.main} 0 14px, ${A.coral.light} 14px 28px)`
              : `linear-gradient(90deg, ${A.amber.light}, ${A.amber.main})`,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
        {[
          ["Dead stock", "₹ 8.4L", A.coral],
          ["Cash blocked", "₹ 5.1L", A.amber],
        ].map(([label, val, acc]) => (
          <div
            key={label as string}
            style={{
              flex: 1,
              padding: "18px 20px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(20,20,43,0.06)",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 600, color: P.soft }}>{label as string}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: (acc as Accent).main }}>{val as string}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const GuessViz: React.FC = () => {
  const frame = useCurrentFrame();
  const cells: string[][] = [
    ["Item", "Qty", "Rate", "Total"],
    ["Sneakers", "12", "#N/A", "#N/A"],
    ["Backpack", "??", "1,450", "#REF!"],
    ["Watch", "31", "2,200", "6,82,0"],
    ["Cable", "#REF!", "199", "???"],
  ];
  const cursor = Math.floor(frame / 9) % 8;
  return (
    <Card title="stock_final_v7(2).xlsx" tag={{ text: "ERRORS", accent: A.coral }} footnote="Illustration">
      <div style={{ borderRadius: 20, overflow: "hidden", border: "1.5px solid rgba(20,20,43,0.1)", background: "#fff" }}>
        {cells.map((row, r) => (
          <div key={r} style={{ display: "flex", background: r === 0 ? "rgba(20,20,43,0.06)" : "#fff" }}>
            {row.map((c, ci) => {
              const bad = c.startsWith("#") || c === "??" || c === "???" || c === "6,82,0";
              const cur = r > 0 && r * 4 + ci === 5 + cursor;
              return (
                <div
                  key={ci}
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    fontSize: 24,
                    fontWeight: r === 0 ? 800 : 600,
                    color: bad ? A.coral.main : P.ink,
                    background: bad ? `${A.coral.main}12` : "transparent",
                    borderRight: ci < 3 ? "1px solid rgba(20,20,43,0.08)" : undefined,
                    borderTop: r > 0 ? "1px solid rgba(20,20,43,0.08)" : undefined,
                    boxShadow: cur ? `inset 0 0 0 3px ${A.indigo.main}` : undefined,
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ what is IMS */

const SparkArea: React.FC<{
  pts: number[];
  accent: Accent;
  progress: number;
  w: number;
  h: number;
  id: string;
}> = ({ pts, accent, progress, w, h, id }) => {
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map((v) => h - 14 - v * (h - 40));
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  const cut = progress * w;
  const idx = Math.min(pts.length - 1, Math.floor(progress * (pts.length - 1)));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`a-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent.main} stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent.main} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`c-${id}`}>
          <rect x="0" y="-20" width={cut} height={h + 40} />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(20,20,43,0.07)" strokeWidth="2" />
      ))}
      <g clipPath={`url(#c-${id})`}>
        <path d={area} fill={`url(#a-${id})`} />
        <path d={line} fill="none" stroke={accent.main} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx={xs[idx]} cy={ys[idx]} r="10" fill="#fff" stroke={accent.main} strokeWidth="5" />
    </svg>
  );
};

export const DashViz: React.FC = () => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [10, 70], [0, 1], clamp);
  const count = (to: number, d: number) => Math.round(interpolate(frame, [d, d + 40], [0, to], clamp));
  const pts = Array.from({ length: 22 }, (_, i) => 0.45 + 0.28 * Math.sin(i / 2.6) + 0.12 * Math.sin(i * 1.3) + i * 0.008);
  const kpis: [string, string, Accent][] = [
    ["Total SKUs", inr(count(1248, 8)), A.indigo],
    ["Locations", String(count(12, 14)), A.emerald],
    ["Low stock", String(count(7, 20)), A.amber],
  ];
  return (
    <Card
      title="IMS Dashboard"
      tag={{ text: "LIVE", accent: A.emerald }}
      footnote="Sample data"
    >
      <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
        {kpis.map(([label, val, acc]) => (
          <div
            key={label}
            style={{
              flex: 1,
              padding: "16px 18px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(20,20,43,0.06)",
            }}
          >
            <div style={{ fontSize: 19, fontWeight: 600, color: P.soft }}>{label}</div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: acc.main }}>{val}</div>
          </div>
        ))}
      </div>
      <SparkArea pts={pts} accent={A.indigo} progress={prog} w={614} h={190} id="dash" />
    </Card>
  );
};

/* ------------------------------------------------------------------ benefits */

export const LocationsViz: React.FC = () => {
  const frame = useCurrentFrame();
  const rows: [string, string, number, Accent][] = [
    ["Mumbai Warehouse", "M", 1240, A.indigo],
    ["Delhi Store", "D", 860, A.coral],
    ["Pune Hub", "P", 415, A.emerald],
    ["Bengaluru Store", "B", 530, A.violet],
  ];
  return (
    <Card title="Sab Locations" tag={{ text: "LIVE", accent: A.emerald }}>
      {rows.map(([name, letter, base, acc], i) => {
        const reveal = interpolate(frame, [8 + i * 7, 34 + i * 7], [0, 1], clamp);
        const wob = Math.round(Math.sin(frame / 8 + i * 2.2) * 6 * reveal);
        const n = Math.round(base * reveal) + wob;
        return (
          <Row key={name} style={{ opacity: interpolate(reveal, [0, 0.3], [0, 1], clamp) }}>
            <Avatar letter={letter} accent={acc} />
            <Name title={name} sub="units in stock" />
            <Bar pct={(base / 1400) * 100 * reveal} accent={acc} />
            <Qty n={n} />
          </Row>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, fontWeight: 700, fontSize: 22, color: A.emerald.main }}>
        <LiveDot accent={A.emerald} /> Real-time sync · har sale ke saath update
      </div>
    </Card>
  );
};

export const ShelfViz: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [10, 44, 66, 84], [78, 10, 10, 90], clamp);
  const low = frame >= 40 && frame < 74;
  const restocked = frame >= 84;
  const acc = pct < 25 ? A.coral : A.indigo;
  return (
    <Card title="Shelf Monitor" tag={low ? { text: "LOW STOCK", accent: A.amber } : restocked ? { text: "RESTOCKED", accent: A.emerald } : { text: "HEALTHY", accent: A.indigo }}>
      <Row>
        <Avatar letter="B" accent={A.violet} />
        <Name title="Backpack" sub="Navy" />
        <Bar pct={72} accent={A.violet} />
        <Qty n={101} />
      </Row>
      <Row style={{ boxShadow: low ? `0 0 0 3px ${A.amber.main}88, 0 14px 30px -10px ${A.amber.main}88` : undefined }}>
        <Avatar letter="S" accent={acc} />
        <Name title="Sneakers" sub="Size 9 · Black" />
        <Bar pct={pct} accent={acc} />
        <Qty n={Math.round(pct * 1.4)} color={acc.main} />
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Avatar letter="W" accent={A.emerald} />
        <Name title="Watch" sub="Classic" />
        <Bar pct={58} accent={A.emerald} />
        <Qty n={64} />
      </Row>
      <div style={{ height: 58 }}>
        {low && (
          <div style={{ fontWeight: 800, fontSize: 26, color: A.amber.side, background: `${A.amber.main}22`, padding: "12px 22px", borderRadius: 18 }}>
            ⚠ Alert: Sneakers kam ho rahe hain
          </div>
        )}
        {restocked && (
          <div style={{ fontWeight: 800, fontSize: 26, color: A.emerald.side, background: `${A.emerald.main}22`, padding: "12px 22px", borderRadius: 18 }}>
            ✓ Restock ho gaya · Sale safe
          </div>
        )}
      </div>
    </Card>
  );
};

export const CostViz: React.FC = () => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [10, 78], [0, 1], clamp);
  const pts = Array.from({ length: 20 }, (_, i) => 0.86 - 0.6 * Math.pow(i / 19, 0.85) + 0.05 * Math.sin(i * 1.4));
  const cash = Math.round(interpolate(frame, [20, 88], [0, 4.2], clamp) * 10) / 10;
  return (
    <Card title="Holding Cost" tag={{ text: "KAM HO RAHA", accent: A.emerald }}>
      <SparkArea pts={pts} accent={A.emerald} progress={prog} w={614} h={210} id="cost" />
      <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
        <div style={{ flex: 1, padding: "16px 20px", borderRadius: 22, background: "rgba(255,255,255,0.88)", border: "1px solid rgba(20,20,43,0.06)" }}>
          <div style={{ fontSize: 19, fontWeight: 600, color: P.soft }}>Overstock</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: A.emerald.main }}>↓ Kam</div>
        </div>
        <div style={{ flex: 1, padding: "16px 20px", borderRadius: 22, background: "rgba(255,255,255,0.88)", border: "1px solid rgba(20,20,43,0.06)" }}>
          <div style={{ fontSize: 19, fontWeight: 600, color: P.soft }}>Cash free hua</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: A.indigo.main }}>₹ {cash.toFixed(1)}L</div>
        </div>
      </div>
    </Card>
  );
};

const Toast: React.FC<{ delay: number; accent: Accent; icon: string; title: string; sub: string }> = ({
  delay,
  accent,
  icon,
  title,
  sub,
}) => {
  const p = useIn(delay, 12);
  return (
    <Row
      style={{
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        transform: `translateX(${(1 - p) * 120}px)`,
        borderLeft: `6px solid ${accent.main}`,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          fontWeight: 800,
          color: "#fff",
          background: `linear-gradient(135deg, ${accent.light}, ${accent.main})`,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 27 }}>{title}</div>
        <div style={{ fontWeight: 500, fontSize: 21, color: P.soft, marginTop: 2 }}>{sub}</div>
      </div>
    </Row>
  );
};

export const ReorderViz: React.FC = () => (
  <Card title="Auto Reorder" tag={{ text: "AUTOMATIC", accent: A.indigo }}>
    <Toast delay={12} accent={A.amber} icon="!" title="Low stock detected" sub="Sneakers · sirf 12 units bache" />
    <Toast delay={38} accent={A.indigo} icon="PO" title="Purchase order #1042 ban gaya" sub="500 units · auto-approved" />
    <Toast delay={64} accent={A.emerald} icon="✓" title="Supplier ko inform kiya" sub="Delivery 2 din mein" />
  </Card>
);

export const ForecastViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vals = [38, 50, 44, 58, 64, 72, 82, 94];
  return (
    <Card title="Sales Forecast" tag={{ text: "FORECAST", accent: A.violet }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 280, padding: "0 4px" }}>
        {vals.map((v, i) => {
          const p = spring({ frame: frame - 8 - i * 5, fps, config: { damping: 14, stiffness: 120 } });
          const future = i >= 5;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
              <div
                style={{
                  height: `${v * p * 2.7}px`,
                  borderRadius: 14,
                  background: future
                    ? `repeating-linear-gradient(135deg, ${A.violet.light} 0 10px, ${A.violet.light}99 10px 20px)`
                    : `linear-gradient(180deg, ${A.indigo.light}, ${A.indigo.main})`,
                  border: future ? `2.5px dashed ${A.violet.main}` : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontWeight: 700, fontSize: 22 }}>
        <span style={{ color: A.indigo.main, display: "flex", alignItems: "center", gap: 10 }}><i style={{ width: 16, height: 16, borderRadius: 5, background: A.indigo.main }} /> Pichli sales</span>
        <span style={{ color: A.violet.main, display: "flex", alignItems: "center", gap: 10 }}><i style={{ width: 16, height: 16, borderRadius: 5, border: `2.5px dashed ${A.violet.main}` }} /> Agle mahine ka forecast</span>
      </div>
    </Card>
  );
};

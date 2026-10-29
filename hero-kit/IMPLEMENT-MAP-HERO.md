# IMPLEMENT: Scroll-driven 3D Map Hero (single-file brief for Claude)

> **How to use this file (for the human):** put this file in your project folder, open Claude Code there, and say:
> *"Read IMPLEMENT-MAP-HERO.md and implement it on my home page. Ask me for my own places and text first."*

---

## 0. Instructions to Claude (read first)

You are adding ONE section, a pinned full-screen **"3D map hero"**, to the user's existing website. A finished, tested implementation exists and is included in full below. **Your job is to install it exactly as written, then change only the content.**

Rules:
1. **Do not redesign it.** Create the files in section 4 with the code **verbatim** (every character). Do not "improve", restyle, simplify, rename, or reorganise them.
2. **Only these things may change:** the content config (section 5: headline, text, places, stages, colours), the file locations to fit this project's folder layout, and the header colour behaviour (section 6).
3. **Before writing code, ask the user** for: their business name, headline, one-sentence description, button labels and links, and the places to mark on the map (name, city, longitude, latitude, address lines, opening hours). If they have only one place, use one pin and one stage. If they have no places, ask before continuing.
4. Keep the rest of the user's site as it is. Do not remove or rewrite their other sections, fonts, or colours.
5. When finished, run the checks in section 8 and report results honestly. If something fails, say so and fix it. Do not claim success without running the checks.

## 1. What the user gets (so you can describe it back and verify it)

A dark, full-screen hero that stays pinned while the visitor scrolls (about 420vh of scroll for 2 stages):

- **Load:** a 3D extruded country map grows in; a bright arc between the first two pins draws itself; floating labels fade in.
- **Scroll stage 0:** big headline, description, two buttons, a small footnote, and a "Scroll…" hint.
- **Scroll stage 1..N:** the camera flies to each pin in turn; a glass card (eyebrow, title, address lines, hours) fades in on the left while that pin is on the right.
- **Pull-back:** camera pulls back to the whole map, a closing line appears, then the dark hero fades to the light page colour and the normal page continues.
- **Always-on motion:** drifting aurora glow, a thin scan line, sparkles, a perspective floor grid flowing toward the viewer, radar ripples at every pin, light packets travelling along the arc, faint routes to other cities, mouse-tilt of the map, a progress rail of dots on the right.
- **Optional:** inertia ("smooth") scrolling for the whole page.
- **Accessibility:** with `prefers-reduced-motion` the hero becomes one still screen (no pinned scroll, no auto-animation, no smooth scrolling).

## 2. Requirements (check the project first)

| Needed | Why |
|---|---|
| Next.js with the App Router | `MapHero.tsx` uses `next/dynamic` (see section 7 for other frameworks) |
| React 19 | matches `@react-three/fiber` v9 / `drei` v10 |
| **Tailwind CSS v4** | uses colour variables with opacity, e.g. `bg-[var(--mh-accent)]/30`. Tailwind v3 is not supported/untested. |

If the project is on **React 18**, install `@react-three/fiber@8` and `@react-three/drei@9` instead. If it is on **Tailwind v3**, tell the user before proceeding: the CSS-variable opacity classes will not work.

## 3. Install packages

```bash
npm install motion three @react-three/fiber @react-three/drei lenis
npm install -D @types/three
```

(`motion` is imported as `motion/react`.)

## 4. Create these files (verbatim)

Create a folder `components/map-hero/` (or `src/components/map-hero/` if the project uses `src/`). Put each file below inside it, with exactly the name shown.

### 4.1 `components/map-hero/types.ts`

```ts
export type LonLat = [number, number];

/** A place to mark on the map. Longitude and latitude in degrees. */
export type Pin = {
  lon: number;
  lat: number;
  /** Bold line in the floating label. */
  label: string;
  /** Small second line in the floating label. */
  sub?: string;
};

/** One scroll stop: the camera flies to `pin` and a card appears. */
export type Stage = {
  /** Index into `pins`. */
  pin: number;
  eyebrow: string;
  title: string;
  lines?: string[];
  meta?: string;
};

/** A faint route drawn from one of the pins out to another place. */
export type City = { lon: number; lat: number; from: number };

export type Cta = { label: string; href: string };

export type Colors = {
  /** Page background of the dark hero. */
  background: string;
  /** Colour the hero fades to at the end of the scroll. */
  light: string;
  /** Map body. */
  surface: string;
  /** Map outline. */
  edge: string;
  /** Arc, packets, pins, ripples, accents. */
  glow: string;
  /** Main call-to-action button. */
  accent: string;
  /** Floor grid. */
  gridCell: string;
  gridSection: string;
};

export const defaultColors: Colors = {
  background: "#060B16",
  light: "#FAFAFA",
  surface: "#0d2142",
  edge: "#4aa3ff",
  glow: "#6fd0ff",
  accent: "#0B5FCC",
  gridCell: "#16427f",
  gridSection: "#2a79d8",
};

export type MapHeroProps = {
  /** id of the section element. Default "top" (the nav uses it to switch theme). */
  id?: string;
  headline: string;
  description?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Small line under the buttons. */
  footnote?: string;
  pins: Pin[];
  stages: Stage[];
  /** Pin indexes joined by the bright arc. Default [0, 1]. */
  arc?: [number, number];
  /** Extra faint routes. */
  cities?: City[];
  /** Country outline as [lon, lat] points. Default: India (see india-outline.ts). */
  outline?: LonLat[];
  /** Big line shown just before the hero fades out. */
  finale?: string;
  scrollHint?: string;
  colors?: Partial<Colors>;
  /** Total scroll length of the pinned hero, in viewport heights. Default: 160 + 130 per stage. */
  heightVh?: number;
};
```

### 4.2 `components/map-hero/timeline.ts`

```ts
/**
 * Where everything happens along the hero's scroll (0 = top, 1 = end).
 * Built from the number of stages, so adding a stage automatically re-times the whole story.
 * Every value stays inside 0–1 and never decreases, which the browser's scroll animations require.
 */
export type StageTimes = {
  moveStart: number;
  moveEnd: number;
  holdEnd: number;
  /** [fade in start, fully in, start fading out, gone] */
  caption: [number, number, number, number];
};

export type Timeline = {
  intro: number;
  stages: StageTimes[];
  pullStart: number;
  pullEnd: number;
  finale: [number, number, number];
  light: [number, number];
  canvasFade: [number, number];
  /** Boundaries of the progress-rail dots. */
  rail: number[];
};

export function makeTimeline(n: number): Timeline {
  const intro = 0.1;
  const span = 0.72 / Math.max(1, n);
  const stages: StageTimes[] = Array.from({ length: n }, (_, i) => {
    const moveStart = intro + i * span;
    const moveEnd = moveStart + span * 0.5;
    const holdEnd = moveStart + span;
    return { moveStart, moveEnd, holdEnd, caption: [moveStart + span * 0.35, moveStart + span * 0.6, holdEnd - 0.02, holdEnd + 0.04] };
  });
  const pullStart = intro + 0.72;
  return {
    intro,
    stages,
    pullStart,
    pullEnd: 0.9,
    finale: [0.86, 0.9, 0.95],
    light: [0.94, 1],
    canvasFade: [0.9, 0.97],
    rail: [0, ...stages.map((s) => s.moveStart + (s.moveEnd - s.moveStart) * 0.5), 0.84, 1],
  };
}
```

### 4.3 `components/map-hero/india-outline.ts`

```ts
import type { LonLat } from "./types";

/**
 * Hand-simplified outline of India as [longitude, latitude] points (clockwise from the north-west).
 * Borders are approximate and the shape is for decoration only. Swap in an exact outline, or the
 * outline of another country, by passing the `outline` prop. Check any disputed borders against the
 * official maps for the region you publish in.
 */
export const INDIA_OUTLINE: LonLat[] = [
  [74.3, 34.8], [76.8, 35.7], [79.4, 34.5], [78.9, 32.8], [80.3, 30.9], [81.0, 30.1], [83.5, 29.2], [84.7, 28.5], [86.0, 27.9], [88.1, 27.9], [88.8, 27.2], [89.9, 26.7], [92.0, 26.9], [93.5, 27.1], [95.0, 29.1], [96.5, 28.5], [97.3, 28.1], [96.1, 27.3], [95.3, 26.5], [94.6, 25.4], [94.3, 24.0], [93.4, 23.0], [92.7, 21.9],
  [92.2, 23.0], [91.5, 23.2], [91.3, 24.0], [92.3, 24.3], [92.3, 24.9], [91.6, 25.2], [90.3, 25.1], [89.8, 26.0], [89.2, 26.3], [88.4, 25.4], [88.3, 24.6], [88.9, 24.0], [88.8, 22.9], [89.0, 21.9],
  [87.5, 21.6], [86.9, 20.6], [85.5, 19.8], [84.0, 18.4], [82.3, 16.6], [80.3, 15.5], [80.2, 13.3], [79.8, 11.6], [79.9, 10.3], [78.2, 8.9], [77.5, 8.1],
  [76.3, 9.2], [75.0, 12.0], [74.0, 15.0], [73.0, 17.5], [72.8, 19.0], [72.7, 21.0], [72.6, 21.4], [71.0, 20.8], [69.0, 22.3], [68.2, 23.6], [69.5, 24.2], [70.5, 25.6], [70.0, 27.0], [71.2, 27.9], [72.7, 29.0], [74.0, 29.8], [74.6, 31.2], [74.6, 32.3], [75.4, 32.9],
];
```

### 4.4 `components/map-hero/MapScene.tsx`

```tsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Grid, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeTimeline, type Timeline } from "./timeline";
import type { City, Colors, LonLat, Pin, Stage } from "./types";

const clamp = THREE.MathUtils.clamp;
const smooth = (t: number) => t * t * (3 - 2 * t);
const DEPTH = 0.2;

/** Everything needed to place geography in 3D, derived from the outline's bounding box. */
function makeGeo(outline: LonLat[]) {
  const lons = outline.map((p) => p[0]);
  const lats = outline.map((p) => p[1]);
  const cx = (Math.min(...lons) + Math.max(...lons)) / 2;
  const cy = (Math.min(...lats) + Math.max(...lats)) / 2;
  const k = 5.8 / Math.max(Math.max(...lons) - Math.min(...lons), Math.max(...lats) - Math.min(...lats));
  const at = (lon: number, lat: number, z = DEPTH + 0.01) => new THREE.Vector3((lon - cx) * k, (lat - cy) * k, z);
  return { at, k, cx, cy };
}

type KF = { t: number; s: number; f: THREE.Vector2; rx: number; rz: number; o: THREE.Vector2 };
const v2 = (x: number, y: number) => new THREE.Vector2(x, y);

function buildFrames(wide: boolean, tl: Timeline, stages: Stage[], pinPos: THREE.Vector3[]): KF[] {
  const center = v2(0, 0);
  const o0 = v2(0, wide ? -1.45 : -1.9);
  const oPin = v2(wide ? 2.4 : 0, wide ? 0.15 : 1.0);
  const sPin = wide ? 2.1 : 1.7;
  const out: KF[] = [{ t: 0, s: 0.8, f: center, rx: -0.9, rz: -0.1, o: o0 }, { t: tl.intro, s: 0.8, f: center, rx: -0.9, rz: -0.1, o: o0 }];
  stages.forEach((st, i) => {
    const f = v2(pinPos[st.pin].x, pinPos[st.pin].y);
    const rz = i % 2 ? 0.04 : -0.05;
    out.push({ t: tl.stages[i].moveEnd, s: sPin, f, rx: -0.8, rz, o: oPin });
    out.push({ t: tl.stages[i].holdEnd, s: sPin, f, rx: -0.8, rz, o: oPin });
  });
  const back = { s: wide ? 0.72 : 0.6, f: center, rx: -1.0, rz: -0.1, o: v2(0, wide ? -0.4 : -0.3) };
  out.push({ t: tl.pullEnd, ...back }, { t: 1, ...back });
  return out;
}

function sample(kf: KF[], p: number) {
  let i = 0;
  while (i < kf.length - 2 && p > kf[i + 1].t) i++;
  const a = kf[i], b = kf[i + 1];
  const u = smooth(clamp((p - a.t) / Math.max(1e-6, b.t - a.t), 0, 1));
  return {
    s: THREE.MathUtils.lerp(a.s, b.s, u),
    f: a.f.clone().lerp(b.f, u),
    rx: THREE.MathUtils.lerp(a.rx, b.rx, u),
    rz: THREE.MathUtils.lerp(a.rz, b.rz, u),
    o: a.o.clone().lerp(b.o, u),
  };
}

function arcCurve(a: THREE.Vector3, b: THREE.Vector3, lift: number) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.z = DEPTH + lift;
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

/** A tube that draws itself from start to end as `drawn` goes 0 → 1. */
function Arc({ curve, radius, color, opacity, drawn }: { curve: THREE.QuadraticBezierCurve3; radius: number; color: string; opacity: number; drawn: React.RefObject<number> }) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 90, radius, 6, false), [curve, radius]);
  const total = geo.index!.count;
  useFrame(() => geo.setDrawRange(0, Math.floor(clamp(drawn.current ?? 0, 0, 1) * (total / 6)) * 6));
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

/** Small lights that travel along a route. */
function Packets({ curve, count, speed, offset }: { curve: THREE.QuadraticBezierCurve3; count: number; speed: number; offset: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const u = (((t * speed + offset + i / count) % 1) + 1) % 1;
      m.position.copy(curve.getPoint(u));
      m.scale.setScalar(0.8 + Math.sin(u * Math.PI) * 0.4);
    });
  });
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#d9f5ff" />
        </mesh>
      ))}
    </>
  );
}

/** Radar ripples spreading from a pin. */
function Ripples({ at, phase, color }: { at: THREE.Vector3; phase: number; color: string }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const u = (((s.clock.elapsedTime * 0.45 + phase + i / 3) % 1) + 1) % 1;
      m.scale.setScalar(0.15 + u * 1.5);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.55;
    });
  });
  return (
    <group position={at.toArray()}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <ringGeometry args={[0.97, 1, 64]} />
          <meshBasicMaterial color={color} transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function PinMesh({ at, glow }: { at: THREE.Vector3; glow: string }) {
  const head = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (head.current) head.current.position.z = 0.26 + Math.sin(s.clock.elapsedTime * 2.2) * 0.04; });
  return (
    <group position={at.toArray()}>
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.24, 12]} /><meshBasicMaterial color={glow} /></mesh>
      <mesh ref={head} position={[0, 0, 0.26]}><sphereGeometry args={[0.1, 24, 24]} /><meshBasicMaterial color="#c8f1ff" /></mesh>
      <mesh position={[0, 0, 0.26]}><sphereGeometry args={[0.24, 24, 24]} /><meshBasicMaterial color={glow} transparent opacity={0.22} /></mesh>
    </group>
  );
}

type SceneProps = {
  reduce: boolean;
  heroRef: React.RefObject<HTMLElement | null>;
  labelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  pins: Pin[];
  stages: Stage[];
  arc: [number, number];
  cities: City[];
  outline: LonLat[];
  colors: Colors;
};

function MapWorld({ reduce, heroRef, labelRefs, pins, stages, arc, cities, outline, colors }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const grid = useRef<THREE.Group>(null);
  const cityDots = useRef<(THREE.Mesh | null)[]>([]);
  const pSmooth = useRef(0);
  const drawn = useRef(0);
  const drawnSoft = useRef(0);
  const wide = useThree((s) => s.viewport.width) > 7.5;
  const { camera, size } = useThree();

  const tl = useMemo(() => makeTimeline(stages.length), [stages.length]);
  const geo3 = useMemo(() => makeGeo(outline), [outline]);
  const pinPos = useMemo(() => pins.map((p) => geo3.at(p.lon, p.lat)), [pins, geo3]);
  const cityPos = useMemo(() => cities.map((c) => geo3.at(c.lon, c.lat)), [cities, geo3]);
  const kf = useMemo(() => buildFrames(wide, tl, stages, pinPos), [wide, tl, stages, pinPos]);
  const body = useMemo(
    () => new THREE.ExtrudeGeometry(new THREE.Shape(outline.map(([lo, la]) => new THREE.Vector2((lo - geo3.cx) * geo3.k, (la - geo3.cy) * geo3.k))), { depth: DEPTH, bevelEnabled: false }),
    [outline, geo3],
  );
  // the bright arc needs two different pins; with a single place it is simply left out
  const main = useMemo(() => (pinPos[arc[0]] && pinPos[arc[1]] && arc[0] !== arc[1] ? arcCurve(pinPos[arc[0]], pinPos[arc[1]], 1.7) : null), [pinPos, arc]);
  const routes = useMemo(
    () => cities.map((c, i) => arcCurve(pinPos[c.from], cityPos[i], 0.4 + pinPos[c.from].distanceTo(cityPos[i]) * 0.22)),
    [cities, pinPos, cityPos],
  );
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const proj = useMemo(() => new THREE.Vector3(), []);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    // 1. read how far through the pinned hero the page is scrolled
    let p = 0;
    const hero = heroRef.current;
    if (hero && !reduce) {
      const r = hero.getBoundingClientRect();
      p = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
    }
    // 2. glide toward it instead of snapping
    pSmooth.current += (p - pSmooth.current) * (1 - Math.exp(-dt * 5));
    const k = sample(kf, pSmooth.current);
    const intro = reduce ? 1 : smooth(clamp(t / 2.2, 0, 1));

    // 3. move the whole map so the focus point sits where the layout wants it
    const g = group.current;
    if (g) {
      g.rotation.set(k.rx - (reduce ? 0 : st.pointer.y * 0.06), 0, k.rz + (reduce ? 0 : st.pointer.x * 0.1));
      const s = k.s * (0.6 + 0.4 * intro);
      g.scale.setScalar(s);
      tmp.set(k.f.x, k.f.y, 0).multiplyScalar(s).applyEuler(g.rotation).negate();
      g.position.set(tmp.x + k.o.x, tmp.y + k.o.y, tmp.z);

      // 4. pin the HTML labels to the pins' screen positions
      g.updateMatrixWorld();
      pinPos.forEach((pin, i) => {
        const el = labelRefs.current?.[i];
        if (!el) return;
        proj.set(pin.x + 0.2, pin.y + 0.12, pin.z + 0.3).applyMatrix4(g.matrixWorld).project(camera);
        const x = (proj.x * 0.5 + 0.5) * size.width;
        const y = (-proj.y * 0.5 + 0.5) * size.height;
        const onScreen = proj.z < 1 && x > -40 && x < size.width + 40 && y > -40 && y < size.height + 40;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = onScreen ? String(intro) : "0";
      });
    }

    drawn.current = reduce ? 1 : smooth(clamp((t - 0.9) / 2.4, 0, 1));
    drawnSoft.current = reduce ? 1 : smooth(clamp((t - 1.6) / 3, 0, 1));
    if (mat.current) mat.current.emissiveIntensity = 0.5 + (reduce ? 0 : Math.sin(t * 1.4) * 0.12);
    if (grid.current && !reduce) grid.current.position.z = (t * 0.7) % 3; // floor flows toward you
    cityDots.current.forEach((m, i) => { if (m) m.scale.setScalar(0.8 + (reduce ? 0 : Math.sin(t * 2 + i) * 0.25)); });
  });

  return (
    <>
      <group ref={grid} position={[0, -2.7, 0]}>
        <Grid args={[40, 40]} cellSize={0.6} cellThickness={0.7} cellColor={colors.gridCell} sectionSize={3} sectionThickness={1.2} sectionColor={colors.gridSection} fadeDistance={26} fadeStrength={1.6} infiniteGrid />
      </group>
      <group ref={group}>
        <mesh geometry={body}>
          <meshStandardMaterial ref={mat} color={colors.surface} metalness={0.3} roughness={0.55} emissive={colors.surface} emissiveIntensity={0.5} />
          <Edges color={colors.edge} threshold={30} />
        </mesh>
        {routes.map((c, i) => <Arc key={i} curve={c} radius={0.006} color={colors.edge} opacity={0.4} drawn={drawnSoft} />)}
        {main && (
          <>
            <Arc curve={main} radius={0.01} color="#8ee0ff" opacity={1} drawn={drawn} />
            <Packets curve={main} count={4} speed={0.16} offset={0} />
          </>
        )}
        {routes.map((c, i) => <Packets key={i} curve={c} count={1} speed={0.1 + (i % 3) * 0.03} offset={i * 0.17} />)}
        {cityPos.map((c, i) => (
          <mesh key={i} position={c.toArray()} ref={(m) => { cityDots.current[i] = m; }}><sphereGeometry args={[0.032, 16, 16]} /><meshBasicMaterial color="#8ee0ff" /></mesh>
        ))}
        {pinPos.map((p, i) => (
          <group key={i}>
            <Ripples at={p} phase={i * 0.5} color={colors.glow} />
            <PinMesh at={p} glow={colors.glow} />
          </group>
        ))}
      </group>
    </>
  );
}

export default function MapScene(props: SceneProps) {
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 9.5], fov: 36 }} dpr={[1, 1.75]} aria-hidden>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={1.2} />
      <pointLight position={[0, 1, 5]} intensity={20} color={props.colors.edge} />
      {!props.reduce && <Sparkles count={120} scale={[16, 8, 8]} size={2.6} speed={0.3} color="#7fc4ff" opacity={0.75} />}
      <MapWorld {...props} />
    </Canvas>
  );
}
```

### 4.5 `components/map-hero/MapHero.tsx`

```tsx
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
```

### 4.6 `components/map-hero/SmoothScroll.tsx`

```tsx
"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertia scrolling for the whole page (wheel and trackpad). Mount once, anywhere.
 * Skipped for visitors who prefer reduced motion; touch devices keep native scrolling.
 */
export function SmoothScroll({ lerp = 0.085, anchorOffset = -64 }: { lerp?: number; anchorOffset?: number }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp, wheelMultiplier: 0.9, anchors: { offset: anchorOffset } });
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [lerp, anchorOffset]);
  return null;
}
```

### 4.7 `components/map-hero/index.ts`

```ts
export { MapHero } from "./MapHero";
export { SmoothScroll } from "./SmoothScroll";
export { INDIA_OUTLINE } from "./india-outline";
export { defaultColors } from "./types";
export type { MapHeroProps, Pin, Stage, City, Cta, Colors, LonLat } from "./types";
```

### 4.8 `components/map-hero/map-hero.css`

```css
/* ---- Map hero: background animation + fonts + smooth scroll ---- */

/* Fonts. Point these at your own font variables, or leave to inherit the page font. */
:root {
  --mh-heading: inherit;
  --mh-body: inherit;
}

@keyframes mh-aurora-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(8vw,-6vh) scale(1.15); } }
@keyframes mh-aurora-b { 0%,100% { transform: translate(0,0) scale(1.1); } 50% { transform: translate(-9vw,7vh) scale(0.95); } }
@keyframes mh-scan { 0% { top: -2%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 102%; opacity: 0; } }
.mh-aurora-a { animation: mh-aurora-a 20s ease-in-out infinite; }
.mh-aurora-b { animation: mh-aurora-b 26s ease-in-out infinite; }
.mh-scan { animation: mh-scan 9s linear infinite; }
@media (prefers-reduced-motion: reduce) { .mh-aurora-a, .mh-aurora-b, .mh-scan { animation: none; } }

/* Lenis smooth scroll: its own easing replaces the browser's. */
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }
```

## 5. Global CSS (two additions)

In the project's global stylesheet (usually `app/globals.css`), directly after `@import "tailwindcss";` add:

```css
@import "../components/map-hero/map-hero.css";
```

(Adjust the relative path so it points at `components/map-hero/map-hero.css`.)

**Fonts (optional):** the hero inherits the page font by default. To use the site's own font variables (for example from `next/font`, which puts the variable on `<body>`), add this **on `body`, not `:root`** (a `:root` rule cannot see variables defined on `body`):

```css
body {
  --mh-heading: var(--your-heading-font-variable);
  --mh-body: var(--your-body-font-variable);
}
```

## 6. Render it on the home page

Create `components/MapHeroSection.tsx` (a server or client component, either works) with the user's content. **Replace every value below with what the user tells you. The values shown are the original DTA example and are only there to show the shape.**

```tsx
import { MapHero } from "@/components/map-hero";

const pins = [
  { lon: 92.8, lat: 26.6, label: "Tezpur office", sub: "Assam" },
  { lon: 77.6, lat: 13.0, label: "Bangalore office", sub: "Karnataka" },
];

const stages = [
  { pin: 0, eyebrow: "Tezpur, Assam", title: "Our first office", lines: ["1st Floor, Charu Complex, SC Road,", "Near Head Post Office,", "Tezpur, Assam — 784001"], meta: "Mon–Sat, 9 AM to 6 PM" },
  { pin: 1, eyebrow: "Bangalore, Karnataka", title: "Our second office", lines: ["SRI, 21/1 (511/A), 1st Cross,", "Gokula 1st Stage, 1st Phase,", "Bangalore, Karnataka — 560054"], meta: "Mon–Sat, 9 AM to 6 PM" },
];

// Faint decorative routes from a pin (`from` = index into pins) to other cities. Optional.
const cities = [
  { lon: 77.2, lat: 28.6, from: 0 },
  { lon: 72.9, lat: 19.1, from: 0 },
  { lon: 88.4, lat: 22.6, from: 0 },
  { lon: 80.3, lat: 13.1, from: 1 },
  { lon: 78.5, lat: 17.4, from: 1 },
  { lon: 75.8, lat: 26.9, from: 1 },
];

export function MapHeroSection() {
  return (
    <MapHero
      headline="Websites, GST filing and business licences, handled by one team."
      description="DTA builds your website or CRM, files your GST and income tax returns, and gets your trade licence and FSSAI registration. We work from our offices in Tezpur and Bangalore."
      primaryCta={{ label: "Book a free consultation", href: "#contact" }}
      secondaryCta={{ label: "Chat on WhatsApp", href: "https://wa.me/917002060043" }}
      footnote="500+ businesses served. We reply within 24 hours, Monday to Saturday."
      pins={pins}
      stages={stages}
      cities={cities}
      finale="Two offices. One team. 500+ businesses."
      scrollHint="Scroll to see our offices"
      colors={{ accent: "#0B5FCC" }}
    />
  );
}
```

Then in the home page (`app/page.tsx`), render it **first inside `<main>`**, and mount `SmoothScroll` once:

```tsx
import { SmoothScroll } from "@/components/map-hero";
import { MapHeroSection } from "@/components/MapHeroSection";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      {/* existing header */}
      <main>
        <MapHeroSection />
        {/* ...the rest of the existing page... */}
      </main>
    </>
  );
}
```

**Config reference** (all props of `<MapHero>`):

| Prop | Meaning |
|---|---|
| `headline` | required main heading |
| `description`, `footnote` | optional text (hidden on phones so the map stays clear) |
| `primaryCta`, `secondaryCta` | `{ label, href }` buttons |
| `pins` | `{ lon, lat, label, sub? }[]` places to mark |
| `stages` | `{ pin, eyebrow, title, lines?, meta? }[]` one scroll stop each; `pin` is an index into `pins`. Add/remove freely; timing and page length adapt automatically |
| `arc` | `[i, j]` pin indexes joined by the bright arc (default `[0, 1]`). Skipped automatically if there are fewer than two pins |
| `cities` | `{ lon, lat, from }[]` faint extra routes |
| `outline` | `[lon, lat][]` country outline (default India). Pass another country's outline for other regions |
| `finale` | closing line before the page turns light |
| `scrollHint` | text of the bottom-left hint |
| `colors` | any of `background, light, surface, edge, glow, accent, gridCell, gridSection`. `light` should match the site's page background colour so the fade-out is seamless |
| `heightVh` | total pinned scroll length (default `160 + 130 × stages`) |
| `id` | section id, default `"top"` (the header switch below uses it) |

**Single-place sites:** use one entry in `pins`, one in `stages`, and optionally `cities` fanning out from pin 0. With fewer than two pins the bright arc is simply left out (tested: no errors).

## 7. Header theme (important)

The hero is dark and fades to light in its last 6% of scroll. A header that is transparent with dark text becomes unreadable over it. Make the header switch theme. Use this pattern (adapt the class names to the project):

```tsx
"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export function Header() {
  const [dark, setDark] = useState(true); // starts over the dark hero
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    const hero = document.getElementById("top");
    if (!hero) return setDark(false);
    const r = hero.getBoundingClientRect();
    setDark(-r.top / Math.max(1, r.height - window.innerHeight) < 0.94);
  });
  return <header className={dark ? "text-white" : "text-black"}>{/* existing header content */}</header>;
}
```

Also keep the header `position: fixed` (or sticky) with a high `z-index` (for example 50) so it stays above the hero. The hero's own content is `z-10` and its fade layer `z-20`.

**Not on Next.js (Vite, Remix, plain React):** the only Next-specific line is `import dynamic from "next/dynamic"` in `MapHero.tsx`. Replace it with `import { lazy, Suspense } from "react"`, define `const MapScene = lazy(() => import("./MapScene"));`, wrap the `<MapScene … />` element in `<Suspense fallback={null}>`, and delete the `"use client"` lines.

## 8. Verify (run these, report results)

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds.
4. Start the app and open the home page in a real browser (desktop width 1440 and phone width 390). Confirm:
   - The dark hero shows the headline, buttons and a 3D map with glowing pins and a drawn arc.
   - Scrolling slowly: the camera flies to each place and a card appears for each; then it pulls back, shows the closing line, and fades to the light page.
   - Pin labels follow the pins on screen.
   - The header text is readable over the dark hero AND after the hero.
   - No horizontal scrollbar; no console errors.
   - With the OS "reduce motion" setting on: one still screen, no pinned scroll.

## 9. Gotchas (already solved in the code above; do not undo them)

- Motion scroll offsets must stay within 0–1 and never decrease. `RailDot` clamps its values. Do not remove the clamping.
- The floating pin labels are plain HTML positioned from the 3D pin positions each frame (`labelRefs` in `MapScene.tsx`). Do not replace them with drei's `<Html>`: with two labels only one mounted.
- Reduced-motion differences are done with Tailwind `motion-reduce:` classes, not by branching on a JS value, to avoid React hydration mismatches. Keep it that way.
- Font variables for the hero must be defined on `body` (see section 5), because `next/font` variables live on `body`.
- The 3D scene is client-only (`ssr: false`); it intentionally does not render on the server.
- The default India outline is hand-simplified and approximate. Tell the user to swap in an exact outline if borders matter and to check disputed borders against official maps for the region they publish in.

## 10. Final report to the user

Tell the user: which files you created or changed, the results of the section 8 checks, anything you could not verify, and that they should replace the sample India outline if they need exact borders.

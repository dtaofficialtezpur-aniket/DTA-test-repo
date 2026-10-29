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
  const main = useMemo(() => arcCurve(pinPos[arc[0]], pinPos[arc[1]], 1.7), [pinPos, arc]);
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
        <Arc curve={main} radius={0.01} color="#8ee0ff" opacity={1} drawn={drawn} />
        <Packets curve={main} count={4} speed={0.16} offset={0} />
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

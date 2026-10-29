"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Grid, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const smooth = (t: number) => t * t * (3 - 2 * t);

const OUTLINE: [number, number][] = [
  [74.3, 34.8], [76.8, 35.7], [79.4, 34.5], [78.9, 32.8], [80.3, 30.9], [81.0, 30.1], [83.5, 29.2], [84.7, 28.5], [86.0, 27.9], [88.1, 27.9], [88.8, 27.2], [89.9, 26.7], [92.0, 26.9], [93.5, 27.1], [95.0, 29.1], [96.5, 28.5], [97.3, 28.1], [96.1, 27.3], [95.3, 26.5], [94.6, 25.4], [94.3, 24.0], [93.4, 23.0], [92.7, 21.9],
  [92.2, 23.0], [91.5, 23.2], [91.3, 24.0], [92.3, 24.3], [92.3, 24.9], [91.6, 25.2], [90.3, 25.1], [89.8, 26.0], [89.2, 26.3], [88.4, 25.4], [88.3, 24.6], [88.9, 24.0], [88.8, 22.9], [89.0, 21.9],
  [87.5, 21.6], [86.9, 20.6], [85.5, 19.8], [84.0, 18.4], [82.3, 16.6], [80.3, 15.5], [80.2, 13.3], [79.8, 11.6], [79.9, 10.3], [78.2, 8.9], [77.5, 8.1],
  [76.3, 9.2], [75.0, 12.0], [74.0, 15.0], [73.0, 17.5], [72.8, 19.0], [72.7, 21.0], [72.6, 21.4], [71.0, 20.8], [69.0, 22.3], [68.2, 23.6], [69.5, 24.2], [70.5, 25.6], [70.0, 27.0], [71.2, 27.9], [72.7, 29.0], [74.0, 29.8], [74.6, 31.2], [74.6, 32.3], [75.4, 32.9],
];
const K = 0.2;
const DEPTH = 0.2;
const mp = (lon: number, lat: number, z = DEPTH + 0.01) => new THREE.Vector3((lon - 83) * K, (lat - 22.5) * K, z);

const TEZ = mp(92.8, 26.6);
const BLR = mp(77.6, 13.0);
const CITIES = [mp(77.2, 28.6), mp(72.9, 19.1), mp(88.4, 22.6), mp(80.3, 13.1), mp(78.5, 17.4), mp(75.8, 26.9)];

type KF = { t: number; s: number; f: THREE.Vector2; rx: number; rz: number; o: THREE.Vector2 };
const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const CENTER = v2(-0.1, 0);

function frames(wide: boolean): KF[] {
  const o0 = v2(0, wide ? -1.45 : -1.9);
  const oPin = v2(wide ? 2.4 : 0, wide ? 0.15 : 1.0);
  return [
    { t: 0, s: 0.8, f: CENTER, rx: -0.9, rz: -0.1, o: o0 },
    { t: 0.12, s: 0.8, f: CENTER, rx: -0.9, rz: -0.1, o: o0 },
    { t: 0.3, s: wide ? 2.1 : 1.7, f: v2(TEZ.x, TEZ.y), rx: -0.8, rz: -0.05, o: oPin },
    { t: 0.43, s: wide ? 2.1 : 1.7, f: v2(TEZ.x, TEZ.y), rx: -0.8, rz: -0.05, o: oPin },
    { t: 0.62, s: wide ? 2.1 : 1.7, f: v2(BLR.x, BLR.y), rx: -0.8, rz: 0.04, o: oPin },
    { t: 0.73, s: wide ? 2.1 : 1.7, f: v2(BLR.x, BLR.y), rx: -0.8, rz: 0.04, o: oPin },
    { t: 0.9, s: wide ? 0.72 : 0.6, f: CENTER, rx: -1.0, rz: -0.1, o: v2(0, wide ? -0.4 : -0.3) },
    { t: 1, s: wide ? 0.72 : 0.6, f: CENTER, rx: -1.0, rz: -0.1, o: v2(0, wide ? -0.4 : -0.3) },
  ];
}

function sample(kf: KF[], p: number) {
  let i = 0;
  while (i < kf.length - 2 && p > kf[i + 1].t) i++;
  const a = kf[i], b = kf[i + 1];
  const u = smooth(clamp((p - a.t) / (b.t - a.t), 0, 1));
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

function Arc({ curve, radius, color, opacity, drawn }: { curve: THREE.QuadraticBezierCurve3; radius: number; color: string; opacity: number; drawn: React.RefObject<number> }) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 90, radius, 6, false), [curve, radius]);
  const total = geo.index!.count;
  useFrame(() => {
    geo.setDrawRange(0, Math.floor(clamp(drawn.current ?? 0, 0, 1) * (total / 6)) * 6);
  });
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function Packets({ curve, count, speed, offset }: { curve: THREE.QuadraticBezierCurve3; count: number; speed: number; offset: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const u = ((t * speed + offset + i / count) % 1 + 1) % 1;
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

/** Radar ripples spreading from an office pin. */
function Ripples({ at, phase = 0 }: { at: THREE.Vector3; phase?: number }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const u = ((s.clock.elapsedTime * 0.45 + phase + i / 3) % 1 + 1) % 1;
      m.scale.setScalar(0.15 + u * 1.5);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - u) * 0.55;
    });
  });
  return (
    <group position={at.toArray()}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <ringGeometry args={[0.97, 1, 64]} />
          <meshBasicMaterial color="#6fd0ff" transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Pin({ at }: { at: THREE.Vector3 }) {
  const head = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (head.current) head.current.position.z = 0.26 + Math.sin(s.clock.elapsedTime * 2.2) * 0.04; });
  return (
    <group position={at.toArray()}>
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.24, 12]} /><meshBasicMaterial color="#6fd0ff" /></mesh>
      <mesh ref={head} position={[0, 0, 0.26]}><sphereGeometry args={[0.1, 24, 24]} /><meshBasicMaterial color="#c8f1ff" /></mesh>
      <mesh position={[0, 0, 0.26]}><sphereGeometry args={[0.24, 24, 24]} /><meshBasicMaterial color="#3aa8ff" transparent opacity={0.22} /></mesh>
    </group>
  );
}

type Labels = React.RefObject<HTMLDivElement | null>[];

function Map3D({ reduce, labels }: { reduce: boolean; labels: Labels }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const grid = useRef<THREE.Group>(null);
  const drawn = useRef(0);
  const drawnSoft = useRef(0);
  const wide = useThree((s) => s.viewport.width) > 7.5;
  const kf = useMemo(() => frames(wide), [wide]);
  const geo = useMemo(() => new THREE.ExtrudeGeometry(new THREE.Shape(OUTLINE.map(([lo, la]) => new THREE.Vector2((lo - 83) * K, (la - 22.5) * K))), { depth: DEPTH, bevelEnabled: false }), []);
  const main = useMemo(() => arcCurve(TEZ, BLR, 1.7), []);
  const routes = useMemo(() => [
    ...CITIES.slice(0, 3).map((c) => arcCurve(TEZ, c, 0.5 + TEZ.distanceTo(c) * 0.22)),
    ...CITIES.slice(3).map((c) => arcCurve(BLR, c, 0.4 + BLR.distanceTo(c) * 0.22)),
  ], []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const proj = useMemo(() => new THREE.Vector3(), []);
  const { camera, size } = useThree();
  const cityDots = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const hero = document.getElementById("top");
    let p = 0;
    if (hero && !reduce) {
      const r = hero.getBoundingClientRect();
      p = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
    }
    const k = sample(kf, p);
    const intro = reduce ? 1 : smooth(clamp(t / 2.2, 0, 1));
    const g = group.current;
    if (g) {
      g.rotation.set(k.rx - (reduce ? 0 : st.pointer.y * 0.06), 0, k.rz + (reduce ? 0 : st.pointer.x * 0.1));
      const s = k.s * (0.6 + 0.4 * intro);
      g.scale.setScalar(s);
      tmp.set(k.f.x, k.f.y, 0).multiplyScalar(s).applyEuler(g.rotation).negate();
      g.position.set(tmp.x + k.o.x, tmp.y + k.o.y, tmp.z);
    }
    if (g) {
      g.updateMatrixWorld();
      [TEZ, BLR].forEach((pin, i) => {
        const el = labels[i]?.current;
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
    if (grid.current && !reduce) grid.current.position.z = (t * 0.7) % 3;
    cityDots.current.forEach((m, i) => { if (m) m.scale.setScalar(0.8 + (reduce ? 0 : Math.sin(t * 2 + i) * 0.25)); });
    void dt;
  });

  return (
    <>
      <group ref={grid} position={[0, -2.7, 0]}>
        <Grid args={[40, 40]} cellSize={0.6} cellThickness={0.7} cellColor="#16427f" sectionSize={3} sectionThickness={1.2} sectionColor="#2a79d8" fadeDistance={26} fadeStrength={1.6} infiniteGrid />
      </group>
      <group ref={group}>
        <mesh geometry={geo}>
          <meshStandardMaterial ref={mat} color="#0d2142" metalness={0.3} roughness={0.55} emissive="#0a2c63" emissiveIntensity={0.5} />
          <Edges color="#4aa3ff" threshold={30} />
        </mesh>
        {routes.map((c, i) => <Arc key={i} curve={c} radius={0.006} color="#5fb6ff" opacity={0.4} drawn={drawnSoft} />)}
        <Arc curve={main} radius={0.01} color="#8ee0ff" opacity={1} drawn={drawn} />
        <Packets curve={main} count={4} speed={0.16} offset={0} />
        {routes.map((c, i) => <Packets key={i} curve={c} count={1} speed={0.1 + (i % 3) * 0.03} offset={i * 0.17} />)}
        {CITIES.map((c, i) => (
          <mesh key={i} position={c.toArray()} ref={(m) => { cityDots.current[i] = m; }}><sphereGeometry args={[0.032, 16, 16]} /><meshBasicMaterial color="#8ee0ff" /></mesh>
        ))}
        <Ripples at={TEZ} />
        <Ripples at={BLR} phase={0.5} />
        <Pin at={TEZ} />
        <Pin at={BLR} />
      </group>
    </>
  );
}

export default function MapScene({ reduce, labels }: { reduce: boolean; labels: Labels }) {
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 9.5], fov: 36 }} dpr={[1, 1.75]} aria-hidden>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={1.2} />
      <pointLight position={[0, 1, 5]} intensity={20} color="#4aa3ff" />
      {!reduce && <Sparkles count={120} scale={[16, 8, 8]} size={2.6} speed={0.3} color="#7fc4ff" opacity={0.75} />}
      <Map3D reduce={reduce} labels={labels} />
    </Canvas>
  );
}

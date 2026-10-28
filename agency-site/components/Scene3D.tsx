"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Html, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
type Scroll = React.RefObject<number>;

const RINGS = [
  { r: 4.7, tube: 0.006, color: "#d3ddf5", speed: 0.15, offset: 0.9, yaw: 0.0, label: "01 · Digital" },
  { r: 3.65, tube: 0.008, color: "#a9c0f4", speed: -0.22, offset: 3.6, yaw: 0.16, label: "02 · Trading" },
  { r: 2.6, tube: 0.011, color: "#1f5fe0", speed: 0.32, offset: 5.3, yaw: -0.2, label: "03 · Accounts" },
] as const;
const TAIL = 9;

/** A dot that circles its ring, with a fading comet tail and a mono label. */
function Dot({ ring, scroll }: { ring: (typeof RINGS)[number]; scroll: Scroll }) {
  const showLabel = useThree((s) => s.viewport.width) > 7;
  const head = useRef<THREE.Group>(null);
  const tail = useRef<(THREE.Mesh | null)[]>([]);
  const label = useRef<HTMLDivElement>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = scroll.current ?? 0;
    const a = t * ring.speed * (1 + p * 2) + ring.offset;
    const dir = Math.sign(ring.speed);
    head.current?.position.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0);
    tail.current.forEach((m, k) => {
      const b = a - dir * (k + 1) * 0.04 * (1 + p);
      m?.position.set(Math.cos(b) * ring.r, Math.sin(b) * ring.r, 0);
    });
    if (label.current) label.current.style.opacity = String(ease(clamp((t - 1.4) / 1, 0, 1)) * (1 - p * 1.2));
  });

  return (
    <>
      {Array.from({ length: TAIL }, (_, k) => (
        <mesh key={k} ref={(m) => { tail.current[k] = m; }} scale={1 - (k + 1) / (TAIL + 1)}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#1f5fe0" transparent opacity={0.32 * (1 - (k + 1) / (TAIL + 1))} />
        </mesh>
      ))}
      <group ref={head}>
        <mesh>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#1f5fe0" roughness={0.25} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshBasicMaterial color="#1f5fe0" transparent opacity={0.13} />
        </mesh>
        {showLabel && <Html zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <div ref={label} style={{ opacity: 0 }} className="ml-4 mt-3 whitespace-nowrap rounded-full border border-[#e4e6eb] bg-white/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0a0d14] shadow-sm backdrop-blur">
            {ring.label}
          </div>
        </Html>}
      </group>
    </>
  );
}

function Rings({ scroll }: { scroll: Scroll }) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = scroll.current ?? 0;
    const intro = ease(clamp(t / 1.8, 0, 1));
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, THREE.MathUtils.lerp(1.28, 1.52, p) - state.pointer.y * 0.12, 0.06);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.18, 0.06);
    g.rotation.z = -0.24;
    g.scale.setScalar((0.55 + 0.45 * intro) * (1 + p * 0.35));
    mats.current.forEach((m) => { if (m) m.opacity = intro * (1 - p * 0.75); });
  });

  return (
    <group ref={group}>
      {RINGS.map((ring, i) => (
        <group key={i} rotation={[0, ring.yaw, 0]}>
          <mesh>
            <torusGeometry args={[ring.r, ring.tube, 8, 256]} />
            <meshBasicMaterial ref={(m) => { mats.current[i] = m; }} color={ring.color} transparent />
          </mesh>
          <Dot ring={ring} scroll={scroll} />
        </group>
      ))}
    </group>
  );
}

const SHEETS = [
  { fill: "#ffffff", edge: "#b4c8f5" },
  { fill: "#f6f9ff", edge: "#6b97f2" },
  { fill: "#ffffff", edge: "#1f5fe0" },
] as const;

/** Soft blue light pool under the stack. */
function Glow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const x = c.getContext("2d")!;
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(47,123,240,0.4)");
    g.addColorStop(0.5, "rgba(47,123,240,0.16)");
    g.addColorStop(1, "rgba(47,123,240,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
      <planeGeometry args={[5.2, 5.2]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Core({ scroll }: { scroll: Scroll }) {
  const group = useRef<THREE.Group>(null);
  const sheets = useRef<(THREE.Group | null)[]>([]);
  const bars = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = scroll.current ?? 0;
    const t = state.clock.elapsedTime;
    const intro = ease(clamp((t - 0.3) / 1.6, 0, 1));
    const gap = 0.36 + p * 0.9;
    sheets.current.forEach((s, i) => {
      if (s) s.position.y = THREE.MathUtils.lerp(s.position.y, (i - 1) * gap + Math.sin(t * 0.9 + i) * 0.04, 0.08);
    });
    // live "chart" on the top sheet
    bars.current.forEach((b, k) => {
      if (!b) return;
      const h = 0.12 + (0.5 + 0.5 * Math.sin(t * 1.1 + k * 0.9)) * 0.34 + k * 0.05;
      b.scale.y = h * intro;
      b.position.y = 0.055 + (h * intro) / 2;
    });
    g.scale.setScalar(0.4 + 0.6 * intro);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.62 + state.pointer.x * 0.4 + Math.sin(t * 0.3) * 0.12 + p * 0.8, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.5 - state.pointer.y * 0.2, 0.06);
  });

  return (
    <>
      <Glow />
      <group ref={group}>
        {SHEETS.map((s, i) => (
          <group key={i} ref={(el) => { sheets.current[i] = el; }}>
            <mesh>
              <boxGeometry args={[2.3, 0.1, 1.55]} />
              <meshPhysicalMaterial color={s.fill} roughness={0.35} clearcoat={0.5} clearcoatRoughness={0.3} />
              <Edges color={s.edge} threshold={15} />
            </mesh>
            {i === 2 ? (
              <>
                {[0, 1, 2, 3, 4].map((k) => (
                  <mesh key={k} ref={(m) => { bars.current[k] = m; }} position={[-0.7 + k * 0.22, 0.1, 0.35]}>
                    <boxGeometry args={[0.13, 1, 0.13]} />
                    <meshStandardMaterial color={k === 4 ? "#1f5fe0" : "#8fb0f5"} roughness={0.4} />
                  </mesh>
                ))}
                <mesh position={[0.35, 0.056, -0.38]}><boxGeometry args={[1.2, 0.01, 0.08]} /><meshStandardMaterial color="#1f5fe0" /></mesh>
                <mesh position={[0.1, 0.056, -0.2]}><boxGeometry args={[0.7, 0.01, 0.06]} /><meshStandardMaterial color="#d7dce6" /></mesh>
              </>
            ) : (
              [[-0.65, -0.42, 1.1], [-0.5, -0.2, 0.75], [-0.62, 0.02, 0.9], [-0.55, 0.24, 0.6]].map(([x, z, w], k) => (
                <mesh key={k} position={[x + w / 2, 0.056, z]}>
                  <boxGeometry args={[w, 0.01, 0.07]} />
                  <meshStandardMaterial color={i === 1 && k === 0 ? "#5b8cf0" : "#d7dce6"} roughness={0.6} />
                </mesh>
              ))
            )}
            <mesh position={[0.85, 0.056, 0.45]}>
              <boxGeometry args={[0.28, 0.01, 0.28]} />
              <meshStandardMaterial color={i === 0 ? "#e8edf8" : "#cfdcf9"} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

function Rig() {
  const viewport = useThree((s) => s.viewport);
  const scroll = useRef(0);
  useFrame(() => {
    scroll.current = clamp((typeof window !== "undefined" ? window.scrollY : 0) / 650, 0, 1);
  });
  const s = clamp(viewport.width / 11.4, 0.34, 1.05);
  return (
    <group scale={s} position={[0, -0.1, 0]}>
      <Rings scroll={scroll} />
      <Core scroll={scroll} />
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 9.5], fov: 36 }}
      dpr={[1, 1.75]}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 3]} scale={[14, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[-6, 0, 2]} scale={[3, 8, 1]} color="#eef3ff" />
        <Lightformer form="rect" intensity={1.5} position={[6, 0, 2]} scale={[3, 8, 1]} color="#ffffff" />
      </Environment>
      <Rig />
    </Canvas>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const RINGS = [
  { r: 4.7, tube: 0.007, color: "#c9d6f7", speed: 0.16, offset: 0.0, yaw: 0.0, dot: false },
  { r: 3.65, tube: 0.008, color: "#9db9f3", speed: -0.24, offset: 2.4, yaw: 0.16, dot: true },
  { r: 2.6, tube: 0.011, color: "#1f5fe0", speed: 0.34, offset: 4.2, yaw: -0.2, dot: true },
] as const;

/** Orbit rings: each ring carries a glowing dot that circles it. */
function Rings({ scroll }: { scroll: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = scroll.current ?? 0;
    const intro = ease(clamp(t / 1.8, 0, 1));
    // intro: rings open up; scroll: rings flatten edge-on and drift apart
    const tilt = THREE.MathUtils.lerp(1.28, 1.52, p);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tilt - state.pointer.y * 0.12, 0.06);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.18, 0.06);
    g.rotation.z = -0.24;
    g.scale.setScalar((0.55 + 0.45 * intro) * (1 + p * 0.35));
    RINGS.forEach((ring, i) => {
      const d = dots.current[i];
      if (d) {
        const a = t * ring.speed * (1 + p * 2) + ring.offset;
        d.position.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0);
      }
      const m = mats.current[i];
      if (m) m.opacity = intro * (1 - p * 0.75);
    });
  });

  return (
    <group ref={group}>
      {RINGS.map((ring, i) => (
        <group key={i} rotation={[0, ring.yaw, 0]}>
          <mesh>
            <torusGeometry args={[ring.r, ring.tube, 8, 256]} />
            <meshBasicMaterial ref={(m) => { mats.current[i] = m; }} color={ring.color} transparent />
          </mesh>
          {ring.dot && (
            <group ref={(el) => { dots.current[i] = el; }}>
              <mesh>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial color="#1f5fe0" roughness={0.25} />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.24, 24, 24]} />
                <meshBasicMaterial color="#1f5fe0" transparent opacity={0.14} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

const SHEETS = [
  { fill: "#ffffff", edge: "#9db9f3" },
  { fill: "#f4f7fd", edge: "#5b8cf0" },
  { fill: "#ffffff", edge: "#1f5fe0" },
] as const;

/** Small porcelain stack at the centre of the orbit; separates on scroll. */
function Core({ scroll }: { scroll: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const sheets = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = scroll.current ?? 0;
    const t = state.clock.elapsedTime;
    const intro = ease(clamp((t - 0.3) / 1.6, 0, 1));
    const gap = 0.34 + p * 0.9;
    sheets.current.forEach((s, i) => {
      if (s) s.position.y = THREE.MathUtils.lerp(s.position.y, (i - 1) * gap + Math.sin(t * 0.9 + i) * 0.04, 0.08);
    });
    g.scale.setScalar(0.4 + 0.6 * intro);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.62 + state.pointer.x * 0.4 + Math.sin(t * 0.3) * 0.12 + p * 0.8, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.5 - state.pointer.y * 0.2, 0.06);
  });

  return (
    <group ref={group}>
      {SHEETS.map((s, i) => (
        <group key={i} ref={(el) => { sheets.current[i] = el; }}>
          <mesh>
            <boxGeometry args={[2.3, 0.1, 1.55]} />
            <meshPhysicalMaterial color={s.fill} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.4} />
            <Edges color={s.edge} threshold={15} />
          </mesh>
          {[[-0.7, -0.4, 0.95], [-0.5, -0.17, 0.6], [-0.65, 0.06, 0.8]].map(([x, z, w], k) => (
            <mesh key={k} position={[x + w / 2, 0.056, z]}>
              <boxGeometry args={[w, 0.01, 0.07]} />
              <meshStandardMaterial color={k === 0 && i === 2 ? "#1f5fe0" : "#d7dce6"} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0.82, 0.056, 0.4]}>
            <boxGeometry args={[0.3, 0.01, 0.3]} />
            <meshStandardMaterial color={i === 2 ? "#1f5fe0" : "#e8edf8"} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Rig() {
  const viewport = useThree((s) => s.viewport);
  const scroll = useRef(0);
  useFrame(() => {
    scroll.current = clamp((typeof window !== "undefined" ? window.scrollY : 0) / 650, 0, 1);
  });
  const s = clamp(viewport.width / 10.4, 0.34, 1.15);
  return (
    <group scale={s} position={[0, -0.25, 0]}>
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

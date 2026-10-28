"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges, Environment, Float, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const SHEETS = [
  { fill: "#ffffff", edge: "#9db9f3", rows: [[-0.6, -0.45, 1.2], [-0.35, -0.2, 0.8], [-0.5, 0.05, 1.0]] },
  { fill: "#f4f7fd", edge: "#5b8cf0", rows: [[-0.7, -0.5, 0.9], [-0.55, -0.25, 1.3], [-0.65, 0.0, 0.7]] },
  { fill: "#ffffff", edge: "#1f5fe0", rows: [[-0.6, -0.5, 1.4], [-0.4, -0.25, 0.9], [-0.55, 0.0, 1.1]] },
] as const;

function Stack() {
  const group = useRef<THREE.Group>(null);
  const sheets = useRef<(THREE.Group | null)[]>([]);
  const orbit = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const scroll = typeof window !== "undefined" ? window.scrollY : 0;
    const p = THREE.MathUtils.clamp(scroll / 700, 0, 1);
    const gap = 0.62 + p * 0.95;
    sheets.current.forEach((s, i) => {
      if (s) s.position.y = THREE.MathUtils.lerp(s.position.y, (i - 1) * gap, 0.08);
    });
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.75 + state.pointer.x * 0.35 + p * 0.9, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.45 - state.pointer.y * 0.18, 0.06);
    if (orbit.current) {
      const t = state.clock.elapsedTime * 0.6;
      orbit.current.position.set(Math.cos(t) * 2.5, 0.2 + Math.sin(t * 1.5) * 0.9, Math.sin(t) * 1.8);
    }
  });

  return (
    <group ref={group}>
      {SHEETS.map((s, i) => (
        <group key={i} ref={(el) => { sheets.current[i] = el; }}>
          <mesh>
            <boxGeometry args={[3.1, 0.12, 2.1]} />
            <meshPhysicalMaterial color={s.fill} roughness={0.4} metalness={0} clearcoat={0.3} clearcoatRoughness={0.4} />
            <Edges color={s.edge} threshold={15} />
          </mesh>
          {s.rows.map(([x, z, w], k) => (
            <mesh key={k} position={[x + w / 2, 0.066, z]}>
              <boxGeometry args={[w, 0.012, 0.09]} />
              <meshStandardMaterial color={k === 0 && i === 2 ? "#1f5fe0" : "#d7dce6"} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[1.15, 0.066, 0.6]}>
            <boxGeometry args={[0.4, 0.012, 0.4]} />
            <meshStandardMaterial color={i === 2 ? "#1f5fe0" : "#e8edf8"} roughness={0.5} />
          </mesh>
        </group>
      ))}
      <mesh ref={orbit}>
        <sphereGeometry args={[0.13, 48, 48]} />
        <meshPhysicalMaterial color="#1f5fe0" roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Rig() {
  const viewport = useThree((s) => s.viewport);
  const scale = viewport.width < 6 ? 0.8 : viewport.width < 9 ? 1.05 : 1.35;
  return (
    <group scale={scale} position={[viewport.width < 9 ? 0 : 0.2, 0.2, 0]}>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.18} scale={11} blur={3.2} far={6} color="#0a0d14" />
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.5}>
        <Stack />
      </Float>
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 9.5], fov: 36 }} dpr={[1, 1.75]} aria-hidden>
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

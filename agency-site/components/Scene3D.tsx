"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type SatProps = { radius: number; speed: number; offset: number; y: number; size: number; color: string; kind: "sphere" | "octa" | "torus" | "box" };

function Satellite({ radius, speed, offset, y, size, color, kind }: SatProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime * speed + offset;
    m.position.set(Math.cos(t) * radius, y + Math.sin(t * 1.4) * 0.45, Math.sin(t) * radius * 0.7);
    m.rotation.x += 0.012;
    m.rotation.y += 0.016;
  });
  return (
    <mesh ref={ref}>
      {kind === "sphere" && <sphereGeometry args={[size, 48, 48]} />}
      {kind === "octa" && <octahedronGeometry args={[size, 0]} />}
      {kind === "torus" && <torusGeometry args={[size, size * 0.34, 32, 64]} />}
      {kind === "box" && <boxGeometry args={[size, size, size]} />}
      <meshPhysicalMaterial color={color} roughness={0.12} metalness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);
  const wide = viewport.width > 9;

  useFrame((state, dt) => {
    const { x, y } = state.pointer;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.7, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.45, 0.05);
    }
    if (ring.current) ring.current.rotation.z += dt * 0.35;
  });

  return (
    <group ref={group} position={[wide ? 3.2 : 0, wide ? 0 : 2.1, 0]} scale={wide ? 1 : 0.6}>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.1}>
        <mesh>
          <icosahedronGeometry args={[1.45, 32]} />
          <MeshDistortMaterial color="#2f9bf2" distort={0.42} speed={2.2} roughness={0.08} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.3, 0.3, 0]}>
          <torusGeometry args={[2.35, 0.03, 24, 200]} />
          <meshStandardMaterial color="#0b5fcc" emissive="#2f9bf2" emissiveIntensity={0.4} />
        </mesh>
        <Satellite radius={2.9} speed={0.55} offset={0} y={0.3} size={0.34} color="#ffffff" kind="sphere" />
        <Satellite radius={3.3} speed={0.4} offset={2} y={-0.6} size={0.3} color="#7c8cff" kind="octa" />
        <Satellite radius={2.6} speed={0.7} offset={4} y={0.9} size={0.22} color="#bfe9ff" kind="torus" />
        <Satellite radius={3.6} speed={0.3} offset={1} y={1.2} size={0.28} color="#0b5fcc" kind="box" />
        <Satellite radius={3.0} speed={0.62} offset={5} y={-1.1} size={0.2} color="#ffb347" kind="sphere" />
      </Float>
    </group>
  );
}

function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    let seed = 4242;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const r = 4 + rand() * 9;
      const t = rand() * Math.PI * 2;
      const p = Math.acos(2 * rand() - 1);
      a[i * 3] = r * Math.sin(p) * Math.cos(t);
      a[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      a[i * 3 + 2] = r * Math.cos(p);
    }
    return a;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#2f9bf2" size={0.045} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  );
}

export default function Scene3D() {
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 8], fov: 48 }} dpr={[1, 1.75]} aria-hidden>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 6, 6]} intensity={3} color="#ffffff" />
      <pointLight position={[-6, -2, 3]} intensity={60} color="#7c8cff" />
      <pointLight position={[4, -4, 4]} intensity={40} color="#bfe9ff" />
      <Core />
      <Particles />
    </Canvas>
  );
}

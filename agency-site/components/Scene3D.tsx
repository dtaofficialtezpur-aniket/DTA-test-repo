"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Core() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);

  useFrame((state, dt) => {
    const { x, y } = state.pointer;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.6, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.4, 0.05);
    }
    if (ring.current) ring.current.rotation.z += dt * 0.3;
  });

  return (
    <group ref={group} position={[viewport.width > 9 ? 2.6 : 0, viewport.width > 9 ? 0 : 1.5, 0]}>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh>
          <icosahedronGeometry args={[1.5, 24]} />
          <MeshDistortMaterial color="#7c5cff" distort={0.45} speed={2} roughness={0.15} metalness={0.7} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.5, 0.015, 16, 160]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[3.1, 0.008, 16, 160]} />
          <meshBasicMaterial color="#7c5cff" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

function Particles({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const r = 4 + rand() * 8;
      const t = rand() * Math.PI * 2;
      const p = Math.acos(2 * rand() - 1);
      a[i * 3] = r * Math.sin(p) * Math.cos(t);
      a[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      a[i * 3 + 2] = r * Math.cos(p);
    }
    return a;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#a9b4ff" size={0.03} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.75]} aria-hidden>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 5]} intensity={2.2} color="#22d3ee" />
      <pointLight position={[-5, -3, 2]} intensity={30} color="#7c5cff" />
      <Core />
      <Particles />
    </Canvas>
  );
}

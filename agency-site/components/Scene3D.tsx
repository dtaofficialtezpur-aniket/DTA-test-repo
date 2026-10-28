"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const Clay = ({ color, rough = 0.62 }: { color: string; rough?: number }) => (
  <meshStandardMaterial color={color} roughness={rough} metalness={0.02} />
);

/** Accounts — a chunky toy calculator */
function Calculator() {
  const keyColors = ["#c9b8ff", "#c9b8ff", "#ff7a45", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#1f4fe8"];
  return (
    <group position={[-1.55, -0.45, 0.2]} rotation={[0.12, 0.45, 0.14]}>
      <RoundedBox args={[1.55, 2.25, 0.5]} radius={0.16} smoothness={5}><Clay color="#fffdf5" /></RoundedBox>
      <RoundedBox args={[1.25, 0.5, 0.1]} radius={0.07} smoothness={4} position={[0, 0.78, 0.26]}><Clay color="#7ee2b8" rough={0.4} /></RoundedBox>
      {keyColors.map((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <RoundedBox key={i} args={[0.36, 0.3, 0.12]} radius={0.06} smoothness={4} position={[-0.42 + col * 0.42, 0.2 - row * 0.36, 0.27]}>
            <Clay color={c} />
          </RoundedBox>
        );
      })}
    </group>
  );
}

/** Digital — a browser window */
function Browser() {
  return (
    <group position={[0.75, 0.95, -0.5]} rotation={[-0.08, -0.38, 0.06]}>
      <RoundedBox args={[2.8, 1.95, 0.2]} radius={0.12} smoothness={5}><Clay color="#ffffff" /></RoundedBox>
      <RoundedBox args={[2.8, 0.38, 0.22]} radius={0.1} smoothness={4} position={[0, 0.78, 0.01]}><Clay color="#c9b8ff" /></RoundedBox>
      {[["#ff7a45", -1.1], ["#ffd84a", -0.92], ["#7ee2b8", -0.74]].map(([c, x]) => (
        <mesh key={c as string} position={[x as number, 0.78, 0.13]}>
          <sphereGeometry args={[0.065, 24, 24]} />
          <Clay color={c as string} />
        </mesh>
      ))}
      <RoundedBox args={[1.5, 0.95, 0.06]} radius={0.06} smoothness={4} position={[-0.5, 0.05, 0.12]}><Clay color="#bfe3ff" /></RoundedBox>
      <RoundedBox args={[0.8, 0.14, 0.05]} radius={0.05} smoothness={3} position={[0.75, 0.38, 0.12]}><Clay color="#1f4fe8" /></RoundedBox>
      <RoundedBox args={[0.8, 0.1, 0.05]} radius={0.04} smoothness={3} position={[0.75, 0.15, 0.12]}><Clay color="#d8d2c4" /></RoundedBox>
      <RoundedBox args={[0.6, 0.1, 0.05]} radius={0.04} smoothness={3} position={[0.65, -0.03, 0.12]}><Clay color="#d8d2c4" /></RoundedBox>
      <RoundedBox args={[1.9, 0.1, 0.05]} radius={0.04} smoothness={3} position={[-0.2, -0.62, 0.12]}><Clay color="#d8d2c4" /></RoundedBox>
      <mesh position={[0.95, -0.35, 0.3]} rotation={[0, 0, 0.55]}>
        <coneGeometry args={[0.13, 0.34, 3]} />
        <Clay color="#15120e" />
      </mesh>
    </group>
  );
}

/** Trading — a licence certificate with a seal */
function Certificate() {
  return (
    <group position={[1.6, -1.1, 0.7]} rotation={[0.08, -0.32, -0.12]}>
      <RoundedBox args={[1.75, 2.3, 0.12]} radius={0.1} smoothness={4}><Clay color="#ffd84a" /></RoundedBox>
      <RoundedBox args={[1.5, 2.05, 0.05]} radius={0.06} smoothness={4} position={[0, 0, 0.07]}><Clay color="#fff8dc" /></RoundedBox>
      <RoundedBox args={[0.95, 0.15, 0.04]} radius={0.05} smoothness={3} position={[0, 0.75, 0.11]}><Clay color="#15120e" /></RoundedBox>
      {[0.45, 0.25, 0.05].map((y, i) => (
        <RoundedBox key={y} args={[1.1 - i * 0.2, 0.08, 0.04]} radius={0.03} smoothness={3} position={[0, y, 0.11]}><Clay color="#d8d2c4" /></RoundedBox>
      ))}
      {/* ribbons + seal */}
      <mesh position={[0.3, -0.98, 0.1]} rotation={[0, 0, 0.25]}><boxGeometry args={[0.22, 0.5, 0.04]} /><Clay color="#e55a22" /></mesh>
      <mesh position={[0.5, -0.98, 0.1]} rotation={[0, 0, -0.25]}><boxGeometry args={[0.22, 0.5, 0.04]} /><Clay color="#ff7a45" /></mesh>
      <mesh position={[0.4, -0.62, 0.13]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.38, 0.38, 0.08, 48]} /><Clay color="#ff7a45" /></mesh>
      <mesh position={[0.4, -0.62, 0.14]}><torusGeometry args={[0.38, 0.045, 16, 48]} /><Clay color="#1f4fe8" /></mesh>
      <mesh position={[0.34, -0.66, 0.19]} rotation={[0, 0, -0.78]}><boxGeometry args={[0.1, 0.2, 0.04]} /><Clay color="#ffffff" /></mesh>
      <mesh position={[0.45, -0.6, 0.19]} rotation={[0, 0, 0.78]}><boxGeometry args={[0.1, 0.36, 0.04]} /><Clay color="#ffffff" /></mesh>
    </group>
  );
}

/** A spinning rupee-style coin */
function Coin() {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 1.3;
  });
  return (
    <group position={[-1.6, 1.75, 0.4]}>
      <group ref={spin}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.62, 0.62, 0.14, 64]} /><meshStandardMaterial color="#ffc933" roughness={0.35} metalness={0.35} /></mesh>
        <mesh><torusGeometry args={[0.62, 0.05, 16, 64]} /><meshStandardMaterial color="#e8a800" roughness={0.35} metalness={0.4} /></mesh>
        <mesh position={[0, 0.13, 0.09]}><boxGeometry args={[0.42, 0.07, 0.03]} /><Clay color="#15120e" /></mesh>
        <mesh position={[0, 0.0, 0.09]}><boxGeometry args={[0.42, 0.07, 0.03]} /><Clay color="#15120e" /></mesh>
        <mesh position={[0.04, -0.17, 0.09]} rotation={[0, 0, -0.6]}><boxGeometry args={[0.07, 0.4, 0.03]} /><Clay color="#15120e" /></mesh>
        <mesh position={[0, 0.13, -0.09]}><boxGeometry args={[0.42, 0.07, 0.03]} /><Clay color="#15120e" /></mesh>
        <mesh position={[0, 0.0, -0.09]}><boxGeometry args={[0.42, 0.07, 0.03]} /><Clay color="#15120e" /></mesh>
        <mesh position={[-0.04, -0.17, -0.09]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.07, 0.4, 0.03]} /><Clay color="#15120e" /></mesh>
      </group>
    </group>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.5, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.28, 0.06);
  });
  return (
    <>
      <ContactShadows position={[0, -2.55, 0]} opacity={0.32} scale={9} blur={2.6} far={5} color="#15120e" />
      <group ref={group} scale={0.92}>
        <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.6}><Calculator /></Float>
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.7}><Browser /></Float>
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}><Certificate /></Float>
        <Float speed={2} floatIntensity={1}><Coin /></Float>
        <Float speed={2.2} floatIntensity={1.2}><mesh position={[-2.55, -1.7, 0.3]}><sphereGeometry args={[0.24, 32, 32]} /><Clay color="#7ee2b8" /></mesh></Float>
        <Float speed={1.7} rotationIntensity={1} floatIntensity={1.2}><mesh position={[2.75, 1.95, -0.6]}><torusGeometry args={[0.26, 0.09, 24, 48]} /><Clay color="#ff7a45" /></mesh></Float>
        <Float speed={2.4} rotationIntensity={1.5} floatIntensity={1}><mesh position={[2.8, -0.1, 0.2]}><boxGeometry args={[0.3, 0.3, 0.3]} /><Clay color="#1f4fe8" /></mesh></Float>
        <Float speed={1.9} rotationIntensity={1.2} floatIntensity={1.2}><mesh position={[-0.4, 2.3, -0.4]}><octahedronGeometry args={[0.25]} /><Clay color="#c9b8ff" /></mesh></Float>
      </group>
    </>
  );
}

export default function Scene3D() {
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 9.2], fov: 40 }} dpr={[1, 1.75]} aria-hidden>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 3]} scale={[12, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} scale={[3, 8, 1]} color="#fff4d6" />
        <Lightformer form="rect" intensity={2} position={[6, 0, 2]} scale={[3, 8, 1]} color="#dfe9ff" />
      </Environment>
      <Rig />
    </Canvas>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type Kind = "chrome" | "blue" | "amber" | "pearl";
const mats: Record<Kind, { color: string; metalness: number; roughness: number }> = {
  chrome: { color: "#ffffff", metalness: 1, roughness: 0.06 },
  blue: { color: "#2f9bf2", metalness: 0.6, roughness: 0.1 },
  amber: { color: "#ffb347", metalness: 0.4, roughness: 0.12 },
  pearl: { color: "#e9f2ff", metalness: 0.2, roughness: 0.08 },
};

function Satellite({ radius, speed, offset, y, size, kind, shape = "sphere" }: { radius: number; speed: number; offset: number; y: number; size: number; kind: Kind; shape?: "sphere" | "octa" | "torus" }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime * speed + offset;
    m.position.set(Math.cos(t) * radius, y + Math.sin(t * 1.4) * 0.4, Math.sin(t) * radius * 0.75);
    m.rotation.x += 0.01;
    m.rotation.y += 0.014;
  });
  const m = mats[kind];
  return (
    <mesh ref={ref}>
      {shape === "sphere" && <sphereGeometry args={[size, 64, 64]} />}
      {shape === "octa" && <octahedronGeometry args={[size, 0]} />}
      {shape === "torus" && <torusGeometry args={[size, size * 0.32, 32, 64]} />}
      <meshPhysicalMaterial {...m} clearcoat={1} clearcoatRoughness={0.05} />
    </mesh>
  );
}

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.z += dt * 0.35;
    if (b.current) b.current.rotation.z -= dt * 0.25;
    if (c.current) c.current.rotation.z += dt * 0.18;
  });
  return (
    <>
      <mesh ref={a} rotation={[Math.PI / 2.2, 0.25, 0]}>
        <torusGeometry args={[2.45, 0.035, 32, 240]} />
        <meshStandardMaterial color="#dbeaff" metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 3, -0.6, 0.4]}>
        <torusGeometry args={[2.95, 0.02, 32, 240]} />
        <meshStandardMaterial color="#2f9bf2" metalness={0.8} roughness={0.15} emissive="#2f9bf2" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={c} rotation={[Math.PI / 1.9, 0.9, 0.2]}>
        <torusGeometry args={[3.45, 0.012, 24, 240]} />
        <meshStandardMaterial color="#7c8cff" metalness={0.8} roughness={0.2} emissive="#7c8cff" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

function Crystal() {
  const core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (core.current) core.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.06);
  });
  return (
    <Float speed={1.5} rotationIntensity={0.7} floatIntensity={0.9}>
      <mesh>
        <icosahedronGeometry args={[1.55, 1]} />
        <MeshTransmissionMaterial
          flatShading
          backside
          samples={6}
          resolution={512}
          thickness={1.4}
          chromaticAberration={0.14}
          anisotropicBlur={0.15}
          distortion={0.2}
          distortionScale={0.4}
          temporalDistortion={0.08}
          ior={1.28}
          roughness={0.04}
          color="#d6ecff"
          attenuationColor="#6cc0ff"
          attenuationDistance={2.2}
        />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.62, 3]} />
        <meshBasicMaterial color="#3aa8ff" />
      </mesh>
      <pointLight color="#3aa8ff" intensity={14} distance={5} />
    </Float>
  );
}

function Rig() {
  const group = useRef<THREE.Group>(null);
  const viewport = useThree((s) => s.viewport);
  const wide = viewport.width > 9;
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer;
    const scroll = typeof window !== "undefined" ? window.scrollY : 0;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.7 + scroll * 0.003, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.4, 0.06);
  });
  return (
    <group position={[wide ? 3.2 : 0, wide ? 0 : 2.1, 0]} scale={wide ? 1 : 0.5}>
      <ContactShadows position={[0, -3.1, 0]} opacity={0.35} scale={10} blur={3} far={5} color="#0b5fcc" />
      <group ref={group}>
        <Crystal />
        <Rings />
        <Satellite radius={3.0} speed={0.5} offset={0} y={0.4} size={0.3} kind="chrome" />
        <Satellite radius={3.4} speed={0.38} offset={2.2} y={-0.7} size={0.26} kind="blue" shape="octa" />
        <Satellite radius={2.7} speed={0.65} offset={4.1} y={1.0} size={0.2} kind="amber" />
        <Satellite radius={3.7} speed={0.3} offset={1.1} y={1.3} size={0.22} kind="pearl" shape="torus" />
        <Satellite radius={3.1} speed={0.58} offset={5.2} y={-1.2} size={0.16} kind="chrome" />
      </group>
    </group>
  );
}

export default function Scene3D() {
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 8.5], fov: 46 }} dpr={[1, 1.5]} aria-hidden>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 6, 6]} intensity={2} />
      {/* procedural studio lighting: no HDR download needed */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[12, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} scale={[4, 9, 1]} color="#bfe9ff" />
        <Lightformer form="ring" intensity={3} position={[6, -1, 3]} scale={4} color="#7c8cff" />
        <Lightformer form="rect" intensity={2} position={[0, -4, 3]} scale={[9, 2, 1]} color="#ffffff" />
      </Environment>
      <Rig />
      <Sparkles count={70} scale={[14, 8, 6]} size={3} speed={0.35} color="#2f9bf2" opacity={0.7} />
    </Canvas>
  );
}

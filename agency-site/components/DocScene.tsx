"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const ss = (a: number, b: number, t: number) => THREE.MathUtils.smoothstep(t, a, b);
const W = 640;
const H = 840;
const FONT = '"Source Sans 3", system-ui, sans-serif';
const INK = "#0B1B33";
const MUTED = "#5B6B82";
const BLUE = "#0B5FCC";
const LINE = "#E3E8F0";

type Draw = (c: CanvasRenderingContext2D) => void;

const SCALE = 1.6; // render the paper at higher resolution so small print stays crisp

function useTexture(draw: Draw, w = W, h = H) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w * SCALE;
    canvas.height = h * SCALE;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const paint = () => {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      draw(ctx);
      ctx.restore();
      tex.needsUpdate = true;
    };
    paint();
    document.fonts?.ready.then(paint);
    return tex;
  }, [draw, w, h]);
}

function frame(c: CanvasRenderingContext2D, title: string, sub: string) {
  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, W, H);
  c.fillStyle = BLUE;
  c.fillRect(0, 0, W, 10);
  c.fillStyle = INK;
  c.font = `700 40px ${FONT}`;
  c.fillText(title, 44, 92);
  c.fillStyle = MUTED;
  c.font = `400 25px ${FONT}`;
  c.fillText(sub, 44, 130);
  c.fillStyle = LINE;
  c.fillRect(44, 156, W - 88, 2);
  c.fillStyle = MUTED;
  c.font = `600 20px ${FONT}`;
  c.textAlign = "right";
  c.fillText("DTA", W - 44, H - 40);
  c.textAlign = "left";
}

function row(c: CanvasRenderingContext2D, y: number, label: string, value: string, strong = false) {
  c.fillStyle = MUTED;
  c.font = `400 25px ${FONT}`;
  c.fillText(label, 44, y);
  c.fillStyle = INK;
  c.font = `${strong ? 700 : 600} ${strong ? 32 : 27}px ${FONT}`;
  c.textAlign = "right";
  c.fillText(value, W - 44, y);
  c.textAlign = "left";
  c.fillStyle = LINE;
  c.fillRect(44, y + 22, W - 88, 1.5);
}

const drawGst: Draw = (c) => {
  frame(c, "GST return", "GSTR-3B · October 2026");
  row(c, 232, "Outward supplies", "₹ 8,20,000");
  row(c, 312, "Input tax credit", "₹ 3,15,000");
  row(c, 392, "Tax payable", "₹ 24,500", true);
  c.fillStyle = "#E6F4EC";
  c.beginPath();
  c.roundRect(44, 470, 270, 62, 10);
  c.fill();
  c.fillStyle = "#1E8E5A";
  c.font = `700 25px ${FONT}`;
  c.fillText("✓  Filed on time", 66, 511);
  c.fillStyle = MUTED;
  c.font = `400 22px ${FONT}`;
  c.fillText("TDS reconciled. ITR submitted.", 44, 600);
};

const drawLicence: Draw = (c) => {
  frame(c, "Trade licence", "Municipal Corporation");
  row(c, 232, "Business", "Kalita Stores");
  row(c, 312, "Licence no.", "TL/2026/0412");
  row(c, 392, "Valid till", "31 Mar 2027");
  c.fillStyle = MUTED;
  c.font = `400 22px ${FONT}`;
  c.fillText("Application, follow-up and delivery", 44, 480);
  c.fillText("handled by DTA.", 44, 510);
};

const drawDigital: Draw = (c) => {
  frame(c, "Website and CRM", "This month");
  c.fillStyle = INK;
  c.font = `700 110px ${FONT}`;
  c.fillText("142", 44, 300);
  c.fillStyle = MUTED;
  c.font = `400 25px ${FONT}`;
  c.fillText("new leads", 44, 340);
  c.fillStyle = "#1E8E5A";
  c.font = `700 27px ${FONT}`;
  c.fillText("+18%", 250, 292);
  const bars = [0.32, 0.45, 0.38, 0.6, 0.52, 0.78, 0.94];
  bars.forEach((v, i) => {
    const h = v * 230;
    c.fillStyle = i === bars.length - 1 ? BLUE : "#C9DAF5";
    c.beginPath();
    c.roundRect(44 + i * 78, 640 - h, 54, h, 6);
    c.fill();
  });
  c.fillStyle = LINE;
  c.fillRect(44, 644, W - 88, 2);
  c.fillStyle = MUTED;
  c.font = `400 22px ${FONT}`;
  c.fillText("Revenue ₹ 8.2L", 44, 690);
};

const drawSeal: Draw = (c) => {
  c.clearRect(0, 0, 400, 400);
  c.translate(200, 200);
  c.rotate(-0.21);
  c.strokeStyle = "#E4472B";
  c.fillStyle = "#E4472B";
  c.lineWidth = 12;
  c.beginPath();
  c.arc(0, 0, 176, 0, Math.PI * 2);
  c.stroke();
  c.lineWidth = 4;
  c.beginPath();
  c.arc(0, 0, 150, 0, Math.PI * 2);
  c.stroke();
  c.textAlign = "center";
  c.font = `800 62px ${FONT}`;
  c.fillText("APPROVED", 0, 18);
  c.font = `700 28px ${FONT}`;
  c.fillText("DTA", 0, 76);
  c.fillRect(-96, -56, 192, 5);
};

function Sheet({ draw, position, rot, label, labelY = 1.5 }: { draw: Draw; position: [number, number, number]; rot: [number, number, number]; label: string; labelY?: number }) {
  const map = useTexture(draw);
  const showLabel = useThree((s) => s.viewport.width) > 7.5;
  return (
    <group position={position} rotation={rot}>
      <mesh position={[0.05, -0.07, -0.04]}>
        <planeGeometry args={[1.95, 2.55]} />
        <meshBasicMaterial color="#0B1B33" transparent opacity={0.07} />
      </mesh>
      <RoundedBox args={[1.9, 2.5, 0.03]} radius={0.015} smoothness={3}>
        <meshStandardMaterial color="#f4f6fa" roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, 0.0165]}>
        <planeGeometry args={[1.9, 2.5]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      {showLabel && <Html position={[0, labelY, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-[#0B1B33] shadow-sm ring-1 ring-[#E3E8F0]">{label}</span>
      </Html>}
    </group>
  );
}

/** One-time approval: stamp comes down on the licence, leaves a seal, lifts away. */
function Licence({ reduce }: { reduce: boolean }) {
  const seal = useRef<THREE.Mesh>(null);
  const stamp = useRef<THREE.Group>(null);
  const sealTex = useTexture(drawSeal, 400, 400);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const approach = reduce ? 1 : ss(1.0, 1.7, t);
    const press = reduce ? 1 : ss(1.75, 1.9, t);
    const lift = reduce ? 1 : ss(2.15, 2.8, t);
    const z = 2.4 - approach * 2.1 - press * 0.22 + lift * 2.6;
    if (stamp.current) {
      stamp.current.position.set(0.55, -0.75, z);
      stamp.current.visible = !reduce && t > 0.9 && t < 3.0;
    }
    if (seal.current && matRef.current) {
      const k = reduce ? 1 : ss(1.88, 2.05, t);
      seal.current.scale.setScalar(0.001 + (1.12 - 0.12 * k) * k * 0.62);
      matRef.current.opacity = k;
    }
  });
  return (
    <>
      <Sheet draw={drawLicence} position={[0, 0, 0.35]} rot={[0, 0, 0]} label="Licences and registrations" />
      <group position={[0, 0, 0.35]}>
        <mesh ref={seal} position={[0.55, -0.75, 0.03]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial ref={matRef} map={sealTex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
        <group ref={stamp}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.12, 40]} /><meshStandardMaterial color="#E4472B" roughness={0.45} /></mesh>
          <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.17, 0.75, 32]} /><meshStandardMaterial color="#0B1B33" roughness={0.4} /></mesh>
          <mesh position={[0, 0, 0.86]}><sphereGeometry args={[0.2, 24, 24]} /><meshStandardMaterial color="#0B1B33" roughness={0.35} /></mesh>
        </group>
      </group>
    </>
  );
}

function Rig({ reduce }: { reduce: boolean }) {
  const g = useRef<THREE.Group>(null);
  const viewport = useThree((s) => s.viewport);
  const wide = viewport.width > 7.5;
  const s = wide ? clamp(viewport.width / 9.4, 0.8, 1.12) : 0.78;
  const gap = wide ? 2.2 : 1.5;
  const baseY = wide ? -1.9 : -2.35;
  useFrame((st) => {
    if (!g.current) return;
    const scroll = clamp(window.scrollY / 700, 0, 1);
    const px = reduce ? 0 : st.pointer.x;
    const py = reduce ? 0 : st.pointer.y;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, px * 0.18 + scroll * 0.25, 0.06);
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -0.12 - py * 0.08, 0.06);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, baseY + scroll * 1.4, 0.08);
  });
  return (
    <group ref={g} scale={s} position={[0, baseY, 0]}>
      <Sheet draw={drawDigital} position={[-gap, -0.12, 0]} rot={[0, 0.32, 0.035]} label="Websites and CRM" />
      <Licence reduce={reduce} />
      <Sheet draw={drawGst} position={[gap, -0.12, 0]} rot={[0, -0.32, -0.035]} label="GST and tax filing" />
    </group>
  );
}

export default function DocScene() {
  const reduce = useMemo(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, []);
  useEffect(() => undefined, []);
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 9.5], fov: 36 }}
      dpr={[1, 1.75]}
      eventSource={document.body}
      eventPrefix="client"
      aria-hidden
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 6, 6]} intensity={1.6} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 3]} scale={[12, 4, 1]} color="#ffffff" />
      </Environment>
      <Rig reduce={reduce} />
    </Canvas>
  );
}

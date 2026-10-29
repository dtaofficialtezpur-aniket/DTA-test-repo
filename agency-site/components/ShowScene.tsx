"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges, Environment, Float, Lightformer, RoundedBox, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const ss = (a: number, b: number, t: number) => THREE.MathUtils.smoothstep(t, a, b);
const FONT = '"Source Sans 3", system-ui, sans-serif';
const INK = "#0B1B33";
const MUTED = "#5B6B82";
const BLUE = "#0B5FCC";
const LINE = "#E3E8F0";
const SC = 1.5;

type Draw = (c: CanvasRenderingContext2D, w: number, h: number) => void;

function useTex(draw: Draw, w: number, h: number) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w * SC;
    canvas.height = h * SC;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const paint = () => {
      ctx.setTransform(SC, 0, 0, SC, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      draw(ctx, w, h);
      ctx.restore();
      tex.needsUpdate = true;
    };
    paint();
    document.fonts?.ready.then(paint);
    return tex;
  }, [draw, w, h]);
}

const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) => {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fillStyle = fill;
  c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); }
};

/* ================= A · product showcase ================= */
const drawCrm: Draw = (c, w, h) => {
  c.fillStyle = "#F4F7FB"; c.fillRect(0, 0, w, h);
  c.fillStyle = INK; c.fillRect(0, 0, 150, h);
  c.fillStyle = "#fff"; c.font = `700 30px ${FONT}`; c.fillText("DTA", 26, 52);
  ["Dashboard", "Leads", "Orders", "Stock", "Invoices", "Reports"].forEach((t, i) => {
    if (i === 0) rr(c, 14, 88, 122, 38, 8, "#1c3358");
    c.fillStyle = i === 0 ? "#fff" : "#9fb0c8"; c.font = `500 20px ${FONT}`; c.fillText(t, 28, 114 + i * 46);
  });
  c.fillStyle = INK; c.font = `700 34px ${FONT}`; c.fillText("Business overview", 180, 62);
  [["Leads", "142", "+18%"], ["Revenue", "₹ 8.2L", "+12%"], ["Orders", "1,284", "+6%"], ["Invoices", "326", "+9%"]].forEach(([k, v, d], i) => {
    const x = 180 + i * 262;
    rr(c, x, 90, 244, 118, 12, "#fff", LINE);
    c.fillStyle = MUTED; c.font = `500 20px ${FONT}`; c.fillText(k, x + 20, 126);
    c.fillStyle = INK; c.font = `700 44px ${FONT}`; c.fillText(v, x + 20, 176);
    c.fillStyle = "#1E8E5A"; c.font = `700 20px ${FONT}`; c.fillText(d, x + 150, 126);
  });
  rr(c, 180, 232, 520, 300, 12, "#fff", LINE);
  c.fillStyle = INK; c.font = `700 24px ${FONT}`; c.fillText("Monthly revenue", 204, 272);
  [0.35, 0.5, 0.42, 0.62, 0.55, 0.78, 0.95].forEach((v, i) => rr(c, 210 + i * 66, 500 - v * 190, 44, v * 190, 6, i === 6 ? BLUE : "#CFE0FA"));
  rr(c, 724, 232, 318, 300, 12, "#fff", LINE);
  c.fillStyle = INK; c.font = `700 24px ${FONT}`; c.fillText("Lead pipeline", 748, 272);
  [["New", "Rahul Traders", "#BFE3FF"], ["In talks", "Bora Foods", "#E1D8FF"], ["Won", "Kalita Stores", "#C9F0DD"]].forEach(([s, n, col], i) => {
    rr(c, 748, 296 + i * 76, 270, 62, 10, "#F4F7FB");
    rr(c, 762, 308 + i * 76, 74, 24, 12, col);
    c.fillStyle = INK; c.font = `600 15px ${FONT}`; c.fillText(s, 772, 326 + i * 76);
    c.font = `600 20px ${FONT}`; c.fillText(n, 762, 354 + i * 76 + 0);
  });
};

const drawPhone: Draw = (c, w, h) => {
  c.fillStyle = "#F4F7FB"; c.fillRect(0, 0, w, h);
  c.fillStyle = INK; c.font = `700 30px ${FONT}`; c.fillText("Leads", 26, 74);
  c.fillStyle = MUTED; c.font = `500 18px ${FONT}`; c.fillText("142 this month", 26, 100);
  [["Rahul Traders", "New · just now", "#BFE3FF"], ["Sen & Co.", "Call back", "#FFE8C2"], ["Bora Foods", "In talks", "#E1D8FF"], ["Das Hardware", "Quote sent", "#E1D8FF"], ["Kalita Stores", "Won", "#C9F0DD"]].forEach(([n, s, col], i) => {
    rr(c, 20, 124 + i * 86, w - 40, 72, 12, "#fff", LINE);
    rr(c, 34, 140 + i * 86, 40, 40, 20, col);
    c.fillStyle = INK; c.font = `600 21px ${FONT}`; c.fillText(n, 90, 158 + i * 86);
    c.fillStyle = MUTED; c.font = `400 17px ${FONT}`; c.fillText(s, 90, 182 + i * 86);
  });
  rr(c, w - 78, h - 100, 56, 56, 28, BLUE);
  c.fillStyle = "#fff"; c.fillRect(w - 62, h - 74, 24, 4); c.fillRect(w - 52, h - 84, 4, 24);
};

const drawKeys: Draw = (c, w, h) => {
  c.fillStyle = "#cfd5df"; c.fillRect(0, 0, w, h);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 14; k++) rr(c, 40 + k * 82, 40 + r * 82, 70, 68, 8, "#e9edf3");
  rr(c, w / 2 - 170, h - 190, 340, 150, 14, "#dfe4ec");
};

function Showcase({ reduce }: { reduce: boolean }) {
  const lid = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const crm = useTex(drawCrm, 1120, 560);
  const keys = useTex(drawKeys, 1200, 860);
  const ph = useTex(drawPhone, 400, 800);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const open = reduce ? 1 : ss(0.4, 2.2, t);
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, -0.22, open);
    if (phone.current) { const k = reduce ? 1 : ss(1.8, 2.6, t); phone.current.scale.setScalar(0.001 + k); phone.current.position.y = 0.35 + (1 - k) * -0.6; }
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, -0.42 + (reduce ? 0 : s.pointer.x * 0.25), 0.05);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, 0.1 - (reduce ? 0 : s.pointer.y * 0.1), 0.05);
    }
  });
  const alu = <meshStandardMaterial color="#dfe3ea" metalness={0.75} roughness={0.28} />;
  return (
    <group ref={root} position={[0.2, -0.7, 0]}>
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.35}>
        <group>
          <RoundedBox args={[3.2, 0.09, 2.15]} radius={0.04} smoothness={4}>{alu}</RoundedBox>
          <mesh position={[0, 0.047, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.0, 2.0]} /><meshBasicMaterial map={keys} toneMapped={false} /></mesh>
          <group ref={lid} position={[0, 0.05, -1.05]}>
            <RoundedBox args={[3.2, 2.05, 0.07]} radius={0.04} smoothness={4} position={[0, 1.025, 0]}>{alu}</RoundedBox>
            <mesh position={[0, 1.04, 0.037]}><planeGeometry args={[3.0, 1.9]} /><meshBasicMaterial map={crm} toneMapped={false} /></mesh>
          </group>
        </group>
      </Float>
      <group ref={phone} position={[1.95, 0.35, 0.95]} rotation={[-0.06, -0.3, 0.03]}>
        <Float speed={1.8} floatIntensity={0.5} rotationIntensity={0.1}>
          <RoundedBox args={[1.0, 2.05, 0.09]} radius={0.14} smoothness={5}><meshStandardMaterial color="#0B1B33" metalness={0.6} roughness={0.3} /></RoundedBox>
          <mesh position={[0, 0, 0.047]}><planeGeometry args={[0.9, 1.95]} /><meshBasicMaterial map={ph} toneMapped={false} /></mesh>
        </Float>
      </group>
      <ContactShadows position={[0, -0.25, 0]} opacity={0.25} scale={9} blur={3} far={3} color="#0B1B33" />
    </group>
  );
}

/* ================= B · service carousel ================= */
const SERVICES: [string, string, string][] = [
  ["web", "Websites", "Fast, mobile-ready sites that bring in enquiries."],
  ["phone", "Mobile apps", "Android and iOS apps for your team and customers."],
  ["ads", "Google and Meta Ads", "Campaigns that you can measure."],
  ["search", "SEO", "Be found on Google and Maps."],
  ["gst", "GST filing", "Registration and returns, filed on time."],
  ["tax", "Income tax", "ITR for individuals and businesses."],
  ["licence", "Licences", "Trade licence, FSSAI, DSC and GeM."],
  ["company", "Company registration", "Private Limited, from name approval to ROC."],
];

function icon(c: CanvasRenderingContext2D, k: string, x: number, y: number) {
  c.strokeStyle = BLUE; c.lineWidth = 7; c.lineCap = "round"; c.lineJoin = "round";
  c.save(); c.translate(x, y); c.beginPath();
  if (k === "web") { c.roundRect(-50, -36, 100, 72, 10); c.moveTo(-50, -14); c.lineTo(50, -14); c.moveTo(-34, -25); c.lineTo(-30, -25); }
  if (k === "phone") { c.roundRect(-26, -50, 52, 100, 12); c.moveTo(-8, 38); c.lineTo(8, 38); }
  if (k === "ads") { c.moveTo(-46, -12); c.lineTo(-46, 16); c.lineTo(-18, 16); c.lineTo(40, 44); c.lineTo(40, -40); c.lineTo(-18, -12); c.closePath(); }
  if (k === "search") { c.arc(-8, -8, 34, 0, Math.PI * 2); c.moveTo(16, 16); c.lineTo(46, 46); }
  if (k === "gst") { c.arc(-24, -24, 12, 0, Math.PI * 2); c.moveTo(36, 24); c.arc(24, 24, 12, 0, Math.PI * 2); c.moveTo(34, -40); c.lineTo(-34, 40); }
  if (k === "tax") { c.roundRect(-36, -48, 72, 96, 8); c.moveTo(-20, -22); c.lineTo(20, -22); c.moveTo(-20, 0); c.lineTo(20, 0); c.moveTo(-20, 22); c.lineTo(4, 22); }
  if (k === "licence") { c.roundRect(-44, -40, 88, 80, 8); c.moveTo(-26, -18); c.lineTo(10, -18); c.moveTo(-26, 2); c.lineTo(0, 2); c.moveTo(34, 12); c.arc(26, 14, 12, 0, Math.PI * 2); }
  if (k === "company") { c.roundRect(-34, -48, 68, 96, 6); c.moveTo(-16, -26); c.lineTo(-16, -22); c.moveTo(16, -26); c.lineTo(16, -22); c.moveTo(-16, -2); c.lineTo(-16, 2); c.moveTo(16, -2); c.lineTo(16, 2); c.moveTo(-8, 48); c.lineTo(-8, 28); c.lineTo(8, 28); c.lineTo(8, 48); }
  c.stroke(); c.restore();
}

function ServiceCard({ svc, a, ring }: { svc: [string, string, string]; a: number; ring: React.RefObject<THREE.Group | null> }) {
  const draw = useMemo<Draw>(() => (c, w, h) => {
    rr(c, 4, 4, w - 8, h - 8, 28, "rgba(255,255,255,0.96)", LINE);
    rr(c, 4, 4, w - 8, 10, 5, BLUE);
    icon(c, svc[0], w / 2, 150);
    c.fillStyle = INK; c.font = `700 36px ${FONT}`; c.textAlign = "center"; c.fillText(svc[1], w / 2, 270, w - 50);
    c.fillStyle = MUTED; c.font = `400 22px ${FONT}`;
    const words = svc[2].split(" "); let line = ""; let y = 318;
    words.forEach((wd) => { const t = line + wd + " "; if (c.measureText(t).width > w - 80) { c.fillText(line.trim(), w / 2, y); line = wd + " "; y += 30; } else line = t; });
    c.fillText(line.trim(), w / 2, y);
  }, [svc]);
  const map = useTex(draw, 360, 480);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const f = Math.cos(a + (ring.current?.rotation.y ?? 0));
    if (mat.current) mat.current.opacity = 0.3 + 0.7 * ss(-0.35, 0.85, f);
  });
  return (
    <group rotation={[0, a, 0]}>
      <mesh position={[0, 0, 3.4]}>
        <planeGeometry args={[1.5, 2.0]} />
        <meshBasicMaterial ref={mat} map={map} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Carousel({ reduce }: { reduce: boolean }) {
  const ring = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!ring.current) return;
    const scroll = clamp(window.scrollY / 700, 0, 1);
    ring.current.rotation.y += dt * (reduce ? 0 : 0.14) + (reduce ? 0 : s.pointer.x * dt * 0.25);
    ring.current.rotation.x = THREE.MathUtils.lerp(ring.current.rotation.x, 0.1 - (reduce ? 0 : s.pointer.y * 0.06), 0.05);
    ring.current.position.y = -1.6 + scroll * 1.0;
  });
  return (
    <group ref={ring} position={[0, -1.6, -1.5]}>
      {SERVICES.map((svc, i) => <ServiceCard key={svc[1]} svc={svc} a={(i / SERVICES.length) * Math.PI * 2} ring={ring} />)}
      <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[3.0, 3.8, 96]} /><meshBasicMaterial color="#0B5FCC" transparent opacity={0.06} /></mesh>
    </group>
  );
}

/* ================= C · chrome ribbon ================= */
function Chrome({ reduce }: { reduce: boolean }) {
  const g = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    if (knot.current) { knot.current.rotation.y += dt * (reduce ? 0 : 0.22); knot.current.rotation.x += dt * (reduce ? 0 : 0.08); }
    if (g.current) {
      g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, reduce ? 0 : s.pointer.x * 0.35, 0.05);
      g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, reduce ? 0 : -s.pointer.y * 0.2, 0.05);
    }
  });
  return (
    <group ref={g}>
      <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.1}>
        <mesh ref={knot} scale={1.15}>
          <torusKnotGeometry args={[1.25, 0.42, 360, 64, 2, 3]} />
          <meshPhysicalMaterial color="#eef2f9" metalness={1} roughness={0.07} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.6} />
        </mesh>
      </Float>
      <ContactShadows position={[0, -2.5, 0]} opacity={0.22} scale={10} blur={3.2} far={4} color="#0B1B33" />
    </group>
  );
}

/* ================= D · dark map ================= */
const OUTLINE: [number, number][] = [
  [74.3, 34.8], [76.8, 35.7], [79.4, 34.5], [78.9, 32.8], [80.3, 30.9], [81.0, 30.1], [83.5, 29.2], [84.7, 28.5], [86.0, 27.9], [88.1, 27.9], [88.8, 27.2], [89.9, 26.7], [92.0, 26.9], [93.5, 27.1], [95.0, 29.1], [96.5, 28.5], [97.3, 28.1], [96.1, 27.3], [95.3, 26.5], [94.6, 25.4], [94.3, 24.0], [93.4, 23.0], [92.7, 21.9],
  [92.2, 23.0], [91.5, 23.2], [91.3, 24.0], [92.3, 24.3], [92.3, 24.9], [91.6, 25.2], [90.3, 25.1], [89.8, 26.0], [89.2, 26.3], [88.4, 25.4], [88.3, 24.6], [88.9, 24.0], [88.8, 22.9], [89.0, 21.9],
  [87.5, 21.6], [86.9, 20.6], [85.5, 19.8], [84.0, 18.4], [82.3, 16.6], [80.3, 15.5], [80.2, 13.3], [79.8, 11.6], [79.9, 10.3], [78.2, 8.9], [77.5, 8.1],
  [76.3, 9.2], [75.0, 12.0], [74.0, 15.0], [73.0, 17.5], [72.8, 19.0], [72.7, 21.0], [72.6, 21.4], [71.0, 20.8], [69.0, 22.3], [68.2, 23.6], [69.5, 24.2], [70.5, 25.6], [70.0, 27.0], [71.2, 27.9], [72.7, 29.0], [74.0, 29.8], [74.6, 31.2], [74.6, 32.3], [75.4, 32.9],
];
const K = 0.2;
const mp = (lon: number, lat: number) => new THREE.Vector3((lon - 83) * K, (lat - 22.5) * K, 0);

function DarkMap({ reduce }: { reduce: boolean }) {
  const g = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.ExtrudeGeometry(new THREE.Shape(OUTLINE.map(([lo, la]) => new THREE.Vector2((lo - 83) * K, (la - 22.5) * K))), { depth: 0.2, bevelEnabled: false }), []);
  const tez = useMemo(() => mp(92.8, 26.6).setZ(0.21), []);
  const blr = useMemo(() => mp(77.6, 13.0).setZ(0.21), []);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(tez, tez.clone().add(blr).multiplyScalar(0.5).setZ(1.7), blr), [tez, blr]);
  const arc = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)), [curve]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (g.current) {
      g.current.rotation.x = -0.9 - (reduce ? 0 : s.pointer.y * 0.1);
      g.current.rotation.z = -0.1 + (reduce ? 0 : s.pointer.x * 0.18);
    }
    const u = (t * 0.28) % 1;
    if (pulse.current) pulse.current.position.copy(curve.getPoint(reduce ? 0.5 : u));
    if (halo.current) halo.current.scale.setScalar(1 + (reduce ? 0 : Math.sin(t * 3) * 0.2));
  });
  return (
    <group ref={g} position={[0, -0.2, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#0d2142" metalness={0.3} roughness={0.55} emissive="#0a2c63" emissiveIntensity={0.55} />
        <Edges color="#4aa3ff" threshold={30} />
      </mesh>
      <line><primitive object={arc} attach="geometry" /><lineBasicMaterial color="#6fd0ff" /></line>
      <mesh ref={pulse}><sphereGeometry args={[0.08, 16, 16]} /><meshBasicMaterial color="#c8f1ff" /></mesh>
      {[tez, blr].map((p, i) => (
        <group key={i} position={p.toArray()}>
          <mesh position={[0, 0, 0.1]}><cylinderGeometry args={[0.025, 0.025, 0.2, 12]} /><meshBasicMaterial color="#6fd0ff" /></mesh>
          <mesh position={[0, 0, 0.24]}><sphereGeometry args={[0.1, 24, 24]} /><meshBasicMaterial color="#9be3ff" /></mesh>
          <mesh ref={i === 0 ? halo : undefined} position={[0, 0, 0.24]}><sphereGeometry args={[0.26, 24, 24]} /><meshBasicMaterial color="#3aa8ff" transparent opacity={0.22} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ================= shell ================= */
function Rig({ v, reduce }: { v: string; reduce: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const s = clamp(viewport.width / 9.4, 0.5, 1.1);
  const wide = viewport.width > 7.5;
  if (v === "b") return <group scale={wide ? s * 0.8 : 0.55} position={[0, wide ? 0.55 : 0.3, 0]}><Carousel reduce={reduce} /></group>;
  if (v === "c") return <group scale={wide ? 0.95 : 0.7} position={[wide ? 2.4 : 0, wide ? 0 : -1.4, 0]}><Chrome reduce={reduce} /></group>;
  if (v === "d") return <group scale={wide ? 0.78 : 0.55} position={[0, wide ? -1.55 : -2.1, 0]}><DarkMap reduce={reduce} /></group>;
  return <group scale={wide ? 0.88 : 0.55} position={[wide ? 1.7 : -0.2, wide ? 0.1 : -1.7, 0]}><Showcase reduce={reduce} /></group>;
}

export default function ShowScene() {
  const v = new URLSearchParams(window.location.search).get("v") ?? "a";
  const reduce = useMemo(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, []);
  const dark = v === "d";
  return (
    <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 9.5], fov: 36 }} dpr={[1, 1.75]} eventSource={document.body} eventPrefix="client" aria-hidden>
      <ambientLight intensity={dark ? 0.5 : 1.3} />
      <directionalLight position={[4, 6, 6]} intensity={dark ? 1.2 : 1.8} />
      <Environment resolution={256}>
        {!dark && <color attach="background" args={[v === "c" ? "#c9d3e6" : "#e9eef7"]} />}
        <Lightformer form="rect" intensity={v === "c" ? 5 : 2.5} position={[0, 6, 3]} scale={[14, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={v === "c" ? 4 : 1.2} position={[-6, 1, 2]} scale={[3, 9, 1]} color={v === "c" ? "#6fa8ff" : "#eef3ff"} />
        <Lightformer form="rect" intensity={v === "c" ? 3.5 : 1.2} position={[6, 0, 2]} scale={[3, 9, 1]} color={v === "c" ? "#ffd7a8" : "#ffffff"} />
        <Lightformer form="ring" intensity={v === "c" ? 3 : 0} position={[0, -3, 4]} scale={5} color="#ffffff" />
      </Environment>
      {dark && <Sparkles count={90} scale={[14, 7, 6]} size={2.4} speed={0.25} color="#7fc4ff" opacity={0.7} />}
      <Rig v={v} reduce={reduce} />
    </Canvas>
  );
}

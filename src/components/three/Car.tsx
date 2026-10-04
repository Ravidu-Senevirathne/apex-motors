"use client";
import * as THREE from "three";
import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { carStore, PAINTS, RIMS } from "@/lib/store";

/* ---------- Procedural geometry (no external model needed) ---------- */

function makeBody() {
  const s = new THREE.Shape();
  s.moveTo(2.2, 0.32);
  s.lineTo(1.9, 0.32);
  s.absarc(1.4, 0.38, 0.5, -0.12, Math.PI + 0.12, false); // front arch
  s.lineTo(-0.9, 0.32);
  s.absarc(-1.4, 0.38, 0.5, -0.12, Math.PI + 0.12, false); // rear arch
  s.lineTo(-2.2, 0.32);
  s.quadraticCurveTo(-2.34, 0.34, -2.3, 0.62);
  s.lineTo(-2.22, 0.92);
  s.quadraticCurveTo(-2.16, 1.05, -1.9, 1.04); // ducktail lip
  s.lineTo(-1.4, 1.0);
  s.lineTo(0.9, 0.97);
  s.bezierCurveTo(1.55, 0.94, 2.05, 0.82, 2.3, 0.62); // long sloping hood
  s.quadraticCurveTo(2.38, 0.36, 2.2, 0.32);

  const depth = 1.5;
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.12,
    bevelSegments: 12,
    curveSegments: 48,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

function makeGlass() {
  const s = new THREE.Shape();
  s.moveTo(-1.55, 0.98);
  s.bezierCurveTo(-1.15, 1.12, -0.8, 1.44, -0.25, 1.46);
  s.lineTo(0.15, 1.46);
  s.bezierCurveTo(0.6, 1.44, 0.95, 1.14, 1.35, 0.96);
  s.lineTo(-1.55, 0.98);
  const depth = 1.1;
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.08,
    bevelSegments: 10,
    curveSegments: 40,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/* ---------- Wheel ---------- */

const Wheel = forwardRef<
  THREE.Group,
  { position: [number, number, number]; side: 1 | -1; rimMat: THREE.Material; caliper: THREE.Material }
>(function Wheel({ position, side, rimMat, caliper }, ref) {
  const spokes = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), []);
  return (
    <group position={position}>
      {/* caliper sits still while the wheel spins */}
      <mesh position={[0.12, 0.12, side * 0.06]} rotation={[0, 0, 0.6]} material={caliper}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
      </mesh>
      <group ref={ref}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          {/* tyre */}
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 48]} />
            <meshStandardMaterial color="#0b0b0c" roughness={0.85} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.35, 0.07, 16, 48]} />
            <meshStandardMaterial color="#0b0b0c" roughness={0.85} />
          </mesh>
          {/* rim barrel & face */}
          <mesh position={[0, side * 0.152, 0]} material={rimMat}>
            <cylinderGeometry args={[0.29, 0.29, 0.01, 48]} />
          </mesh>
          <mesh position={[0, side * 0.16, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.012, 48]} />
            <meshStandardMaterial color="#050505" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* brake disc */}
          <mesh position={[0, side * 0.08, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.02, 40]} />
            <meshStandardMaterial color="#555" metalness={1} roughness={0.35} />
          </mesh>
          {/* spokes */}
          {spokes.map((a) => (
            <mesh
              key={a}
              material={rimMat}
              position={[Math.cos(a) * 0.13, side * 0.17, Math.sin(a) * 0.13]}
              rotation={[0, -a, 0]}
            >
              <boxGeometry args={[0.26, 0.025, 0.035]} />
            </mesh>
          ))}
          <mesh position={[0, side * 0.18, 0]} material={rimMat}>
            <cylinderGeometry args={[0.055, 0.055, 0.03, 24]} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

/* ---------- Car ---------- */

export default function Car(props: React.JSX.IntrinsicElements["group"]) {
  const body = useMemo(makeBody, []);
  const glass = useMemo(makeGlass, []);

  const paint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: PAINTS[0].hex,
        metalness: 0.55,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.4,
      }),
    []
  );
  const rimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: RIMS[0].hex, metalness: 1, roughness: 0.18 }),
    []
  );
  const caliper = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c6ff3d", emissive: "#5a7a00", roughness: 0.3 }),
    []
  );
  const trim = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0a0b", roughness: 0.45, metalness: 0.3 }), []);
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#05070a",
        metalness: 0.9,
        roughness: 0.04,
        clearcoat: 1,
        envMapIntensity: 1,
      }),
    []
  );

  const wheels = useRef<(THREE.Group | null)[]>([]);
  const lastScroll = useRef(0);
  const spin = useRef(0);
  const targetPaint = useRef(new THREE.Color());
  const targetRim = useRef(new THREE.Color());

  useFrame((_, dt) => {
    const { paint: p, rim: r } = carStore.get();
    targetPaint.current.set(PAINTS[p].hex);
    targetRim.current.set(RIMS[r].hex);
    paint.color.lerp(targetPaint.current, 1 - Math.pow(0.002, dt));
    rimMat.color.lerp(targetRim.current, 1 - Math.pow(0.002, dt));

    // wheels spin with scroll velocity
    const y = typeof window !== "undefined" ? window.scrollY : 0;
    const v = y - lastScroll.current;
    lastScroll.current = y;
    spin.current = THREE.MathUtils.damp(spin.current, v * 0.02, 6, dt);
    wheels.current.forEach((w) => w && (w.rotation.z -= spin.current + dt * 0.4));
  });

  const W: [number, number, number][] = [
    [1.4, 0.4, 0.84],
    [1.4, 0.4, -0.84],
    [-1.4, 0.4, 0.84],
    [-1.4, 0.4, -0.84],
  ];

  return (
    <group {...props}>
      <mesh geometry={body} material={paint} castShadow />
      <mesh geometry={glass} material={glassMat} />

      {/* front splitter, side skirts, diffuser */}
      <mesh position={[2.22, 0.3, 0]} material={trim}>
        <boxGeometry args={[0.38, 0.05, 1.7]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={trim}>
        <boxGeometry args={[1.7, 0.08, 1.9]} />
      </mesh>
      <mesh position={[-2.25, 0.34, 0]} material={trim}>
        <boxGeometry args={[0.3, 0.12, 1.5]} />
      </mesh>
      {/* front intake */}
      <mesh position={[2.34, 0.44, 0]} rotation={[0, 0, -0.35]} material={trim}>
        <boxGeometry args={[0.04, 0.14, 1.1]} />
      </mesh>

      {/* headlights */}
      {[0.58, -0.58].map((z) => (
        <mesh key={z} position={[2.38, 0.66, z]} rotation={[0, 0, -0.75]}>
          <boxGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#d8f6ff" emissive="#bff2ff" emissiveIntensity={6} toneMapped={false} />
        </mesh>
      ))}
      {/* full-width rear light bar */}
      <mesh position={[-2.37, 0.82, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.05, 0.05, 1.76]} />
        <meshStandardMaterial color="#ff1530" emissive="#ff0a22" emissiveIntensity={7} toneMapped={false} />
      </mesh>

      {/* mirrors */}
      {[0.82, -0.82].map((z) => (
        <mesh key={z} position={[0.85, 1.05, z]} material={paint}>
          <boxGeometry args={[0.16, 0.08, 0.14]} />
        </mesh>
      ))}

      {W.map((p, i) => (
        <Wheel
          key={i}
          ref={(el) => {
            wheels.current[i] = el;
          }}
          position={p}
          side={p[2] > 0 ? 1 : -1}
          rimMat={rimMat}
          caliper={caliper}
        />
      ))}
    </group>
  );
}

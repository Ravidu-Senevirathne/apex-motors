"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import Car from "./Car";

type Key = { cam: [number, number, number]; target: [number, number, number]; carX: number; rotY: number };

// One keyframe per scroll "screen": hero → engineering → configurator
const KEYS: Key[] = [
  { cam: [6.4, 1.6, 7.6], target: [0, 0.9, 0], carX: 0.4, rotY: 0 },
  { cam: [0, 1.2, 11.5], target: [0, 0.75, 0], carX: 2.3, rotY: 0 },
  { cam: [0, 2, 9.5], target: [0, 0.6, 0], carX: -2, rotY: -0.9 },
];

const ease = (t: number) => t * t * (3 - 2 * t);
const v3 = new THREE.Vector3();
const look = new THREE.Vector3();
const curLook = new THREE.Vector3(0, 0.65, 0);

function Rig() {
  const car = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), KEYS.length - 1);
    const i = Math.min(Math.floor(p), KEYS.length - 2);
    const t = ease(p - i);
    const a = KEYS[i];
    const b = KEYS[i + 1];
    const mobile = size.width < 768;
    const zoom = mobile ? 2.1 : 1;

    v3.set(...a.cam).lerp(new THREE.Vector3(...b.cam), t).multiplyScalar(zoom);
    v3.x += mouse.current.x * 0.6;
    v3.y += -mouse.current.y * 0.25;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, v3.x, 3, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, v3.y, 3, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, v3.z, 3, dt);
    look.set(...a.target).lerp(new THREE.Vector3(...b.target), t);
    curLook.lerp(look, 1 - Math.pow(0.02, dt));
    state.camera.lookAt(curLook);

    if (car.current) {
      const heroWeight = Math.max(0, 1 - p);
      const x = THREE.MathUtils.lerp(a.carX, b.carX, t) * (mobile ? 0 : 1);
      const ry = THREE.MathUtils.lerp(a.rotY, b.rotY, t) + Math.sin(state.clock.elapsedTime * 0.35) * 0.35 * heroWeight;
      car.current.position.x = THREE.MathUtils.damp(car.current.position.x, x, 4, dt);
      car.current.rotation.y = THREE.MathUtils.damp(car.current.rotation.y, ry, 4, dt);
    }
  });

  return (
    <group ref={car}>
      <Car />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.8} scale={7} blur={2.2} far={1.6} resolution={512} />
    </group>
  );
}

export default function Scene() {
  // stop rendering once the opaque sections cover the canvas (saves battery/GPU)
  const [active, setActive] = useState(true);
  useEffect(() => {
    const onScroll = () => setActive(window.scrollY < window.innerHeight * 3.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [5.4, 1.8, 6.4], fov: 32 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 10, 24]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[0, 9, 2]} angle={0.45} penumbra={1} intensity={80} decay={1.6} color="#ffffff" />
      <spotLight position={[-6, 3, -4]} angle={0.6} penumbra={1} intensity={12} color="#c6ff3d" />
      <spotLight position={[6, 2, -5]} angle={0.6} penumbra={1} intensity={18} color="#3dd8ff" />

      <Rig />

      {/* glossy studio floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.001}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[400, 120]}
          resolution={1024}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#08080b"
          metalness={0.6}
          mirror={0}
        />
      </mesh>

      {/* studio light rig baked into an env map — reflections on the clear-coat */}
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 1.2, 1]} />
        <Lightformer form="rect" intensity={2} position={[0, 6, -3]} rotation-x={Math.PI / 2} scale={[12, 0.6, 1]} />
        <Lightformer form="rect" intensity={2} position={[0, 6, 3]} rotation-x={Math.PI / 2} scale={[12, 0.6, 1]} />
        <Lightformer form="rect" intensity={4} position={[-8, 2, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={4} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="ring" color="#c6ff3d" intensity={1.2} position={[-4, 3, -6]} scale={3} />
        <Lightformer form="ring" color="#3dd8ff" intensity={1.2} position={[5, 3, -6]} scale={3} />
      </Environment>

      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1.2} intensity={0.9} radius={0.7} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}

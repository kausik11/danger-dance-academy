"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  PerspectiveCamera,
  PresentationControls,
  Sparkles,
  Torus,
} from "@react-three/drei";
import type { Mesh } from "three";
import { motion } from "framer-motion";

function EnergyCore() {
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.x = elapsed * 0.18;
      coreRef.current.rotation.y = elapsed * 0.35;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = elapsed * 0.2;
      ringRef.current.rotation.y = elapsed * 0.28;
      ringRef.current.rotation.z = elapsed * 0.12;
    }
  });

  return (
    <PresentationControls
      global
      rotation={[0.18, 0, 0]}
      polar={[-0.45, 0.35]}
      azimuth={[-0.9, 0.9]}
      snap
    >
      <Float speed={2.4} rotationIntensity={1.15} floatIntensity={1.6}>
        <mesh ref={coreRef} castShadow receiveShadow>
          <icosahedronGeometry args={[1.5, 20]} />
          <MeshDistortMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.65}
            distort={0.45}
            speed={2.2}
            metalness={0.72}
            roughness={0.08}
          />
        </mesh>

        <Torus ref={ringRef} args={[2.35, 0.05, 32, 200]} rotation={[1.2, 0, 0.2]}>
          <meshStandardMaterial
            color="#dbeafe"
            emissive="#60a5fa"
            emissiveIntensity={1.6}
            metalness={0.9}
            roughness={0.14}
          />
        </Torus>
      </Float>

      <Sparkles
        count={120}
        scale={6.8}
        size={3}
        speed={0.55}
        color="#93c5fd"
      />
    </PresentationControls>
  );
}

function SceneFallback() {
  return (
    <div className="flex h-[30rem] items-center justify-center rounded-[32px] border border-white/10 bg-[radial-gradient(circle,_rgba(139,92,246,0.36),_rgba(15,23,42,0.95)_58%)]">
      <div className="h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.95),_rgba(129,140,248,0.7)_44%,_rgba(8,15,30,0)_72%)] blur-xl" />
    </div>
  );
}

export function ThreeScene() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
            3D Experience
          </p>
          <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
            A motion core that reacts to drag and floats like stage energy.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-300/[0.82]">
            This premium section uses React Three Fiber to add a lightweight interactive visual. Drag to rotate, watch it hover in space, and use it as a base for a dancer model later if you want to upgrade.
          </p>

          <div className="mt-8 grid gap-4">
            {[
              "Interactive drag controls with smooth spring motion",
              "Glow-driven abstract form as a fast fallback to a dancer model",
              "Lightweight sparkles and floating animation for stage atmosphere",
            ].map((item) => (
              <div
                key={item}
                className="glass-panel rounded-[24px] px-5 py-4 text-sm leading-7 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="glass-panel overflow-hidden rounded-[36px] p-3"
        >
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.95)_52%)]">
            <Suspense fallback={<SceneFallback />}>
              <Canvas shadows dpr={[1, 1.8]} className="h-[30rem] w-full">
                <color attach="background" args={["#030712"]} />
                <fog attach="fog" args={["#030712", 7, 14]} />
                <PerspectiveCamera makeDefault position={[0, 0, 7.6]} fov={42} />
                <ambientLight intensity={0.9} />
                <directionalLight
                  position={[4, 5, 3]}
                  intensity={2.1}
                  color="#c4b5fd"
                  castShadow
                />
                <pointLight position={[-3, -1, 4]} intensity={24} color="#38bdf8" />
                <pointLight position={[2, 1, -2]} intensity={12} color="#f472b6" />
                <EnergyCore />
              </Canvas>
            </Suspense>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

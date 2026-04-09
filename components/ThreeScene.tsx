"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  PerspectiveCamera,
  PresentationControls,
  Sparkles,
  Torus,
} from "@react-three/drei";
import { PCFShadowMap } from "three";
import type { Mesh } from "three";
import { motion } from "framer-motion";
import {
  listContainerVariants,
  listItemVariants,
  sectionBodyVariants,
  sectionContentVariants,
  sectionHeadingVariants,
  sectionMediaVariants,
  sectionViewport,
} from "@/lib/animationVariants";

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
    <div className="relative flex h-[20rem] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.24),rgba(8,15,30,0.88)_54%),linear-gradient(180deg,rgba(4,8,24,0.1)_0%,rgba(2,6,23,0.82)_100%)] sm:h-[24rem] sm:rounded-[32px] lg:h-[30rem]">
      <div className="h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.95),_rgba(129,140,248,0.7)_44%,_rgba(8,15,30,0)_72%)] blur-xl sm:h-40 sm:w-40" />
    </div>
  );
}

export function ThreeScene() {
  const [shouldRenderCanvas, setShouldRenderCanvas] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const syncCanvasAvailability = () => {
      setShouldRenderCanvas(mediaQuery.matches);
    };

    syncCanvasAvailability();
    mediaQuery.addEventListener("change", syncCanvasAvailability);

    return () => {
      mediaQuery.removeEventListener("change", syncCanvasAvailability);
    };
  }, []);

  return (
    <section
      id="experience"
      className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={sectionContentVariants}
        className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[0.92fr_1.08fr]"
      >
        <motion.div
          variants={sectionContentVariants}
        >
          <motion.p
            variants={sectionHeadingVariants}
            className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70"
          >
            3D Experience
          </motion.p>
          <motion.h2
            variants={sectionHeadingVariants}
            className="mt-4 font-display text-3xl text-white sm:text-5xl"
          >
            A motion core that reacts to drag and floats like stage energy.
          </motion.h2>
          <motion.p
            variants={sectionBodyVariants}
            className="mt-6 max-w-xl text-base leading-8 text-slate-300/[0.82]"
          >
            This premium section uses React Three Fiber to add a lightweight interactive visual. Drag to rotate, watch it hover in space, and use it as a base for a dancer model later if you want to upgrade.
          </motion.p>

          <motion.div variants={listContainerVariants} className="mt-8 grid gap-4">
            {[
              "Interactive drag controls with smooth spring motion",
              "Glow-driven abstract form as a fast fallback to a dancer model",
              "Lightweight sparkles and floating animation for stage atmosphere",
            ].map((item) => (
              <motion.div
                key={item}
                variants={listItemVariants}
                className="glass-panel rounded-[24px] px-4 py-4 text-sm leading-7 text-slate-200 sm:px-5"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={sectionMediaVariants}
          className="glass-panel overflow-hidden rounded-[28px] p-2 will-change-transform sm:rounded-[36px] sm:p-3"
        >
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),rgba(2,6,23,0.9)_54%),linear-gradient(180deg,rgba(8,15,30,0.1)_0%,rgba(2,6,23,0.8)_100%)] sm:rounded-[30px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(224,242,254,0.08),transparent_18%),radial-gradient(circle_at_82%_24%,rgba(129,140,248,0.12),transparent_20%)]" />
            {shouldRenderCanvas ? (
              <Suspense fallback={<SceneFallback />}>
                <Canvas
                  gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                  shadows={{ type: PCFShadowMap }}
                  dpr={[1, 1.5]}
                  className="relative z-10 h-[20rem] w-full sm:h-[24rem] lg:h-[30rem]"
                >
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
            ) : (
              <SceneFallback />
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

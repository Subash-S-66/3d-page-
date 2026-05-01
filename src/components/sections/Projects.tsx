"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const PROJECT_DATA = [
  { id: 1, title: "NEURAL CORE", tech: "WebGL / React", position: [-4, 2, 0] },
  { id: 2, title: "SYNTHESIS", tech: "Three.js / GLSL", position: [4, 1, -2] },
  { id: 3, title: "VOID OS", tech: "Next.js / Tailwind", position: [-2, -2, -1] },
  { id: 4, title: "QUANTUM", tech: "WebGPU / Rust", position: [3, -3, -3] },
];

function TumblingCard({ title, tech, position }: { title: string, tech: string, position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [rotationSpeed] = useState(() => ({
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.01,
    z: (Math.random() - 0.5) * 0.01,
  }));

  useFrame(() => {
    if (groupRef.current && !hovered) {
      groupRef.current.rotation.x += rotationSpeed.x;
      groupRef.current.rotation.y += rotationSpeed.y;
      groupRef.current.rotation.z += rotationSpeed.z;
    } else if (groupRef.current && hovered) {
      // Smoothly rotate to face camera on hover
      groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.1;
      groupRef.current.rotation.z += (0 - groupRef.current.rotation.z) * 0.1;
      groupRef.current.position.z += (2 - groupRef.current.position.z) * 0.1;
    }
    if (groupRef.current && !hovered) {
        groupRef.current.position.z += (position[2] - groupRef.current.position.z) * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={new THREE.Vector3(...position)}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'none'; }}
    >
      <mesh>
        <planeGeometry args={[4, 2.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Html
        transform
        occlude
        className={twMerge(
          clsx(
            "w-96 h-60 border border-white/10 bg-surface backdrop-blur-md rounded-lg p-6 flex flex-col justify-between transition-all duration-500",
            hovered && "border-accent2/50 shadow-[0_0_30px_rgba(255,107,107,0.2)] bg-black/80"
          )
        )}
      >
        <div>
          <h3 className="text-3xl font-display font-bold text-white mb-2">{title}</h3>
          <p className="text-accent2 font-mono text-sm">{tech}</p>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-xs text-white/50 font-mono flex gap-2">
            <span className={hovered ? "text-accent2" : ""}>[VIEW]</span>
            <span>[GITHUB]</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
            ↗
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function Projects() {
  return (
    <section className="relative w-full h-[200vh] flex flex-col items-center pointer-events-none z-10">
      <div className="absolute top-20 left-10 pointer-events-none z-20">
        <h2 className="text-8xl font-display font-bold text-accent2 tracking-widest text-shadow-glow-accent2">PROJECTS</h2>
      </div>
      <div className="w-full h-screen sticky top-0 absolute inset-0 -z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          {PROJECT_DATA.map((project) => (
            <TumblingCard
              key={project.id}
              title={project.title}
              tech={project.tech}
              position={project.position as [number, number, number]}
            />
          ))}
        </Canvas>
      </div>
    </section>
  );
}
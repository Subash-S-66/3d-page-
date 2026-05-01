"use client";

import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useSphere, usePlane, PlaneProps, SphereProps } from "@react-three/cannon";
import * as THREE from "three";
import { Html } from "@react-three/drei";

function Floor() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -5, 0] } as PlaneProps));
  return (
    <mesh ref={ref as React.Ref<THREE.Mesh>}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

function Boundaries() {
  usePlane(() => ({ rotation: [0, Math.PI / 2, 0], position: [-10, 0, 0] }));
  usePlane(() => ({ rotation: [0, -Math.PI / 2, 0], position: [10, 0, 0] }));
  usePlane(() => ({ rotation: [Math.PI / 2, 0, 0], position: [0, 10, 0] }));
  usePlane(() => ({ rotation: [0, 0, 0], position: [0, 0, -10] }));
  usePlane(() => ({ rotation: [0, Math.PI, 0], position: [0, 0, 10] }));
  return null;
}

const SKILLS = [
  { name: "React", color: "#6EE7F7" },
  { name: "Next.js", color: "#6EE7F7" },
  { name: "Three.js", color: "#A855F7" },
  { name: "WebGL", color: "#A855F7" },
  { name: "TypeScript", color: "#6EE7F7" },
  { name: "Node.js", color: "#F7931E" },
  { name: "Python", color: "#F7931E" },
  { name: "GLSL", color: "#A855F7" },
];

function Orb({ position, color, name }: { position: [number, number, number], color: string, name: string }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position,
    args: [1],
    linearDamping: 0.1,
    angularDamping: 0.1
  } as SphereProps));

  const [hovered, setHovered] = useState(false);

  // Apply some random floating force
  useFrame(() => {
    if (Math.random() > 0.95) {
      api.applyImpulse([
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2 + 1, // slight upward tendency
        (Math.random() - 0.5) * 2
      ], [0, 0, 0]);
    }
  });

  return (
    <mesh
      ref={ref as React.Ref<THREE.Mesh>}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => {
        e.stopPropagation();
        api.applyImpulse([0, 10, 0], [0, 0, 0]);
      }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={hovered ? 0.8 : 0.2}
      />
      {hovered && (
        <Html center pointerEvents="none">
          <div className="text-white font-mono text-sm bg-primary/80 px-2 py-1 border border-white/20 whitespace-nowrap">
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function Skills() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm pointer-events-none" />
      <h2 className="text-8xl font-display font-bold text-accent1 mb-10 tracking-widest text-shadow-glow relative z-20">SKILLS</h2>
      <div className="w-full h-full absolute inset-0 z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Physics gravity={[0, -2, 0]}>
            <Floor />
            <Boundaries />
            {SKILLS.map((skill, i) => (
              <Orb
                key={i}
                position={[(Math.random() - 0.5) * 10, Math.random() * 5, (Math.random() - 0.5) * 5]}
                color={skill.color}
                name={skill.name}
              />
            ))}
          </Physics>
        </Canvas>
      </div>
    </section>
  );
}
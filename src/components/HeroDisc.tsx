"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Html } from "@react-three/drei";

const SECTIONS = [
  "Skills & Tech",
  "Projects",
  "Experience",
  "Education",
  "Open Source",
  "Awards",
  "Philosophy",
  "Contact"
];

function Slice({ index, angle, total, label, isExploded }: { index: number, angle: number, total: number, label: string, isExploded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random explosion target vector based on index
  const [explodeTarget] = useState(() => {
    const vector = new THREE.Vector3(
      Math.cos(angle) * 10,
      (Math.random() - 0.5) * 10,
      Math.sin(angle) * 10
    );
    return vector;
  });

  const [explodeRotation] = useState(() => {
    return new THREE.Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
  });

  useFrame(() => {
    if (!meshRef.current) return;

    if (isExploded) {
      // Explode outwards and rotate randomly
      meshRef.current.position.lerp(explodeTarget, 0.05);

      meshRef.current.rotation.x += (explodeRotation.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (explodeRotation.y - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.z += (explodeRotation.z - meshRef.current.rotation.z) * 0.05;
    } else {
      // Return to normal
      meshRef.current.position.lerp(new THREE.Vector3(0, hovered ? 0.5 : 0, 0), 0.1);

      meshRef.current.rotation.x += (0 - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.y += (0 - meshRef.current.rotation.y) * 0.1;
      meshRef.current.rotation.z += (0 - meshRef.current.rotation.z) * 0.1;
    }
  });

  return (
    <group rotation={[0, angle, 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'none'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        onClick={(e) => { e.stopPropagation(); console.log(`Clicked ${label}`); }}
      >
        <cylinderGeometry args={[4, 4, 0.5, 32, 1, false, 0, (Math.PI * 2) / total]} />
        <meshStandardMaterial
          color={hovered ? "#FF6B6B" : new THREE.Color().setHSL(index / total, 0.8, 0.5)}
          roughness={0.2}
          metalness={0.8}
          emissive={hovered ? "#FF6B6B" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        {hovered && (
          <Html position={[2, 1, 1]} center pointerEvents="none">
            <div className="text-white font-display text-2xl font-bold whitespace-nowrap text-shadow-glow pointer-events-none uppercase tracking-widest bg-primary/50 backdrop-blur-md px-4 py-2 border border-white/10">
              {label}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

export default function HeroDisc() {
  const groupRef = useRef<THREE.Group>(null);
  const [isExploded, setIsExploded] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsExploded((prev) => !prev);
    }, 1000); // 1 second long press to explode/unexplode
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };

  return (
    <div
      className="w-full h-screen relative flex items-center justify-center"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6EE7F7" />

        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <group ref={groupRef} rotation={[Math.PI / 6, 0, 0]}>
             {SECTIONS.map((label, index) => {
               const angle = (index * Math.PI * 2) / SECTIONS.length;
               return (
                 <Slice
                   key={index}
                   index={index}
                   angle={angle}
                   total={SECTIONS.length}
                   label={label}
                   isExploded={isExploded}
                 />
               );
             })}
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
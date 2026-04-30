"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  { id: 1, title: 'Quantum Engine', tech: 'WebGL, Rust, Wasm' },
  { id: 2, title: 'Neural Net UI', tech: 'React, PyTorch, GSAP' },
  { id: 3, title: 'Crypto Void', tech: 'Next.js, Solidity, Framer' },
];

function ProjectCard({ data, position, delay }: { data: { title: string, tech: string }, position: [number, number, number], delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      if (!hovered) {
        // Tumbling idle animation
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.2;
        groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3 + delay) * 0.2;
        // Float back to original position
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 0.05);
      } else {
        // Fly toward camera and flatten
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 2, 0.1);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <mesh>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial
          color={hovered ? '#1A1A24' : '#0A0A0F'}
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Neon border effect */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[4.05, 2.55]} />
        <meshBasicMaterial color="#FF6B6B" transparent opacity={hovered ? 0.8 : 0.2} />
      </mesh>

      <Html
        position={[0, 0, 0.1]}
        center
        transform
        style={{ pointerEvents: 'none', width: '380px' }}
      >
        <div className={`p-6 border border-white/10 rounded-lg backdrop-blur-md transition-all duration-300 ${hovered ? 'bg-white/5' : 'bg-transparent'}`}>
          <h3 className="text-3xl font-display font-bold text-white glow-text-accent2 mb-2">{data.title}</h3>
          <p className="font-mono text-accent2/80 text-sm">{data.tech}</p>
        </div>
      </Html>
    </group>
  );
}

export default function Projects({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Matrix Code Rain Background (Simplified with CSS for performance) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="w-full h-[200%] bg-[url('https://raw.githubusercontent.com/jules/matrix-bg/main/matrix.png')] animate-[matrix_20s_linear_infinite]" />
      </div>

      <div className="absolute top-20 right-20 z-30 pointer-events-auto text-right">
        <h1 className="text-8xl font-display font-bold text-white glow-text-accent2">Projects</h1>
        <p className="text-xl font-body text-white/70 mt-4 max-w-md ml-auto">Debris in orbit. Hover to inspect.</p>
      </div>

      <div className="w-full h-full pointer-events-auto relative z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {PROJECTS.map((proj, i) => (
            <ProjectCard
              key={proj.id}
              data={proj}
              position={[(i - 1) * 5, (i % 2 === 0 ? 1 : -1) * 1.5, -2 - (i * 0.5)]}
              delay={i}
            />
          ))}
        </Canvas>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes matrix {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

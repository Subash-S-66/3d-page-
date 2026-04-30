"use client";

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, useSphere } from '@react-three/cannon';

const SKILLS = [
  { id: 1, name: 'React', color: '#6EE7F7', category: 'Frontend' },
  { id: 2, name: 'Three.js', color: '#6EE7F7', category: 'Frontend' },
  { id: 3, name: 'Node.js', color: '#A855F7', category: 'Backend' },
  { id: 4, name: 'Python', color: '#A855F7', category: 'Backend' },
  { id: 5, name: 'Docker', color: '#F7931E', category: 'DevOps' },
  { id: 6, name: 'AWS', color: '#F7931E', category: 'DevOps' },
  { id: 7, name: 'PyTorch', color: '#FF6B6B', category: 'AI/ML' },
  { id: 8, name: 'TypeScript', color: '#6EE7F7', category: 'Frontend' }
];

function SkillOrb({ data, position }: { data: { name: string, color: string }, position: [number, number, number] }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position,
    args: [0.5],
    material: { restitution: 0.9 }
  }));
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      // @ts-expect-error type mismatches with cannon and fiber refs
      ref={ref}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#ffffff' : data.color}
        emissive={data.color}
        emissiveIntensity={hovered ? 0.8 : 0.2}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
}

function Boundaries() {
  return (
    <group>
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

export default function Skills({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Title */}
      <div className="absolute top-20 left-20 z-30 pointer-events-auto">
        <h1 className="text-8xl font-display font-bold text-white glow-text">Skills</h1>
        <p className="text-xl font-body text-white/70 mt-4 max-w-md">Physics-enabled skill orbs orbiting the core. Hover to interact.</p>
      </div>

      <div className="w-full h-full pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <Physics gravity={[0, 0, 0]}>
            <Boundaries />
            {SKILLS.map((skill) => (
              <SkillOrb
                key={skill.id}
                data={skill}
                position={[
                  (Math.random() - 0.5) * 5,
                  (Math.random() - 0.5) * 5,
                  (Math.random() - 0.5) * 2
                ]}
              />
            ))}
          </Physics>
        </Canvas>
      </div>
    </div>
  );
}

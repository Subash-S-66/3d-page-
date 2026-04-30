"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const EXP_DATA = [
  { id: 1, role: 'Senior UX Engineer', company: 'CyberDyne Systems', year: '2075-2080', color: '#A855F7' },
  { id: 2, role: 'WebGL Developer', company: 'Tyrell Corp', year: '2070-2075', color: '#6EE7F7' },
  { id: 3, role: 'Frontend Intern', company: 'Stark Industries', year: '2068-2070', color: '#F7931E' },
];

function TrackNode({ data, position }: { data: { role: string, company: string, year: string, color: string }, position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.2, 16, 32]} />
        <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.5} />
      </mesh>

      <Html position={[2, 0, 0]} center transform style={{ width: '300px', pointerEvents: 'none' }}>
        <div className="p-4 bg-background/80 border border-white/10 rounded backdrop-blur-sm">
          <h4 className="text-xl font-display font-bold text-white mb-1">{data.role}</h4>
          <p className="font-mono text-sm text-accent3">{data.company} - {data.year}</p>
        </div>
      </Html>
    </group>
  );
}

export default function Experience({ isActive }: { isActive: boolean }) {
  const cameraGroupRef = useRef<THREE.Group>(null);

  // Create a curved track path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(-5, 2, 0),
      new THREE.Vector3(5, -2, -10),
      new THREE.Vector3(0, 0, -20),
    ]);
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="absolute bottom-20 left-20 z-30 pointer-events-auto">
        <h1 className="text-8xl font-display font-bold text-white glow-text" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>Experience</h1>
        <p className="text-xl font-body text-white/70 mt-4 max-w-md">The rollercoaster of my career timeline.</p>
      </div>

      <div className="w-full h-full pointer-events-auto relative z-10">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />

          {/* Render the glowing track */}
          <mesh>
            <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
            <meshBasicMaterial color="#A855F7" transparent opacity={0.3} />
          </mesh>

          <TrackNode data={EXP_DATA[0]} position={[-5, 2, 0]} />
          <TrackNode data={EXP_DATA[1]} position={[5, -2, -10]} />
          <TrackNode data={EXP_DATA[2]} position={[0, 0, -20]} />

          {/* Simulate camera flying along track - simplified with slow rotation for now */}
          <group ref={cameraGroupRef}>
            <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
          </group>
        </Canvas>
      </div>
    </div>
  );
}

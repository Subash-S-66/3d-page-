"use client";

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function TerminalHologram({ isSubmitted, onTyping, onSubmit }: { isSubmitted: boolean, onTyping: (text: string) => void, onSubmit: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !isSubmitted) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial
          color="#001122"
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Glow aura */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4.2, 3.2]} />
        <meshBasicMaterial color="#F7931E" transparent opacity={0.3} />
      </mesh>

      <Html position={[0, 0, 0.1]} center transform style={{ width: '380px' }}>
        <div className="p-6 h-[280px] flex flex-col justify-between font-mono terminal-screen text-accent4">
          <style dangerouslySetInnerHTML={{__html: `
            .terminal-screen {
              background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
              );
            }
          `}} />
          {isSubmitted ? (
            <div className="h-full flex items-center justify-center text-2xl animate-pulse">
              TRANSMISSION SENT //
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl mb-4 border-b border-accent4/30 pb-2">ESTABLISH UPLINK</h3>
                <textarea
                  className="w-full h-24 bg-transparent border-none outline-none resize-none text-accent4 placeholder-accent4/50 focus:ring-0"
                  placeholder="Enter message coordinates..."
                  onChange={(e) => onTyping(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 border border-accent4 hover:bg-accent4 hover:text-black transition-colors"
              >
                INITIATE LAUNCH
              </button>
            </form>
          )}
        </div>
      </Html>
    </group>
  );
}

function Rocket({ isSubmitted }: { isSubmitted: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      if (isSubmitted) {
        // Launch animation
        groupRef.current.position.y += 0.2;
        groupRef.current.rotation.y += 0.1;
      } else {
        groupRef.current.position.y = -2;
      }
    }
  });

  if (!isSubmitted) return null;

  return (
    <group ref={groupRef}>
      <mesh>
        <coneGeometry args={[0.5, 2, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#F7931E" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function Contact({ isActive }: { isActive: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isActive) return null;

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000); // Reset after 3s
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="w-full h-full pointer-events-auto relative z-10 flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <TerminalHologram isSubmitted={isSubmitted} onTyping={() => {}} onSubmit={handleSubmit} />
          <Rocket isSubmitted={isSubmitted} />
        </Canvas>
      </div>

      <div className="absolute bottom-20 right-20 z-30 pointer-events-auto text-right">
        <h1 className="text-8xl font-display font-bold text-white glow-text" style={{ textShadow: '0 0 10px rgba(247, 147, 30, 0.5)' }}>Contact</h1>
        <p className="text-xl font-body text-white/70 mt-4 max-w-md ml-auto">Establish an uplink.</p>
      </div>
    </div>
  );
}

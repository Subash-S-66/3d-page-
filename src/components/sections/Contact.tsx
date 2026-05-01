"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function HolographicTerminal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Animate rocket launch away
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: 20,
        x: 10,
        duration: 2,
        ease: "power3.in",
      });
      gsap.to(meshRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 2,
      });
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {/* Holographic screen backing */}
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial color="#0A0A0F" transparent opacity={0.6} side={THREE.DoubleSide} />

        {/* Border glow */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(8, 6)]} />
          <lineBasicMaterial color="#F7931E" transparent opacity={0.8} />
        </lineSegments>

        <Html transform position={[0, 0, 0.1]} distanceFactor={5} zIndexRange={[100, 0]}>
          <div className="w-[800px] h-[600px] bg-transparent border border-accent4/30 p-10 font-mono text-accent4 shadow-[0_0_50px_rgba(247,147,30,0.1)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent4/50 animate-pulse" />
            <h3 className="text-4xl mb-8 border-b border-accent4/30 pb-4 tracking-widest">[ INCOMING TRANSMISSION ]</h3>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm opacity-80">&gt; IDENTIFICATION</label>
                  <input
                    type="text"
                    required
                    className="bg-black/50 border border-accent4/50 p-3 text-white outline-none focus:border-white focus:bg-accent4/10 transition-colors"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm opacity-80">&gt; FREQUENCY (EMAIL)</label>
                  <input
                    type="email"
                    required
                    className="bg-black/50 border border-accent4/50 p-3 text-white outline-none focus:border-white focus:bg-accent4/10 transition-colors"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm opacity-80">&gt; DATA PAYLOAD</label>
                  <textarea
                    rows={4}
                    required
                    className="bg-black/50 border border-accent4/50 p-3 text-white outline-none focus:border-white focus:bg-accent4/10 transition-colors resize-none"
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-accent4/20 border border-accent4 p-4 text-xl hover:bg-accent4 hover:text-black transition-all duration-300 tracking-widest"
                >
                  [ LAUNCH SEQUENCE ]
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center animate-pulse">
                <h3 className="text-5xl mb-4">PAYLOAD DELIVERED</h3>
                <p className="text-xl opacity-80">CONNECTION SEVERED.</p>
              </div>
            )}

            {/* CRT Scanline effect */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI0NywgMTQ3LCAzMCwgMC4wNSkiLz4KPC9zdmc+')] mix-blend-screen" />
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

export default function Contact() {
  return (
    <section className="relative w-full h-screen pointer-events-none z-10 flex flex-col items-center justify-center">
      <div className="absolute top-20 right-10 pointer-events-none z-20">
        <h2 className="text-8xl font-display font-bold text-accent4 tracking-widest text-shadow-glow">CONTACT</h2>
      </div>
      <div className="w-full h-full absolute inset-0 -z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <HolographicTerminal />
        </Canvas>
      </div>
    </section>
  );
}
'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEngine } from '../room-engine/RoomEngine';
import { LOBBY_ROOM } from '@/utils/roomConfigs';
import { Portal } from '../room-engine/Portal';
import gsap from 'gsap';

export function LobbyRoom() {
  const lineRef = useRef<SVGPathElement>(null);

  // Animate the SVG floor plan
  useEffect(() => {
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength();
      gsap.fromTo(lineRef.current,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 4, ease: "power1.inOut", delay: 1 }
      );
    }
  }, []);

  return (
    <RoomEngine config={LOBBY_ROOM}>
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 4, 0]} intensity={2} angle={0.5} penumbra={1} castShadow />

      {/* The DOM-based floor plan and text for crispness and easy font usage */}
      <Html position={[0, 1.5, -3]} transform distanceFactor={5} style={{ color: '#1A1A1A' }}>
        <div className="flex flex-col items-center justify-center bg-[#F0ECE4] p-8 w-[800px] h-[600px]">
          <svg width="400" height="400" viewBox="0 0 100 100" className="mb-8">
            <path
              ref={lineRef}
              d="M 10 10 L 90 10 L 90 90 L 10 90 Z M 50 10 L 50 90 M 10 50 L 90 50"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2"
            />
          </svg>
          <h1 className="font-display text-[150px] leading-none tracking-tighter m-0">SKS</h1>
          <p className="font-mono text-xl mt-4 typing-effect">THE IMPOSSIBLE BUILDING.</p>
        </div>
      </Html>

      {/* The Revolving Door Portal */}
      {LOBBY_ROOM.portals.map(p => (
        <Portal key={p.id} portal={p} />
      ))}

      {/* Decorative revolving door mesh in front of portal */}
      <group position={[0, 0, -4.5]}>
        <mesh position={[-1, 1.5, 0]}>
          <boxGeometry args={[0.1, 3, 2]} />
          <meshStandardMaterial color="#8B5A2B" />
        </mesh>
        <mesh position={[1, 1.5, 0]}>
          <boxGeometry args={[0.1, 3, 2]} />
          <meshStandardMaterial color="#8B5A2B" />
        </mesh>
      </group>

    </RoomEngine>
  );
}

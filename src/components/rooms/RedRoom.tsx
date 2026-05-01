'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEngine } from '../room-engine/RoomEngine';
import { RED_ROOM } from '@/utils/roomConfigs';
import { Portal } from '../room-engine/Portal';

export function RedRoom() {
  const { gl, size, camera } = useThree();
  const floorRef = useRef<THREE.Mesh>(null);
  const time = useRef(0);

  // Simple scrolling code shader for the floor
  const floorMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color('#ff0000') }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;

        // Pseudo-random noise for "code" effect
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          uv.y += time * 0.1; // scroll

          vec2 grid = floor(uv * 50.0);
          float noise = random(grid);

          float alpha = step(0.8, noise) * 0.5; // Sparse bits
          gl_FragColor = vec4(vec3(1.0), alpha);
        }
      `,
      transparent: true,
    });
  }, []);

  useFrame((state, delta) => {
    time.current += delta;
    if (floorMaterial) {
      floorMaterial.uniforms.time.value = time.current;
    }
  });

  return (
    <RoomEngine config={RED_ROOM}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={2} color="#ffffff" distance={20} />

      {/* Infinite Ceiling illusion - using multiple stacked planes as simple fake out instead of complex render targets for this base */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`ceiling-${i}`} position={[0, RED_ROOM.geometry.height + i * 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[RED_ROOM.geometry.width, RED_ROOM.geometry.depth]} />
          <meshBasicMaterial color={RED_ROOM.dominantColor} transparent opacity={1 - (i * 0.15)} wireframe={i > 2} />
        </mesh>
      ))}

      {/* Scrolling Code Floor overlay */}
      <mesh ref={floorRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[RED_ROOM.geometry.width, RED_ROOM.geometry.depth]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Skills text on walls */}
      {RED_ROOM.content?.skills.map((skill: any, index: number) => (
        <Html
          key={index}
          position={[skill.position.x, skill.position.y, skill.position.z]}
          transform
          // Orient the HTML element to face the center of the room roughly
          rotation={[0, Math.atan2(-skill.position.x, -skill.position.z), 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div
            className="font-display text-white font-bold tracking-tighter"
            style={{ fontSize: `${skill.proficiency * 300}px`, lineHeight: 0.8 }}
          >
            {skill.name}
          </div>
        </Html>
      ))}

      {/* Portals */}
      {RED_ROOM.portals.map(p => (
        <Portal key={p.id} portal={p} />
      ))}
    </RoomEngine>
  );
}

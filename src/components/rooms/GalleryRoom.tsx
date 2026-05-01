'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEngine } from '../room-engine/RoomEngine';
import { GALLERY_ROOM } from '@/utils/roomConfigs';
import { Portal } from '../room-engine/Portal';
import gsap from 'gsap';

export function GalleryRoom() {
  const { camera, scene } = useThree();
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const corridorGroupRef = useRef<THREE.Group>(null);
  const [flipped, setFlipped] = useState(false);

  // Setup heavy fog for infinite length illusion
  useEffect(() => {
    const originalFog = scene.fog;
    scene.fog = new THREE.FogExp2('#0A0A0A', 0.05);
    return () => {
      scene.fog = originalFog;
    };
  }, [scene]);

  useFrame(() => {
    // Spotlight follows the player on the Z axis
    if (spotlightRef.current) {
      spotlightRef.current.position.z = camera.position.z;
      spotlightRef.current.target.position.set(0, 0, camera.position.z);
      spotlightRef.current.target.updateMatrixWorld();
    }

    // Trigger gravity flip midway down the corridor (z < 25)
    if (!flipped && camera.position.z < 25) {
      setFlipped(true);
      // Flip the entire corridor geometry visually
      if (corridorGroupRef.current) {
        gsap.to(corridorGroupRef.current.rotation, {
          z: Math.PI / 2, // Rotate 90 degrees
          duration: 2,
          ease: "power2.inOut"
        });
      }
    }
  });

  return (
    <group ref={corridorGroupRef}>
      <RoomEngine config={GALLERY_ROOM}>
        {/* Follow Spotlight */}
        <spotLight
          ref={spotlightRef}
          position={[0, 4, 0]}
          angle={Math.PI / 4}
          penumbra={0.8}
          intensity={5}
          distance={15}
          color="#FF3D00"
        />

        {/* Shadow box dioramas */}
        {GALLERY_ROOM.content?.projects.map((proj: any) => (
          <group key={proj.id} position={[proj.position.x, proj.position.y, proj.position.z]}>
            <mesh position={[0, 0, -0.1]}>
              <boxGeometry args={[2, 1.5, 0.2]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <Html
              transform
              rotation={[0, proj.position.x > 0 ? -Math.PI/2 : Math.PI/2, 0]}
              position={[proj.position.x > 0 ? -0.1 : 0.1, 0, 0]}
              distanceFactor={3}
            >
              <div className="w-64 h-48 bg-[#0A0A0A] border border-[#FF3D00] flex items-center justify-center text-center p-4">
                <h3 className="font-mono text-[#FF3D00] text-xl mb-2">{proj.title}</h3>
                <p className="font-mono text-xs text-gray-400">Hover/Click logic placeholder</p>
              </div>
            </Html>
          </group>
        ))}

        {/* Escher Loop Exit Portal */}
        {GALLERY_ROOM.portals.map(p => (
          <Portal key={p.id} portal={p} />
        ))}
      </RoomEngine>
    </group>
  );
}

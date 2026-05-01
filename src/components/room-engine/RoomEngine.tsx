'use client';

import React, { useMemo } from 'react';
import { RoomConfig } from '@/types/room';
import * as THREE from 'three';

interface RoomEngineProps {
  config: RoomConfig;
  children?: React.ReactNode;
}

export function RoomEngine({ config, children }: RoomEngineProps) {
  // Generate procedural geometry based on config
  // For standard rooms, we create a box room, minus holes for portals

  // Note: For advanced procedural generation with holes, we might use CSG (Constructive Solid Geometry),
  // but for a React Three Fiber setup, we can use simple planes for walls, leaving gaps for doorways,
  // or use a custom shader that discards fragments in the portal areas.
  // For this basic setup, we'll build simple planes.

  const { width, height, depth } = config.geometry;

  const materials = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: config.dominantColor,
      side: THREE.BackSide, // Render inside
      roughness: 0.9,
      metalness: 0.1
    });
  }, [config.dominantColor]);

  // We are rendering the room as a box, but we need to accommodate portals later.
  // For now, simple box geometry (inside out)
  return (
    <group name={`room-${config.id}`}>
      {/* Basic walls */}
      <mesh material={materials} position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Ceiling removal for Red Room logic could be added here by separating planes instead of BoxGeometry */}

      {/* We can inject custom room specific elements via children */}
      {children}
    </group>
  );
}

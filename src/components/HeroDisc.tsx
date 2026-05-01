"use client";

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Float, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

const SLICES_DATA = [
  { id: 0, label: 'Skills', color: '#6EE7F7' },
  { id: 1, label: 'Projects', color: '#FF6B6B' },
  { id: 2, label: 'Experience', color: '#A855F7' },
  { id: 3, label: 'Education', color: '#F7931E' },
  { id: 4, label: 'Open Source', color: '#6EE7F7' },
  { id: 5, label: 'Awards', color: '#FF6B6B' },
  { id: 6, label: 'Philosophy', color: '#A855F7' },
  { id: 7, label: 'Contact', color: '#F7931E' }
];

function OrbitalNode({
  index,
  data,
  hoveredSlice,
  setHoveredSlice,
  activeSlice,
  onClickSlice,
  totalNodes
}: {
  index: number;
  data: { label: string, color: string };
  hoveredSlice: number | null;
  activeSlice: number | null;
  setHoveredSlice: (id: number | null) => void;
  onClickSlice: (id: number) => void;
  totalNodes: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredSlice === index;
  const isActive = activeSlice === index;

  // Base position on an orbit
  const angle = (index / totalNodes) * Math.PI * 2;
  const radius = 3.5;
  const baseX = Math.cos(angle) * radius;
  const baseY = Math.sin(angle) * radius;

  // Memoize geometry/material config
  const materialParams = useMemo(() => ({
    color: data.color,
    emissive: data.color,
    emissiveIntensity: isHovered || isActive ? 2 : 0.5,
    metalness: 0.8,
    roughness: 0.1,
    transparent: true,
    opacity: 0.9,
    wireframe: !isHovered && !isActive
  }), [data.color, isHovered, isActive]);

  useFrame(() => {
    if (meshRef.current) {
      if (isActive) {
        // Move towards camera and scale up
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.05);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.05);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 2, 0.05);
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 2, 0.05));
      } else {
        // Return to orbit position
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, baseX, 0.05);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, baseY, 0.05);

        const targetZ = isHovered ? 0.5 : 0;
        const targetScale = isHovered ? 1.5 : 1;

        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
      }

      // Independent spinning for the crystal
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={isHovered ? 0 : 1} floatIntensity={isHovered ? 0 : 2}>
        <mesh
          ref={meshRef}
          position={[baseX, baseY, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (activeSlice === null) {
              setHoveredSlice(index);
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={() => {
            if (activeSlice === null) {
              setHoveredSlice(null);
              document.body.style.cursor = 'auto';
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (activeSlice === null) {
              onClickSlice(index);
              document.body.style.cursor = 'auto';
            }
          }}
        >
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial {...materialParams} />

          <Html
            position={[0, -0.8, 0]}
            center
            style={{
              pointerEvents: 'none',
              transition: 'opacity 0.3s, transform 0.3s',
              opacity: isHovered || isActive ? 1 : 0.2,
              transform: isHovered ? 'scale(1.2)' : 'scale(1)'
            }}
          >
            <div
              className="font-display font-bold text-white tracking-widest uppercase drop-shadow-md whitespace-nowrap"
              style={{ textShadow: `0 0 15px ${data.color}` }}
            >
              {data.label}
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
}

function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && ringRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.2;

      ringRef.current.rotation.z = -state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ringRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Glowing Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#0A0A0F"
          emissive="#6EE7F7"
          emissiveIntensity={2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Orbiting Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.02, 16, 100]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={4} />
      </mesh>
    </group>
  );
}

function SceneControls({ activeSlice }: { activeSlice: number | null }) {
  const { camera } = useThree();

  useFrame(() => {
    if (activeSlice !== null) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.02);
    } else {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -2, 0.05);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
    }
  });

  return null;
}

function OrbitalSystem({
  onSliceSelect,
  activeSlice,
  setActiveSlice,
  explode
}: {
  onSliceSelect: (id: number) => void,
  activeSlice: number | null,
  setActiveSlice: (id: number | null) => void,
  explode: boolean
}) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const systemRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (systemRef.current) {
      if (explode) {
        systemRef.current.rotation.z += 0.2;
        systemRef.current.scale.multiplyScalar(1.02);
      } else if (activeSlice !== null) {
        // Rotate system so the selected node is front and center roughly
        const targetRotation = - (activeSlice * (Math.PI * 2) / SLICES_DATA.length) - Math.PI/2;
        systemRef.current.rotation.z = THREE.MathUtils.lerp(systemRef.current.rotation.z, targetRotation, 0.05);
        systemRef.current.rotation.x = THREE.MathUtils.lerp(systemRef.current.rotation.x, 0, 0.05);
      } else {
        // Idle System rotation. Stop if a node is hovered.
        if (hoveredSlice === null) {
          systemRef.current.rotation.z -= 0.002;
        }
        systemRef.current.rotation.x = THREE.MathUtils.lerp(systemRef.current.rotation.x, 0.4, 0.05);
        systemRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
  });

  const handleSliceClick = (id: number) => {
    setActiveSlice(id);
    onSliceSelect(id);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
      <spotLight position={[0, 0, 10]} angle={0.5} penumbra={1} intensity={2} color="#6EE7F7" />

      <SceneControls activeSlice={activeSlice} />

      <group ref={systemRef}>
        {activeSlice === null && <CentralCore />}

        {SLICES_DATA.map((slice, i) => (
          <OrbitalNode
            key={slice.id}
            index={i}
            totalNodes={SLICES_DATA.length}
            data={slice}
            hoveredSlice={hoveredSlice}
            activeSlice={activeSlice}
            setHoveredSlice={setHoveredSlice}
            onClickSlice={handleSliceClick}
          />
        ))}
      </group>
    </>
  );
}

export default function HeroDisc({ onSliceSelect, activeSlice, setActiveSlice }: { onSliceSelect: (id: number) => void, activeSlice: number | null, setActiveSlice: (id: number | null) => void }) {
  const [explode, setExplode] = useState(false);
  const [dpr, setDpr] = useState(1);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setExplode(true);
    }, 2000);
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
  };

  return (
    <div className="w-full h-screen absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div
        className="w-full h-full pointer-events-auto"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Canvas camera={{ position: [0, -2, 10], fov: 45 }} dpr={dpr}>
          <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
          <OrbitalSystem
            onSliceSelect={onSliceSelect}
            activeSlice={activeSlice}
            setActiveSlice={setActiveSlice}
            explode={explode}
          />
        </Canvas>
      </div>
    </div>
  );
}

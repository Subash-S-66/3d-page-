"use client";

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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

function DiscSlice({
  index,
  data,
  hoveredSlice,
  setHoveredSlice,
  activeSlice,
  onClickSlice
}: {
  index: number;
  data: { label: string, color: string };
  hoveredSlice: number | null;
  activeSlice: number | null;
  setHoveredSlice: (id: number | null) => void;
  onClickSlice: (id: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isHovered = hoveredSlice === index;
  const isActive = activeSlice === index;

  const angleStep = (Math.PI * 2) / 8;
  const startAngle = index * angleStep;
  const endAngle = (index + 1) * angleStep;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.arc(0, 0, 3, startAngle, endAngle, false);
    s.lineTo(0, 0);
    return s;
  }, [startAngle, endAngle]);

  const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };

  useFrame(() => {
    if (groupRef.current) {
      if (isActive) {
        // Active state (clicked): expand forward significantly and scale
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 2, 0.05);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.5, 0.05));
      } else {
        // Normal / Hover state
        const targetZ = isHovered ? 0.5 : 0;
        const targetScale = isHovered ? 1.05 : 1;

        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
      }
    }
  });

  return (
    <group
      ref={groupRef}
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
      <mesh>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={isHovered || isActive ? data.color : '#1A1A24'}
          metalness={0.8}
          roughness={0.2}
          emissive={isHovered || isActive ? data.color : '#000000'}
          emissiveIntensity={isHovered || isActive ? 0.5 : 0}
        />
      </mesh>

      {/* Label HTML overlay */}
      <Html
        position={[
          Math.cos(startAngle + angleStep/2) * 2,
          Math.sin(startAngle + angleStep/2) * 2,
          0.3
        ]}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'none', transition: 'opacity 0.3s', opacity: isHovered || isActive ? 1 : 0.4 }}
      >
        <div
          className="font-display font-bold text-white tracking-widest uppercase drop-shadow-md whitespace-nowrap"
          style={{ textShadow: isHovered || isActive ? `0 0 10px ${data.color}` : 'none' }}
        >
          {data.label}
        </div>
      </Html>
    </group>
  );
}

function SceneControls({ activeSlice }: { activeSlice: number | null }) {
  const { camera } = useThree();

  useFrame(() => {
    // Camera zoom logic when a slice is active
    if (activeSlice !== null) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 2, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.02);
    } else {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -5, 0.05);
    }
  });

  return null;
}

function DiscContent({
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
  const discRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (discRef.current) {
      if (explode) {
        // Supernova explosion easter egg (wild spin and scale out)
        discRef.current.rotation.z += 0.5;
        discRef.current.scale.multiplyScalar(1.05);
      } else if (activeSlice !== null) {
        // Rotate disc so the selected slice faces forward
        const targetRotation = - (activeSlice * (Math.PI * 2) / 8) - (Math.PI / 8) + Math.PI/2; // rough adjustment to center
        discRef.current.rotation.z = THREE.MathUtils.lerp(discRef.current.rotation.z, targetRotation, 0.05);
        discRef.current.rotation.x = THREE.MathUtils.lerp(discRef.current.rotation.x, 0, 0.05); // flatten
      } else {
        // Idle slow rotation
        discRef.current.rotation.z -= 0.002;
        discRef.current.rotation.x = THREE.MathUtils.lerp(discRef.current.rotation.x, 0.4, 0.05);
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
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 0, 10]} angle={0.3} penumbra={1} intensity={2} color="#6EE7F7" />

      <SceneControls activeSlice={activeSlice} />

      <group ref={discRef} rotation={[0.4, 0, 0]}>
        {SLICES_DATA.map((slice, i) => (
          <DiscSlice
            key={slice.id}
            index={i}
            data={slice}
            hoveredSlice={hoveredSlice}
            activeSlice={activeSlice}
            setHoveredSlice={setHoveredSlice}
            onClickSlice={handleSliceClick}
          />
        ))}

        {/* Center Core */}
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
          <meshStandardMaterial color="#0A0A0F" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.3]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </>
  );
}

export default function HeroDisc({ onSliceSelect, activeSlice, setActiveSlice }: { onSliceSelect: (id: number) => void, activeSlice: number | null, setActiveSlice: (id: number | null) => void }) {
  const [explode, setExplode] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    holdTimerRef.current = setTimeout(() => {
      setExplode(true);
    }, 2000); // 2 second long press for supernova
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
        <Canvas camera={{ position: [0, -5, 8], fov: 45 }}>
          <DiscContent
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

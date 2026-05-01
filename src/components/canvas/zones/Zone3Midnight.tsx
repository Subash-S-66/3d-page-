'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Procedural shipwreck using noisy boxes
function Shipwreck({ position, rotation, companyName, role }: { position: [number, number, number], rotation: [number, number, number], companyName: string, role: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Generate barnacles
  const barnacles = useMemo(() => {
    const b = []
    for (let i = 0; i < 50; i++) {
      b.push({
        pos: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
        ] as [number, number, number],
        scale: Math.random() * 0.2 + 0.05
      })
    }
    return b
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow floating/groaning effect
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.2
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
    >
      {/* Hull */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 1.5, 1.5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Deck / Cabin */}
      <mesh position={[-1, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1.2]} />
        <meshStandardMaterial color="#222222" roughness={1} />
      </mesh>

      {/* Barnacles */}
      {barnacles.map((b, i) => (
        <mesh key={i} position={b.pos} scale={b.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#445544" roughness={1} />
        </mesh>
      ))}

      {/* Etched Text */}
      <Text
        position={[0, 0, 0.76]}
        fontSize={0.3}
        color={hovered ? "#ffffff" : "#666666"}
        anchorX="center"
        anchorY="middle"
      >
        {companyName}
      </Text>

      <Text
        position={[0, -0.4, 0.76]}
        fontSize={0.15}
        color={hovered ? "#aaddff" : "#444444"}
        anchorX="center"
        anchorY="middle"
      >
        {role}
      </Text>

      {/* Interior Glow (memory lives on) */}
      <pointLight
        position={[-1, 1, 0]}
        color="#ffaa66"
        intensity={hovered ? 2 : 0.5}
        distance={4}
      />
    </group>
  )
}

function CursorSpotlight() {
  const lightRef = useRef<THREE.SpotLight>(null)
  const targetRef = useMemo(() => new THREE.Object3D(), [])
  const { camera, pointer, viewport } = useThree()

  useFrame(() => {
    if (lightRef.current && targetRef) {
      // Calculate mouse position in world space at z=0
      const x = (pointer.x * viewport.width) / 2
      const y = (pointer.y * viewport.height) / 2

      // Target position
      targetRef.position.set(x, camera.position.y + y, 0)

      // Light position (attached to camera but offset slightly)
      lightRef.current.position.set(camera.position.x, camera.position.y, camera.position.z)
      lightRef.current.target = targetRef
    }
  })

  return (
    <>
      <primitive object={targetRef} />
      <spotLight
        ref={lightRef}
        color="#ffffff"
        intensity={5}
        angle={0.4}
        penumbra={0.5}
        distance={20}
        castShadow
      />
    </>
  )
}

export default function Zone3Midnight() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null

  return (
    <group>
      {/* Dark ambient base so things aren't completely invisible without cursor */}
      <ambientLight intensity={0.05} />

      {/* The cursor becomes the spotlight in this zone */}
      <CursorSpotlight />

      {/* Shipwrecks (Jobs) */}
      <Shipwreck position={[-2, -2, -1]} rotation={[0.2, 0.4, -0.1]} companyName="TECH CORP" role="SENIOR ENGINEER" />
      <Shipwreck position={[3, -5, -3]} rotation={[-0.1, -0.5, 0.2]} companyName="STARTUP INC" role="FULLSTACK DEV" />
      <Shipwreck position={[-1, -8, -2]} rotation={[0.3, 0.1, 0.4]} companyName="AGENCY LLC" role="FRONTEND DEV" />

      {/* Volcanic Vent Smoke */}
      <VentSmoke />
    </group>
  )
}

function VentSmoke() {
  const count = 100
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const p = []
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 5 - 2,
        speed: Math.random() * 0.02 + 0.01,
        offset: Math.random() * Math.PI * 2
      })
    }
    return p
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        // Float upward and drift
        const t = state.clock.elapsedTime
        const currentY = (p.y + t * p.speed * 10) % 15 - 7.5

        dummy.position.set(
          p.x + Math.sin(t * p.speed + p.offset),
          currentY,
          p.z
        )
        // Scale based on lifetime
        const scale = 1 - (currentY + 7.5) / 15
        dummy.scale.setScalar(scale * 0.5)
        dummy.updateMatrix()
        meshRef.current!.setMatrixAt(i, dummy.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshBasicMaterial color="#333333" transparent opacity={0.2} depthWrite={false} />
    </instancedMesh>
  )
}

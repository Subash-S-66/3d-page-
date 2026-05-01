'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

// Alien transmitter crystalline structure
function Transmitter() {
  const meshRef = useRef<THREE.Mesh>(null)
  const beamRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Custom hook or global state could trigger this, simulating for now with click
  const [isFiring, setIsFiring] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
    }

    if (beamRef.current) {
      if (isFiring) {
        // Beam shoots up instantly and scales
        beamRef.current.scale.y = THREE.MathUtils.lerp(beamRef.current.scale.y, 100, 0.1)
        ;(beamRef.current.material as THREE.MeshBasicMaterial).opacity = 1
      } else {
        beamRef.current.scale.y = 0.01
        ;(beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0
      }
    }
  })

  // Expose fire method to window for HTML overlay to call
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fireTransmitter = () => {
      setIsFiring(true)
      // Reset after a long time
      setTimeout(() => setIsFiring(false), 5000)
    }
  }

  return (
    <group position={[0, -5, 0]}>
      {/* The Crystal */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
        onClick={() => setIsFiring(true)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color="#ff00ff"
          emissive="#aa00aa"
          emissiveIntensity={hovered ? 2 : 1}
          roughness={0.1}
          transmission={0.9}
          thickness={1}
          clearcoat={1}
        />
      </mesh>

      {/* The Light Beam */}
      <mesh ref={beamRef} position={[0, 50, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 100, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>

      <pointLight color="#ff00ff" intensity={isFiring ? 10 : 2} distance={10} />

      {/* Tube worms (Socials) */}
      <group position={[0, -2, 0]}>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]} rotation={[0, -angle, 0]}>
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.1, 1, 8]} />
                <meshStandardMaterial color="#331133" />
              </mesh>
              <mesh position={[0, 1.2, 0]}>
                <coneGeometry args={[0.2, 0.5, 8]} />
                <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={0.5} />
              </mesh>
              {/* Platform Label */}
              <Text
                position={[0, 1.6, 0]}
                fontSize={0.2}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {['GH', 'X', 'IN', 'DB'][i]}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}

function TrenchWalls() {
  const scrollProgress = useStore((state) => state.scrollProgress)
  const leftWallRef = useRef<THREE.Mesh>(null)
  const rightWallRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (leftWallRef.current && rightWallRef.current) {
      // Walls close in based on scroll progress at the very bottom
      // Zone 5 starts around progress 0.8
      const closingFactor = Math.max(0, (scrollProgress - 0.8) * 5)
      const targetX = Math.max(3, 10 - closingFactor * 7)

      leftWallRef.current.position.x = -targetX
      rightWallRef.current.position.x = targetX
    }
  })

  // Create highly noisy wall geometry
  const wallGeom = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 40, 32, 64)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i)
      // Simple random displacement
      pos.setZ(i, z + Math.random() * 2)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <>
      <mesh ref={leftWallRef} rotation={[0, Math.PI / 2, 0]} position={[-10, 0, 0]}>
        <primitive object={wallGeom} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>

      <mesh ref={rightWallRef} rotation={[0, -Math.PI / 2, 0]} position={[10, 0, 0]}>
        <primitive object={wallGeom} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>
    </>
  )
}

export default function Zone5Trench() {
  return (
    <group>
      <TrenchWalls />
      <Transmitter />
    </group>
  )
}

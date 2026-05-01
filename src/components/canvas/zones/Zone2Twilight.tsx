'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

function DeepSeaCreature({ position, type }: { position: [number, number, number], type: 'angler' | 'jelly' | 'squid' }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current && !clicked) {
      // Swimming animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }

    // Scale on hover
    if (meshRef.current) {
      const targetScale = clicked ? 2 : hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // Different geometry and material based on type
  const getGeometry = () => {
    switch (type) {
      case 'angler': return <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
      case 'jelly': return <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      case 'squid': return <cylinderGeometry args={[0, 1, 3, 16]} />
    }
  }

  const getColor = () => {
    switch (type) {
      case 'angler': return '#ff3366'
      case 'jelly': return '#33aaff'
      case 'squid': return '#aa33ff'
    }
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
        onClick={(e) => { e.stopPropagation(); setClicked(!clicked) }}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 2 : 1}
          wireframe={type === 'jelly'}
          transparent
          opacity={0.8}
        />

        {/* The "iframe" transition represented by an HTML overlay when clicked */}
        {clicked && (
          <Html center distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="w-64 h-80 bg-black/80 border border-white/20 backdrop-blur-md p-6 rounded-lg text-white pointer-events-auto flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif mb-2 text-[#aaddff]">Project Title</h3>
                <p className="text-sm text-white/70 font-sans">
                  Deep sea exploration protocols. Tech stack: Next.js, Three.js, WebGL.
                </p>
              </div>
              <button
                className="mt-4 border border-white/30 px-4 py-2 hover:bg-white/10 transition"
                onClick={(e) => { e.stopPropagation(); setClicked(false) }}
              >
                Close
              </button>
            </div>
          </Html>
        )}
      </mesh>

      {/* Light source from the creature */}
      <pointLight
        color={getColor()}
        intensity={hovered ? 2 : 0.5}
        distance={5}
      />
    </group>
  )
}

export default function Zone2Twilight() {
  return (
    <group>
      {/* Bioluminescent floating creatures representing projects */}
      <DeepSeaCreature position={[-4, 0, -2]} type="angler" />
      <DeepSeaCreature position={[3, -2, -4]} type="jelly" />
      <DeepSeaCreature position={[-2, -5, -6]} type="squid" />
      <DeepSeaCreature position={[5, -7, -2]} type="jelly" />
    </group>
  )
}

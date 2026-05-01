'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simple L-system-like generator for a branching structure
function generateBranch(level: number, length: number, radius: number): THREE.Object3D {
  const branch = new THREE.Group()

  const geometry = new THREE.CylinderGeometry(radius * 0.7, radius, length, 8)
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.95, 0.8, 0.5), // coral colors
    emissive: new THREE.Color().setHSL(Math.random() * 0.1 + 0.95, 0.8, 0.2),
    roughness: 0.8,
  })

  // Offset cylinder so its pivot is at the bottom
  geometry.translate(0, length / 2, 0)
  const mesh = new THREE.Mesh(geometry, material)
  branch.add(mesh)

  // Add glowing polyp at the end
  if (level === 0) {
    const polypGeom = new THREE.SphereGeometry(radius * 1.5, 8, 8)
    const polypMat = new THREE.MeshStandardMaterial({
      color: '#ffaaee',
      emissive: '#ff00aa',
      emissiveIntensity: 2,
    })
    const polyp = new THREE.Mesh(polypGeom, polypMat)
    polyp.position.y = length
    branch.add(polyp)
  }

  if (level > 0) {
    const numBranches = Math.floor(Math.random() * 2) + 2 // 2-3 branches
    for (let i = 0; i < numBranches; i++) {
      const childBranch = generateBranch(level - 1, length * 0.7, radius * 0.6)

      // Random rotation
      childBranch.rotation.z = (Math.random() - 0.5) * Math.PI * 0.5
      childBranch.rotation.x = (Math.random() - 0.5) * Math.PI * 0.5
      childBranch.rotation.y = Math.random() * Math.PI * 2

      childBranch.position.y = length * (0.5 + Math.random() * 0.5) // spawn anywhere on top half
      branch.add(childBranch)
    }
  }

  return branch
}

function CoralStructure({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const coralTree = useMemo(() => {
    return generateBranch(3, 4, 0.4) // level, initial length, initial radius
  }, [])

  useFrame((state) => {
    if (group.current) {
      // Gentle sway
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05

      // Scale up slightly on hover
      const targetScale = hovered ? 1.1 : 1.0
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
    >
      <primitive object={coralTree} />
    </group>
  )
}

export default function Zone1Coral() {
  return (
    <group>
      {/* Light coming from above (surface) */}
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} color="#88ddff" castShadow />

      {/* Several coral structures */}
      <CoralStructure position={[-3, -5, -2]} />
      <CoralStructure position={[4, -6, -4]} />
      <CoralStructure position={[-1, -8, -6]} />
      <CoralStructure position={[2, -4, 0]} />

      {/* Ambient particles (plankton) */}
      <PlanktonParticles />
    </group>
  )
}

function PlanktonParticles() {
  const count = 500
  const particlesRef = useRef<THREE.InstancedMesh>(null)

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        speed: Math.random() * 0.02,
      })
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      positions.forEach((particle, i) => {
        dummy.position.set(
          particle.x + Math.sin(state.clock.elapsedTime * particle.speed + i) * 2,
          particle.y + Math.cos(state.clock.elapsedTime * particle.speed + i) * 2,
          particle.z
        )
        dummy.updateMatrix()
        particlesRef.current!.setMatrixAt(i, dummy.matrix)
      })
      particlesRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color="#aaddff" transparent opacity={0.6} />
    </instancedMesh>
  )
}

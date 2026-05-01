'use client'

import { useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useStore } from '@/store/useStore'
import * as THREE from 'three'

import Zone0Surface from './zones/Zone0Surface'
import Zone1Coral from './zones/Zone1Coral'
import Zone2Twilight from './zones/Zone2Twilight'
import Zone3Midnight from './zones/Zone3Midnight'
import Zone4Abyss from './zones/Zone4Abyss'
import Zone5Trench from './zones/Zone5Trench'

// The total depth in units we will travel
const TOTAL_DEPTH = -100

export default function MainScene() {
  const { camera, scene } = useThree()
  const scrollProgress = useStore((state) => state.scrollProgress)

  // Base fog that deepens as we go down
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#001e4d', 0.02)
  }, [scene])

  useFrame(() => {
    // Move camera down Y axis based on scroll progress (0 to 1)
    const targetY = scrollProgress * TOTAL_DEPTH
    // Smooth camera movement
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1)

    // Update fog color based on depth
    if (scene.fog) {
      const fogColor = new THREE.Color()
      if (scrollProgress < 0.2) {
        fogColor.lerpColors(new THREE.Color('#005c99'), new THREE.Color('#001e4d'), scrollProgress * 5)
      } else if (scrollProgress < 0.4) {
        fogColor.lerpColors(new THREE.Color('#001e4d'), new THREE.Color('#1a0033'), (scrollProgress - 0.2) * 5)
      } else {
        fogColor.lerpColors(new THREE.Color('#1a0033'), new THREE.Color('#000000'), (scrollProgress - 0.4) * 2.5)
      }
      (scene.fog as THREE.FogExp2).color.copy(fogColor)
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 0]} intensity={1} />

      {/* Group holding all zones, spaced out vertically */}
      <group>
        <group position={[0, 0, 0]}>
          <Zone0Surface />
        </group>
        <group position={[0, -20, 0]}>
          <Zone1Coral />
        </group>
        <group position={[0, -40, 0]}>
          <Zone2Twilight />
        </group>
        <group position={[0, -60, 0]}>
          <Zone3Midnight />
        </group>
        <group position={[0, -80, 0]}>
          <Zone4Abyss />
        </group>
        <group position={[0, -100, 0]}>
          <Zone5Trench />
        </group>
      </group>
    </>
  )
}

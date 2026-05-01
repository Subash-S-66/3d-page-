'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomPortal } from '@/types/room';
import { portalVertexShader, portalFragmentShader } from '@/shaders/PortalShader';
import { useAppStore } from '@/stores/useAppStore';
import { useQualityStore } from '@/stores/useQualityStore';
import gsap from 'gsap';
import { Howl } from 'howler';

interface PortalProps {
  portal: RoomPortal;
  targetScene?: THREE.Scene; // The scene to render into the texture
}

export function Portal({ portal, targetScene }: PortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl, camera, size } = useThree();
  const { isTransitioning, setIsTransitioning, setControlsEnabled, setCurrentRoomId } = useAppStore();
  const tier = useQualityStore(state => state.tier);

  const [hasTriggered, setHasTriggered] = useState(false);

  // FBO (Render Target) for high-tier portal rendering
  const renderTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(
      tier === 'high' ? size.width : 256, // Low tier won't use this anyway, but fallback
      tier === 'high' ? size.height : 256,
      {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType
      }
    );
  }, [size, tier]);

  const material = useMemo(() => {
    if (tier === 'low') {
      return new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black doorway fallback
    }
    return new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        resolution: { value: new THREE.Vector2(size.width, size.height) }
      },
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader
    });
  }, [renderTarget, size, tier]);

  useFrame((state) => {
    // Distance check for transition
    if (meshRef.current && !isTransitioning && !hasTriggered) {
      const distance = state.camera.position.distanceTo(meshRef.current.position);
      if (distance < 1.5) {
        triggerTransition(state.camera);
      }
    }

    // Render logic for high tier (render target)
    if (tier === 'high' && targetScene && meshRef.current) {
      // Hide portal mesh to avoid recursive rendering if needed
      meshRef.current.visible = false;

      // We would ideally position a secondary camera in the target scene relative to the portal
      // For this skeleton, we just render the scene. Full implementation requires complex camera offset logic.
      gl.setRenderTarget(renderTarget);
      gl.render(targetScene, camera);
      gl.setRenderTarget(null);

      meshRef.current.visible = true;
    }
  });

  const triggerTransition = (cam: THREE.Camera) => {
    setHasTriggered(true);
    setIsTransitioning(true);
    setControlsEnabled(false);

    // Play door creak
    const creak = new Howl({
      src: ['/sounds/door-creak.mp3'], // Placeholder
      volume: 0.5
    });
    creak.play();

    if (tier === 'low') {
      // Fade to black transition via a screen overlay (implemented in global layout)
      // For simplicity here, just wait and swap
      setTimeout(() => {
        setCurrentRoomId(portal.targetRoomId);
        cam.position.set(0, 1.6, 0); // Reset position in new room
        setIsTransitioning(false);
        setControlsEnabled(true);
      }, 1000);
    } else {
      // High tier GSAP Dolly Transition
      // Move camera through the portal
      const targetPos = meshRef.current!.position.clone();

      // Move slightly past the portal
      const dir = new THREE.Vector3(0,0,1).applyEuler(meshRef.current!.rotation);
      targetPos.add(dir.multiplyScalar(-2.0));

      gsap.to(cam.position, {
        x: targetPos.x,
        y: targetPos.y + 1.6, // Keep eye level
        z: targetPos.z,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentRoomId(portal.targetRoomId);
          // Teleport to the corresponding entry point in the new room
          cam.position.set(0, 1.6, 0);
          setIsTransitioning(false);
          setControlsEnabled(true);
        }
      });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[portal.position.x, portal.position.y + portal.dimensions.height/2, portal.position.z]}
      rotation={[portal.rotation.x, portal.rotation.y, portal.rotation.z]}
    >
      <planeGeometry args={[portal.dimensions.width, portal.dimensions.height]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

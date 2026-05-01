'use client';

import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls, PointerLockControlsProps } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/stores/useAppStore';
import { useQualityStore } from '@/stores/useQualityStore';

const SPEED = 5.0;

export function FirstPersonController() {
  const { camera, gl } = useThree();
  const { controlsEnabled, isTransitioning } = useAppStore();
  const tier = useQualityStore((state) => state.tier);

  const controlsRef = useRef<any>(null);

  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = false;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!controlsEnabled || isTransitioning) return;

    // Dampen velocity
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward);
    direction.current.x = Number(moveState.current.right) - Number(moveState.current.left);
    direction.current.normalize(); // consistent movement in all directions

    if (moveState.current.forward || moveState.current.backward) velocity.current.z -= direction.current.z * SPEED * delta;
    if (moveState.current.left || moveState.current.right) velocity.current.x -= direction.current.x * SPEED * delta;

    if (controlsRef.current && controlsRef.current.isLocked) {
      controlsRef.current.moveRight(-velocity.current.x);
      controlsRef.current.moveForward(-velocity.current.z);
    }
  });

  // Basic mobile gyro / touch setup could be extended here, for now PointerLock on desktop is primary
  // Fallback to basic orbiting or device orientation for low tier mobile
  if (tier === 'low') {
    // Return device orientation or basic touch controls here later,
    // for now we'll just allow basic PointerLock on all to get it working,
    // but in a full impl we'd use DeviceOrientationControls or drag controls.
  }

  return (
    <>
      {controlsEnabled && !isTransitioning && (
        <PointerLockControls ref={controlsRef} />
      )}
    </>
  );
}

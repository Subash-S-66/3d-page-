'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/stores/useAppStore';
import { FirstPersonController } from '@/components/canvas/FirstPersonController';
import { LobbyRoom } from '@/components/rooms/LobbyRoom';
import { RedRoom } from '@/components/rooms/RedRoom';
import { GalleryRoom } from '@/components/rooms/GalleryRoom';
import { useQualityStore } from '@/stores/useQualityStore';

export default function Home() {
  const { currentRoomId, isTransitioning } = useAppStore();
  const { initializeQuality } = useQualityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeQuality();
    setMounted(true);
  }, [initializeQuality]);

  if (!mounted) return <div className="w-screen h-screen bg-black flex items-center justify-center text-white font-mono">INITIALIZING THE IMPOSSIBLE...</div>;

  return (
    <main className="w-screen h-screen bg-black relative">
      <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 75 }}>
        <FirstPersonController />

        {/* Simple mounting/unmounting of rooms based on ID for this base setup */}
        {currentRoomId === 'lobby' && <LobbyRoom />}
        {currentRoomId === 'red-room' && <RedRoom />}
        {currentRoomId === 'gallery' && <GalleryRoom />}

        {/* Note: Full impossible architecture would render multiple rooms simultaneously
            in off-screen targets for seamless look-through. For this skeleton step,
            we are swapping components. The shader logic is scaffolded in Portal.tsx */}
      </Canvas>

      {/* Screen Overlay for Low Tier Transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500 z-50 flex items-center justify-center" style={{ opacity: isTransitioning ? 1 : 0 }}>
          {/* Post-FX motion blur spike could be a CSS filter here or a PostProcessing pass in Canvas */}
          <div className="w-full h-full backdrop-blur-xl"></div>
        </div>
      )}

      {/* Mini-map Overlay Placeholder */}
      <div className="absolute bottom-8 left-8 w-48 h-48 bg-black/50 border border-[#333] p-4 text-[#FF3D00] font-mono text-xs z-40 pointer-events-none">
        MAP: WRONG
        <div className="mt-2 text-white">Current: {currentRoomId.toUpperCase()}</div>
      </div>
    </main>
  );
}

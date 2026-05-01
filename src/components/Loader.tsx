"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const textRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const letters = textRef.current?.children;
    if (!letters || !containerRef.current || !ringRef.current) return;

    const tl = gsap.timeline({
      onUpdate: function() {
        setProgress(Math.round(this.progress() * 100));
      },
      onComplete: () => {
        // Shatter effect
        gsap.to(containerRef.current, {
          clipPath: "polygon(50% 50%, 100% -20%, 120% 50%, 100% 120%, 50% 50%, -20% 120%, -20% 50%, -20% -20%)",
          opacity: 0,
          scale: 1.1,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            if (containerRef.current) containerRef.current.style.display = 'none';
            onComplete();
          },
        });
      },
    });

    // Ring animation
    tl.to(ringRef.current, {
      rotate: 360,
      duration: 2.5,
      ease: "none",
    }, 0);

    // Letter assembly
    gsap.set(letters, {
      opacity: 0,
      z: () => gsap.utils.random(-500, 500),
      x: () => gsap.utils.random(-300, 300),
      y: () => gsap.utils.random(-300, 300),
      rotationX: () => gsap.utils.random(-180, 180),
      rotationY: () => gsap.utils.random(-180, 180),
      scale: () => gsap.utils.random(0.5, 2)
    });

    tl.to(letters, {
      opacity: 1,
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 2,
      stagger: 0.2,
      ease: "expo.out",
    }, 0.2);

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center overflow-hidden"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glowing ring progress */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent1 opacity-50 shadow-[0_0_30px_rgba(110,231,247,0.3)]"
        />

        {/* Letters assembly */}
        <div ref={textRef} className="flex gap-2 text-accent1 font-display text-8xl font-bold tracking-tighter text-shadow-glow perspective-[1000px]">
          <span className="inline-block transform-style-3d">S</span>
          <span className="inline-block transform-style-3d">K</span>
          <span className="inline-block transform-style-3d">S</span>
        </div>
      </div>
      <div className="absolute bottom-20 font-mono text-accent1/60 text-sm">
        INITIALIZING... {progress}%
      </div>
    </div>
  );
}
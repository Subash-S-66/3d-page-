"use client";

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ringRef.current) {
      const circumference = 2 * Math.PI * 45; // r=45
      const offset = circumference - (progress / 100) * circumference;
      gsap.to(ringRef.current, {
        strokeDashoffset: offset,
        duration: 0.3,
        ease: "power2.out"
      });
    }

    if (progress >= 100) {
      // Shatter effect
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = 'none';
          onComplete();
        }
      });

      tl.to(textRef.current, {
        scale: 1.5,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power3.in"
      }, "+=0.2")
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.3");
    }
  }, [progress, onComplete]);

  // Initial letter fly-in animation
  useEffect(() => {
    if (!textRef.current) return;
    const letters = textRef.current.children;

    gsap.fromTo(letters,
      {
        opacity: 0,
        x: () => (Math.random() - 0.5) * 400,
        y: () => (Math.random() - 0.5) * 400,
        z: () => (Math.random() - 0.5) * 400,
        rotationX: () => Math.random() * 360,
        rotationY: () => Math.random() * 360,
        rotationZ: () => Math.random() * 360,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Glowing Ring Progress */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <circle
            ref={ringRef}
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#6EE7F7"
            strokeWidth="2"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45}
            style={{
              filter: "drop-shadow(0 0 8px rgba(110, 231, 247, 0.8))",
              transition: "stroke-dashoffset 0.1s"
            }}
          />
        </svg>

        {/* Scattered Letters */}
        <div ref={textRef} className="flex gap-2 text-6xl font-display font-bold glow-text text-white">
          <span className="inline-block transform-gpu">S</span>
          <span className="inline-block transform-gpu">K</span>
          <span className="inline-block transform-gpu">S</span>
        </div>
      </div>

      <div className="mt-8 font-mono text-accent1/60 text-sm tracking-widest">
        INITIALIZING UNIVERSE... {Math.min(progress, 100)}%
      </div>
    </div>
  );
}

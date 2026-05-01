"use client";

import { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // We'll use a placeholder cosmic drone sound or silence if not available
    // In a real app, this would be an actual mp3
    soundRef.current = new Howl({
      src: ["data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"], // Empty valid wav to avoid 404
      loop: true,
      volume: 0.5,
      rate: 1.0,
      html5: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  // Update pitch based on scroll speed
  useEffect(() => {
    if (!isPlaying || !soundRef.current) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = Math.abs(currentScrollY - lastScrollY);

          // Map scroll delta to playback rate (1.0 to 1.5)
          const newRate = 1.0 + Math.min(delta / 100, 0.5);
          soundRef.current?.rate(newRate);

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Smoothly return rate to 1.0 when scrolling stops
    const interval = setInterval(() => {
      if (soundRef.current) {
        const currentRate = soundRef.current.rate();
        if (typeof currentRate === 'number' && currentRate > 1.0) {
          soundRef.current.rate(Math.max(1.0, currentRate - 0.05));
        }
      }
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={togglePlay}
      className={twMerge(
        clsx(
          "fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full border border-white/10 bg-surface backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300",
          isPlaying && "text-accent1 border-accent1/30 shadow-[0_0_15px_rgba(110,231,247,0.2)]"
        )
      )}
      data-magnetic
      aria-label="Toggle ambient sound"
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
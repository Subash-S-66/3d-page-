"use client";

import { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import { useLenis } from '@studio-freight/react-lenis';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/ambient.mp3'], // Assuming we have this file later
      loop: true,
      volume: 0.2,
      rate: 1.0,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (!lenis || !soundRef.current || !isPlaying) return;

    const onScroll = (e: { velocity?: number }) => {
      const speed = Math.abs(e.velocity || 0);
      const newRate = 1.0 + Math.min(speed / 50, 1.0); // Adjust max pitch change
      soundRef.current?.rate(newRate);
    };

    lenis.on('scroll', onScroll);

    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis, isPlaying]);

  const toggleAudio = () => {
    if (isPlaying) {
      soundRef.current?.pause();
    } else {
      soundRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
      aria-label={isPlaying ? "Mute audio" : "Play audio"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      )}
    </button>
  );
}

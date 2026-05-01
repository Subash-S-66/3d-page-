"use client";

import { useState, useEffect, Suspense } from "react";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import HeroDisc from "@/components/HeroDisc";

// Slices
import Skills from "@/components/slices/Skills";
import Projects from "@/components/slices/Projects";
import Experience from "@/components/slices/Experience";
import Contact from "@/components/slices/Contact";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [retroMode, setRetroMode] = useState(false);
  const [sksShake, setSksShake] = useState(false);

  useEffect(() => {
    let keyBuffer = "";
    const konamiCode = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";
    const sksCode = "sks";

    const handleKey = (e: KeyboardEvent) => {
      keyBuffer += e.key;

      if (keyBuffer.length > 50) keyBuffer = keyBuffer.slice(-50);

      if (keyBuffer.includes(konamiCode)) {
        setRetroMode(true);
        setTimeout(() => setRetroMode(false), 10000);
        keyBuffer = "";
      }

      if (keyBuffer.toLowerCase().includes(sksCode)) {
        setSksShake(true);
        setTimeout(() => setSksShake(false), 2000);
        keyBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 ${retroMode ? 'retro-mode' : ''} ${sksShake ? 'animate-shake' : ''}`}>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      <Cursor />
      <Background />

      {/* Back button when a slice is active */}
      {activeSlice !== null && (
        <button
          onClick={() => setActiveSlice(null)}
          className="fixed top-8 left-8 z-50 text-white border border-white/20 px-6 py-2 rounded-full hover:bg-white/10 transition-colors font-display tracking-wider"
        >
          BACK TO UNIVERSE
        </button>
      )}

      {/* Hero Navigation Hub */}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'} ${activeSlice !== null ? 'opacity-30' : 'opacity-100'}`}>
        <Suspense fallback={null}>
          <HeroDisc onSliceSelect={setActiveSlice} activeSlice={activeSlice} setActiveSlice={setActiveSlice} />
        </Suspense>
      </div>

      {/* Slices Content */}
      <Suspense fallback={null}>
        <Skills isActive={activeSlice === 0} />
      </Suspense>
      <Suspense fallback={null}>
        <Projects isActive={activeSlice === 1} />
      </Suspense>
      <Suspense fallback={null}>
        <Experience isActive={activeSlice === 2} />
      </Suspense>
      <Suspense fallback={null}>
        <Contact isActive={activeSlice === 7} />
      </Suspense>

      {/* Fallback for un-implemented slices in this demo */}
      {[3,4,5,6].includes(activeSlice as number) && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <h1 className="text-6xl font-display font-bold text-white glow-text">Constructing...</h1>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .retro-mode {
          filter: sepia(100%) hue-rotate(90deg) saturate(300%);
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}} />
    </main>
  );
}

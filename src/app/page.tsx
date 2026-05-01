"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import LenisScroll from "@/components/LenisScroll";
import AudioPlayer from "@/components/AudioPlayer";
import Background3D from "@/components/Background3D";
import HeroDisc from "@/components/HeroDisc";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray(".section-wrapper") as HTMLElement[];

    sections.forEach((section) => {
      // Basic fade up and pin for each section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        pin: true,
        pinSpacing: false,
      });

      gsap.fromTo(section,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [loading]);

  return (
    <LenisScroll>
      <CustomCursor />
      <AudioPlayer />
      <Background3D />

      {loading && <Loader onComplete={() => setLoading(false)} />}

      <main className="relative z-10 w-full overflow-hidden" style={{ opacity: loading ? 0 : 1, transition: 'opacity 1s ease-in-out' }}>
        <HeroDisc />

        {/* Sections container to manage ScrollTrigger transitions later */}
        <div ref={containerRef} className="sections-container flex flex-col w-full relative">
          <div className="section-wrapper relative z-[11]"><Skills /></div>
          <div className="section-wrapper relative z-[12]"><Projects /></div>
          <div className="section-wrapper relative z-[13]"><Experience /></div>
          <div className="section-wrapper relative z-[14]"><Contact /></div>
        </div>
      </main>
    </LenisScroll>
  );
}

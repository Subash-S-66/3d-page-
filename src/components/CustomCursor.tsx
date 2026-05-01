"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  // Track idle state
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), 3000);
    };

    window.addEventListener("mousemove", resetIdle);
    return () => {
      window.removeEventListener("mousemove", resetIdle);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: "power2.out",
      });

      // Basic magnetic check (would be expanded in a full impl)
      const target = e.target as HTMLElement;
      if (target?.closest("a, button, [data-magnetic]")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={twMerge(
          clsx(
            "fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-accent1 pointer-events-none z-[9999] mix-blend-screen transition-transform duration-300",
            isHovering && "scale-150 bg-accent1/20 border-accent2",
            isIdle && "opacity-0 scale-0"
          )
        )}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div
        ref={dotRef}
        className={twMerge(
          clsx(
            "fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-accent1 pointer-events-none z-[9999] mix-blend-screen transition-opacity duration-300",
            isIdle && "opacity-0"
          )
        )}
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
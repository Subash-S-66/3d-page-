"use client";

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Reset idle timer
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000);

      // Magnetic pull effect
      const hoveredElement = document.elementFromPoint(mouseX, mouseY);
      let targetX = mouseX;
      let targetY = mouseY;

      if (hoveredElement) {
        const isMagnetic = hoveredElement.closest('button, a, [role="button"]');
        if (isMagnetic) {
          setIsHovering(true);
          const rect = isMagnetic.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Only pull if within 80px radius (approximated by bounding box distance)
          const dist = Math.hypot(centerX - mouseX, centerY - mouseY);
          if (dist < 80) {
            targetX = centerX + (mouseX - centerX) * 0.2;
            targetY = centerY + (mouseY - centerY) * 0.2;
          }
        } else {
          setIsHovering(false);
        }
      }

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      });

      // Trail effect with slower ease
      gsap.to(cursor, {
        x: targetX - 20, // offset by half width
        y: targetY - 20,
        duration: 0.4,
        ease: "power3.out"
      });

      createTrailParticle(mouseX, mouseY);
    };

    const createTrailParticle = (x: number, y: number) => {
      if (Math.random() > 0.3) return; // limit particle creation
      const particle = document.createElement('div');
      particle.className = 'fixed w-1 h-1 bg-accent1 rounded-full pointer-events-none z-50';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      document.body.appendChild(particle);

      gsap.to(particle, {
        y: y + 20 + Math.random() * 20,
        x: x + (Math.random() - 0.5) * 20,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.5,
        ease: "power1.out",
        onComplete: () => particle.remove()
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-accent1 rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-10 h-10 border border-accent1 rounded-full pointer-events-none z-[99] transition-all duration-300 ${isHovering ? 'w-16 h-16 bg-accent1/10 border-accent2' : ''} ${isIdle ? 'opacity-0 scale-150' : 'opacity-100 scale-100'}`}
        style={{
           boxShadow: isHovering ? '0 0 20px rgba(255, 107, 107, 0.4)' : '0 0 10px rgba(110, 231, 247, 0.3)'
        }}
      >
        {isIdle && (
          // Idle dissolve particles (simplified via CSS animation in a real scenario, here we just show/hide)
          <div className="absolute inset-0 flex items-center justify-center animate-ping">
            <div className="w-full h-full border border-white/30 rounded-full"></div>
          </div>
        )}
      </div>
    </>
  );
}

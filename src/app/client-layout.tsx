"use client";

import { useKonamiCode } from "@/hooks/useKonamiCode";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isRetroMode = useKonamiCode();

  return (
    <div
      className={twMerge(
        clsx(
          "w-full h-full min-h-screen bg-primary text-white font-body transition-all duration-1000",
          isRetroMode && "retro-mode bg-black text-[#00FF00] font-mono"
        )
      )}
    >
      {isRetroMode && (
        <div className="fixed inset-0 pointer-events-none z-[99999] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDAsIDI1NSwgMCwgMC4xKSIvPgo8L3N2Zz4=')] mix-blend-screen" />
      )}
      {children}
    </div>
  );
}

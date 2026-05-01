"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

export function useKonamiCode() {
  const [success, setSuccess] = useState(false);
  const [, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      setInput((prev) => {
        const newArray = [...prev, key];
        if (newArray.length > KONAMI_CODE.length) {
          newArray.shift();
        }

        if (newArray.join(",") === KONAMI_CODE.join(",")) {
          setSuccess(true);
          // Auto reset after 10 seconds per requirements
          setTimeout(() => {
            setSuccess(false);
            setInput([]);
          }, 10000);
        }

        return newArray;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return success;
}

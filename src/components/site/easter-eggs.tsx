"use client";

import { useEffect } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

export function EasterEggs() {
  useEffect(() => {
    let idx = 0;

    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[idx];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const match = key === expected || e.key === expected;
      if (!match) {
        idx = 0;
        return;
      }
      idx += 1;
      if (idx === KONAMI.length) {
        idx = 0;
        document.documentElement.classList.add("portfolio-matrix");
        window.setTimeout(() => document.documentElement.classList.remove("portfolio-matrix"), 4200);
      }
    };

    const onWow = () => {
      document.documentElement.classList.add("portfolio-wow");
      window.setTimeout(() => document.documentElement.classList.remove("portfolio-wow"), 900);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:wow", onWow);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:wow", onWow);
    };
  }, []);

  return null;
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function FloatingParticles({ count = 48 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.4 + Math.random() * 1.6,
      d: 12 + Math.random() * 28,
    })),
  );

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-400/25 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{
            duration: p.d,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.id * 0.08,
          }}
        />
      ))}
    </div>
  );
}

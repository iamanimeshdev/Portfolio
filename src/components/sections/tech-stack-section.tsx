"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

export function TechStackSection() {
  const items = siteConfig.techOrbit;

  const orbit = useMemo(() => {
    return items.map((it, idx) => {
      const angle = (idx / items.length) * Math.PI * 2;
      return { ...it, angle };
    });
  }, [items]);

  return (
    <section id="stack" className="relative border-b border-white/10 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(168,85,247,0.16),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold tracking-[0.35em] text-cyan-300/80">TECH STACK</p>
          <h2 className="mt-3 text-balance font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Technologies I work with
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300 md:text-base">
            A curated stack of technologies I use to build scalable applications, AI-powered systems, and modern web experiences.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 h-[420px] max-w-3xl md:h-[480px]">
          <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_65%)]" />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-400/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute left-1/2 top-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-black/40 p-5 text-center shadow-[0_0_80px_rgba(16,185,129,0.12)] backdrop-blur-xl md:w-[260px]">
            <div className="text-xs font-semibold tracking-[0.35em] text-emerald-200/80">CORE</div>
            <div className="mt-2 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-white">
              Full Stack Engineer
            </div>
            <div className="mt-2 text-xs leading-relaxed text-zinc-400">
              AI +  Frontend + backend + cloud.
            </div>
          </div>

          {orbit.map((it, idx) => {
            const r = 165;
            const x = Math.cos(it.angle) * r;
            const y = Math.sin(it.angle) * r;
            return (
              <motion.div
                key={it.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  marginLeft: `${x.toFixed(2)}px`,
                  marginTop: `${y.toFixed(2)}px`,
                }}
                initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
                whileInView={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04, duration: 0.45 }}
              >
                <motion.div
                  className="group relative cursor-default"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6 + idx * 0.25, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div
                    className="rounded-2xl border border-white/10 bg-black/45 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-400/35 group-hover:shadow-[0_0_55px_rgba(16,185,129,0.22)] md:px-4 md:py-2 md:text-sm"
                    style={{
                      boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px ${it.color}22`,
                    }}
                  >
                    {it.name}
                  </div>
                  <div
                    className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at center, ${it.color}55, transparent 60%)`,
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
          {items.map((t) => (
            <motion.span
              key={t.name}
              whileHover={{ y: -2 }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 backdrop-blur-md"
            >
              {t.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

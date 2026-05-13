"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { FloatingParticles } from "@/components/effects/floating-particles";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Api = { username: string; weeks: Day[][]; source: string };

const cell = 12;
const gap = 3;

function levelColor(level: number, active: boolean) {
  const base =
    level <= 0
      ? "rgba(255,255,255,0.04)"
      : level === 1
        ? "rgba(16,185,129,0.18)"
        : level === 2
          ? "rgba(16,185,129,0.32)"
          : level === 3
            ? "rgba(16,185,129,0.52)"
            : "rgba(16,185,129,0.78)";
  if (!active) return base;
  return level <= 0 ? "rgba(16,185,129,0.22)" : base;
}

export function ContributionSnakeSection() {
  const [data, setData] = useState<Api | null>(null);
  const snakeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github/contributions", { cache: "no-store" });
        const json = (await res.json()) as Api;
        if (!cancelled) setData(json);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = useMemo(() => data?.weeks ?? [], [data]);
  const cols = weeks.length ? weeks.length : 53;

  const path = useMemo(() => {
    const p: { w: number; d: number }[] = [];
    for (let w = 0; w < cols; w += 1) {
      const forward = w % 2 === 0;
      const ds = forward ? [0, 1, 2, 3, 4, 5, 6] : [6, 5, 4, 3, 2, 1, 0];
      for (const d of ds) {
        if (weeks[w]?.[d]) p.push({ w, d });
      }
    }
    return p;
  }, [cols, weeks]);

  useEffect(() => {
    if (!snakeRef.current || path.length < 2) return;
    timelineRef.current?.kill();

    const obj = { i: 0 };
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

    tl.to(obj, {
      i: path.length - 1,
      duration: Math.max(18, path.length * 0.05),
      onUpdate: () => {
        const idx = Math.round(obj.i);
        const pt = path[idx];
        if (!pt || !snakeRef.current) return;
        const x = pt.w * (cell + gap);
        const y = pt.d * (cell + gap);
        snakeRef.current.style.transform = `translate(${x}px, ${y}px)`;
      },
    }).to(obj, {
      i: 0,
      duration: Math.max(18, path.length * 0.05),
      onUpdate: () => {
        const idx = Math.round(obj.i);
        const pt = path[idx];
        if (!pt || !snakeRef.current) return;
        const x = pt.w * (cell + gap);
        const y = pt.d * (cell + gap);
        snakeRef.current.style.transform = `translate(${x}px, ${y}px)`;
      },
    });

    timelineRef.current = tl;
    return () => {
      tl.kill();
    };
  }, [path]);

  const sourceLabel =
    data?.source === "github"
      ? "Live GitHub data."
      : "Synthetic preview — add GITHUB_TOKEN for real contributions.";

  return (
    <section id="contributions" className="relative border-b border-white/10 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,185,129,0.16),transparent_60%)]" />
      <FloatingParticles count={32} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background:repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.05)_3px)] mix-blend-overlay" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.35em] text-emerald-300/80">GITHUB FIELD</p>
            <h2 className="text-balance font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Contribution matrix with a neon serpent.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
              A cyberpunk take on the classic contribution graph. The snake glides through your activity heatmap
              while cells gently pulse. {sourceLabel}
            </p>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-100/90">
            USER/{data?.username ?? "…"}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_0_120px_rgba(16,185,129,0.12)] backdrop-blur-xl md:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_55%)]" />
          {!data ? (
            <div className="relative py-16 text-center text-sm text-zinc-400">
              Initializing contribution matrix…
            </div>
          ) : (
            <div className="relative overflow-x-auto pb-2">
              <div
                className="relative mx-auto"
                style={{
                  width: cols * (cell + gap) - gap,
                  height: 7 * (cell + gap) - gap,
                }}
              >
                {weeks.slice(0, cols).map((week, w) =>
                  week.map((day, d) => {
                    const pulse = day.count > 0;
                    return (
                      <div
                        key={`${day.date}-${w}-${d}`}
                        className="absolute rounded-[3px]"
                        style={{
                          width: cell,
                          height: cell,
                          left: w * (cell + gap),
                          top: d * (cell + gap),
                          background: levelColor(day.level, false),
                          boxShadow: pulse ? "0 0 18px rgba(16,185,129,0.12)" : undefined,
                        }}
                      >
                        <motion.div
                          className="h-full w-full rounded-[3px]"
                          animate={{ opacity: pulse ? [0.55, 1, 0.55] : 0.35 }}
                          transition={{
                            duration: 3.2 + (w + d) * 0.02,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{ background: levelColor(day.level, true) }}
                        />
                      </div>
                    );
                  }),
                )}

                <div
                  ref={snakeRef}
                  className="absolute left-0 top-0 h-3 w-3 rounded-full border border-emerald-200/60 bg-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.95),0_0_60px_rgba(16,185,129,0.55)]"
                  style={{ transform: "translate(0px,0px)" }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

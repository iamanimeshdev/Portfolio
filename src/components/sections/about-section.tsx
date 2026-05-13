"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AboutSection() {
  return (
    <section id="about" className="relative border-b border-white/10 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-[conic-gradient(from_120deg,rgba(16,185,129,0.25),transparent,rgba(168,85,247,0.25),transparent)] opacity-70 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/workspace-holographic.png"
                alt="Cyberpunk developer workspace"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-mono text-emerald-200/90 backdrop-blur-md">
                SIGNAL::STABLE
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="space-y-3"
          >
            <p className="text-xs font-semibold tracking-[0.35em] text-emerald-300/80">ABOUT</p>
            <h2 className="text-balance font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Building interfaces that feel like instruments.
            </h2>
            <p className="text-pretty text-base leading-relaxed text-zinc-300 md:text-lg">
              {siteConfig.bio}
            </p>
            <p className="text-sm text-zinc-400">
              Based in {siteConfig.location}. Open to ambitious teams who care about craft, velocity, and
              kind communication.
            </p>
          </motion.div>

          <Separator className="bg-white/10" />

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.35em] text-cyan-300/80">EXPERIENCE</p>
            <div className="space-y-3">
              {siteConfig.experience.map((ex) => (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{ex.company}</div>
                      <div className="text-xs text-zinc-400">{ex.role}</div>
                    </div>
                    <div className="shrink-0 self-start rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-mono text-emerald-200/90">
                      {ex.period}
                    </div>
                  </div>
                  <div className="mt-3 text-xs leading-relaxed text-zinc-300">
                    {ex.summary}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Years coding", value: `${siteConfig.stats.yearsCoding}+` },
              { label: "Projects shipped", value: `${siteConfig.stats.projectsShipped}+` },
              { label: "Technologies", value: `${siteConfig.stats.technologiesCount}+` },
              { label: "Contributions", value: siteConfig.stats.contributionsApprox },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="border-white/10 bg-white/5 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="text-2xl font-semibold text-white">{s.value}</div>
                    <div className="text-xs text-zinc-400">{s.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

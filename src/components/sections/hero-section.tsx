"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, GitBranch, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site-config";
import { AnimatedGrid } from "@/components/effects/animated-grid";
import { FloatingParticles } from "@/components/effects/floating-particles";

const HeroBackdrop3D = dynamic(
  () => import("@/components/three/hero-backdrop-3d").then((m) => m.HeroBackdrop3D),
  { ssr: false },
);

function useTyping(lines: readonly string[]) {
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const line = lines[lineIndex] ?? "";
    if (text.length < line.length) {
      const t = window.setTimeout(() => {
        setText(line.slice(0, text.length + 1));
      }, 28);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      if (lineIndex < lines.length - 1) {
        setLineIndex((i) => i + 1);
        setText("");
      }
    }, 420);
    return () => window.clearTimeout(t);
  }, [text, lineIndex, lines]);

  return { text, lineIndex };
}

export function HeroSection() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${smx}px ${smy}px, rgba(16,185,129,0.22), transparent 55%)`;

  const typing = useTyping(siteConfig.heroTerminalLines);
  const [pillIndex, setPillIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPillIndex((i) => (i + 1) % siteConfig.rotatingStack.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  const activePills = useMemo(() => {
    const arr = [...siteConfig.rotatingStack];
    return [arr[pillIndex], arr[(pillIndex + 1) % arr.length], arr[(pillIndex + 3) % arr.length]];
  }, [pillIndex]);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[calc(100dvh-5rem)] flex-col justify-center overflow-hidden border-b border-white/10 py-20 md:min-h-[calc(100dvh-4.5rem)] md:py-24"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#030708]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ backgroundImage: spotlight }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.18),transparent_55%)]" />
      <AnimatedGrid />
      <FloatingParticles count={56} />
      <div className="pointer-events-none absolute inset-0">
        <HeroBackdrop3D />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-6 text-center md:gap-12">
        <div className="flex w-full flex-col items-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <motion.h1
              className="text-balance font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold tracking-tight text-white md:text-6xl"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.045, delayChildren: 0.05 },
                },
              }}
            >
              {siteConfig.name
                .split(/\s+/)
                .filter(Boolean)
                .map((word, idx) => (
                  <span key={`${word}-${idx}`} className="inline-block overflow-hidden pr-2">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: "120%", rotate: 2 },
                        show: {
                          y: "0%",
                          rotate: 0,
                          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-purple-300 bg-clip-text text-lg font-medium text-transparent md:text-2xl">
                {siteConfig.role}
              </span>
              <Badge className="border border-white/10 bg-white/5 text-emerald-100/90">
                Available for select collaborations
              </Badge>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.65 }}
              className="mx-auto max-w-xl text-pretty text-base leading-relaxed text-zinc-300 md:text-lg"
            >
              {siteConfig.tagline}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex w-full max-w-lg flex-wrap justify-center gap-2"
          >
            {activePills.map((p, i) => (
              <motion.div key={`${p}-${i}`} layout>
                <Badge variant="outline" className="border-emerald-400/25 bg-emerald-500/10 text-emerald-100">
                  {p}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65 }}
            className="flex w-full max-w-2xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden border border-emerald-400/30 bg-gradient-to-r from-emerald-500/25 via-cyan-500/20 to-purple-500/25 text-white shadow-[0_0_40px_rgba(16,185,129,0.18)] backdrop-blur-md sm:min-w-[11rem]"
            >
              <Link href="#projects" className="inline-flex items-center justify-center">
                View projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/15 bg-white/5 backdrop-blur-md sm:min-w-[11rem]"
            >
              <Link
                href={`https://github.com/${siteConfig.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center"
              >
                <GitBranch className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-zinc-200 hover:text-white sm:min-w-[11rem]"
            >
              <Link href="#contact" className="inline-flex items-center justify-center">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.65 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_40%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background:repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.04)_3px)]" />
            <div className="relative flex items-start gap-3 font-mono text-xs text-emerald-100/90 md:text-sm">
              <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <div className="min-h-[4.5rem] w-full">
                <div className="text-zinc-500">
                  {siteConfig.heroTerminalLines.slice(0, typing.lineIndex).map((l, i) => (
                    <div key={`${i}-${l}`}>{l}</div>
                  ))}
                </div>
                <div>
                  <span className="text-emerald-200">{typing.text}</span>
                  <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-emerald-300/80 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

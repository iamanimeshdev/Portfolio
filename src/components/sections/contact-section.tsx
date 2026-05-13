"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { motion } from "framer-motion";
import { Check, Copy, GitBranch, Network, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/site-config";

type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const CELL = 12;
const GAP = 3;

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

function buildSyntheticContributionWeeks(seed: number, columnCount = 53): ContributionDay[][] {
  let state = seed >>> 0;
  const rnd = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const weeks: ContributionDay[][] = [];
  const totalDays = columnCount * 7;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - totalDays + 1);

  let dayOffset = 0;
  for (let w = 0; w < columnCount; w += 1) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d += 1) {
      const r = rnd();
      const level = (r < 0.4 ? 0 : r < 0.62 ? 1 : r < 0.78 ? 2 : r < 0.9 ? 3 : 4) as 0 | 1 | 2 | 3 | 4;
      const count = level === 0 ? 0 : Math.max(1, Math.floor(level * 4 * rnd()));
      const dt = new Date(start);
      dt.setUTCDate(dt.getUTCDate() + dayOffset);
      dayOffset += 1;
      week.push({
        date: dt.toISOString().slice(0, 10),
        count,
        level,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

function ContactActivityMatrix() {
  const weeks = useMemo(() => buildSyntheticContributionWeeks(0x9e3779b9), []);
  const cols = weeks.length;
  const snakeRef = useRef<HTMLDivElement>(null);

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

    const obj = { i: 0 };
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

    tl.to(obj, {
      i: path.length - 1,
      duration: Math.max(18, path.length * 0.05),
      onUpdate: () => {
        const idx = Math.round(obj.i);
        const pt = path[idx];
        if (!pt || !snakeRef.current) return;
        const x = pt.w * (CELL + GAP);
        const y = pt.d * (CELL + GAP);
        snakeRef.current.style.transform = `translate(${x}px, ${y}px)`;
      },
    }).to(obj, {
      i: 0,
      duration: Math.max(18, path.length * 0.05),
      onUpdate: () => {
        const idx = Math.round(obj.i);
        const pt = path[idx];
        if (!pt || !snakeRef.current) return;
        const x = pt.w * (CELL + GAP);
        const y = pt.d * (CELL + GAP);
        snakeRef.current.style.transform = `translate(${x}px, ${y}px)`;
      },
    });

    return () => {
      tl.kill();
    };
  }, [path]);

  return (
    <div id="activity-matrix" className="relative flex scroll-mt-28 justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-5 shadow-[0_0_120px_rgba(16,185,129,0.1)] backdrop-blur-xl md:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_55%)]" />
        <div className="relative overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
          <div
            className="relative mx-auto min-w-0"
            style={{
              width: cols * (CELL + GAP) - GAP,
              height: 7 * (CELL + GAP) - GAP,
            }}
          >
            {weeks.map((week, w) =>
              week.map((day, d) => {
                const pulse = day.count > 0;
                return (
                  <div
                    key={`${day.date}-${w}-${d}`}
                    className="absolute rounded-[3px]"
                    style={{
                      width: CELL,
                      height: CELL,
                      left: w * (CELL + GAP),
                      top: d * (CELL + GAP),
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
      </motion.div>
    </div>
  );
}

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentViaMailto, setSentViaMailto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setError(null);
    setSent(false);
    setSentViaMailto(false);
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        code?: string;
        error?: string;
      };

      if (res.ok && data.ok) {
        form.reset();
        setSent(true);
        window.setTimeout(() => setSent(false), 5000);
        return;
      }

      if (res.status === 503 && data.code === "MAIL_NOT_CONFIGURED") {
        const subject = encodeURIComponent(`Inquiry from ${name}`);
        const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
        window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
        setSent(true);
        setSentViaMailto(true);
        window.setTimeout(() => {
          setSent(false);
          setSentViaMailto(false);
        }, 6000);
        return;
      }

      setError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl space-y-20 px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="space-y-5"
          >
            <p className="text-xs font-semibold tracking-[0.35em] text-emerald-300/80">CONTACT</p>
            <h2 className="text-balance font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Let&apos;s build something that feels inevitable.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
              Tell me about the problem space, constraints, and what success looks like. I typically reply within
              48 hours.
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/45 p-4 font-mono text-xs text-emerald-100/90 shadow-[0_0_60px_rgba(16,185,129,0.12)] backdrop-blur-xl md:text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-400">STATUS</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.9)]" />
                  ONLINE · ACCEPTING SELECT INQUIRIES
                </span>
              </div>
              <div className="mt-3 text-zinc-500">
                {">"} queue priority: ambitious product teams, technical founders, design partners.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={copyEmail}
                className="border-white/15 bg-white/5 backdrop-blur-md"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied" : "Copy email"}
              </Button>
              <Button asChild variant="outline" className="border-white/15 bg-white/5 backdrop-blur-md">
                <Link href={`https://github.com/${siteConfig.githubUsername}`} target="_blank" rel="noreferrer">
                  <GitBranch className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/15 bg-white/5 backdrop-blur-md">
                <Link href={siteConfig.linkedinUrl} target="_blank" rel="noreferrer">
                  <Network className="mr-2 h-4 w-4" />
                  LinkedIn
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.05 }}
            onSubmit={onSubmit}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_120px_rgba(34,211,238,0.08)] backdrop-blur-xl md:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(168,85,247,0.18),transparent_55%)]" />
            <div className="relative space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-200">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Ada Lovelace"
                  className="border-white/10 bg-black/40 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-200">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="border-white/10 bg-black/40 text-white placeholder:text-zinc-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-zinc-200">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="What are we building, and why now?"
                  className="border-white/10 bg-black/40 text-white placeholder:text-zinc-600"
                />
              </div>

              {error ? (
                <p className="text-sm text-red-300" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={sending}
                className="group relative w-full overflow-hidden border border-emerald-400/25 bg-gradient-to-r from-emerald-500/25 via-cyan-500/20 to-purple-500/25 text-white shadow-[0_0_60px_rgba(16,185,129,0.15)]"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  {sending
                    ? "Sending…"
                    : sent
                      ? sentViaMailto
                        ? "Opening mail app…"
                        : "Message sent"
                      : "Send message"}
                </span>
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ translateX: sending ? ["-120%", "120%"] : "-120%" }}
                  transition={{ duration: 1.1, repeat: sending ? Infinity : 0, ease: "linear" }}
                />
              </Button>
            </div>

            <div className="pointer-events-none absolute -right-16 -top-16 opacity-40">
              <Sparkles className="h-40 w-40 text-cyan-300 blur-sm" />
            </div>
          </motion.form>
        </div>

        <ContactActivityMatrix />
      </div>
    </section>
  );
}

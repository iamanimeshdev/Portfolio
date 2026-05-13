"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Copy, GitBranch, MessageCircle, Network, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/lib/site-config";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);
  }

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
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
            Tell me about the problem space, constraints, and what success looks like. I typically reply
            within 48 hours.
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
            <Button asChild variant="outline" className="border-white/15 bg-white/5 backdrop-blur-md">
              <Link href={siteConfig.twitterUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Twitter / X
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

            <Button
              type="submit"
              disabled={sending}
              className="group relative w-full overflow-hidden border border-emerald-400/25 bg-gradient-to-r from-emerald-500/25 via-cyan-500/20 to-purple-500/25 text-white shadow-[0_0_60px_rgba(16,185,129,0.15)]"
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                {sending ? "Encrypting payload…" : sent ? "Received (demo)" : "Send transmission"}
              </span>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ translateX: sending ? ["-120%", "120%"] : "-120%" }}
                transition={{ duration: 1.1, repeat: sending ? Infinity : 0, ease: "linear" }}
              />
            </Button>

            <p className="text-xs text-zinc-500">
              This demo form animates a send state. Wire it to your provider (Resend, Formspark, custom API)
              when you are ready to go live.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 opacity-40">
            <Sparkles className="h-40 w-40 text-cyan-300 blur-sm" />
          </div>
        </motion.form>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";

/** Expandable case-study timeline used inside the unified Projects section. */
export function ProjectDeepDivesTimeline() {
  const [openId, setOpenId] = useState<string | null>(siteConfig.detailedProjects[0]?.id ?? null);

  return (
    <div className="relative md:pl-8">
      <div className="absolute left-[11px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-emerald-400/70 via-cyan-400/40 to-purple-500/40 md:block" />
      <div className="space-y-5">
        {siteConfig.detailedProjects.map((proj, idx) => {
          const open = openId === proj.id;
          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.06, duration: 0.55 }}
              className="relative md:pl-10"
            >
              <div className="absolute left-0 top-5 hidden h-3 w-3 rounded-full border border-emerald-300/60 bg-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.55)] md:block" />
              <button
                type="button"
                onClick={() => setOpenId(open ? null : proj.id)}
                className="flex w-full items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 text-left shadow-[0_0_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors hover:border-emerald-400/25"
              >
                <div className="flex-1 pr-4">
                  <div className="text-base font-semibold text-white">{proj.name}</div>
                  <div className="mt-1 text-sm text-zinc-300">{proj.role}</div>
                  <div className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-mono text-zinc-300">
                    {proj.period}
                  </div>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 text-sm leading-relaxed text-zinc-300 backdrop-blur-md">
                      <ul className="ml-4 list-disc space-y-2 text-zinc-300">
                        {Array.isArray(proj.summary) ? (
                          proj.summary.map((point, i) => <li key={i}>{point}</li>)
                        ) : (
                          <li>{proj.summary}</li>
                        )}
                      </ul>

                      {proj.githubUrl ? (
                        <div className="mt-5">
                          <Link
                            href={proj.githubUrl}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-white/10 hover:text-emerald-200"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View repository
                          </Link>
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {proj.stack.map((s) => (
                          <Badge key={s} variant="outline" className="border-white/10 bg-black/30 text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

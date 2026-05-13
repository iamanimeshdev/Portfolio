"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TerminalSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepo } from "@/lib/github";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialRepos: GitHubRepo[];
};

export function RepoExplorerDialog({ open, onOpenChange, initialRepos }: Props) {
  const [query, setQuery] = useState("");
  const dq = useDeferredValue(query.trim().toLowerCase());
  const [fetchedRepos, setFetchedRepos] = useState<GitHubRepo[] | null>(null);

  const repos = fetchedRepos ?? initialRepos;

  useEffect(() => {
    if (!open) return;
    if (repos.length) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github/repos", { cache: "no-store" });
        const json = (await res.json()) as { repos?: GitHubRepo[] };
        if (!cancelled) setFetchedRepos(json.repos ?? []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, repos.length]);

  const filtered = useMemo(() => {
    if (!dq) return repos;
    return repos.filter((r) => {
      const blob = `${r.name} ${r.description ?? ""} ${r.language ?? ""} ${r.topics.join(" ")}`.toLowerCase();
      return blob.includes(dq);
    });
  }, [repos, dq]);

  const lazyRepos = useMemo(() => filtered.slice(0, 80), [filtered]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90dvh,920px)] w-full max-w-[min(56rem,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden border border-white/10 bg-[#05070a]/95 p-0 text-white shadow-[0_0_120px_rgba(16,185,129,0.12)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background:repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(255,255,255,0.04)_3px)]" />
        <DialogHeader className="relative shrink-0 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
          <DialogTitle className="flex items-center gap-2 pr-10 font-[family-name:var(--font-space-grotesk)] text-lg sm:text-xl">
            <TerminalSquare className="h-5 w-5 shrink-0 text-emerald-300" />
            My GitHub work
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            A live list from my public profile—search by project name, topic, or language to find something
            specific.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-0 min-w-0 flex-1 space-y-4 overflow-hidden px-4 py-4 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search my repositories…"
              className="border-white/10 bg-black/40 pl-10 font-mono text-sm text-emerald-50 placeholder:text-zinc-600"
            />
          </div>

          <ScrollArea className="h-[min(55vh,520px)] max-w-full min-w-0">
            <div className="space-y-2 pb-2 pr-1">
              <AnimatePresence initial={false}>
                {lazyRepos.map((r, idx) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: Math.min(idx * 0.012, 0.25), duration: 0.25 }}
                    className="group min-w-0 max-w-full overflow-hidden rounded-xl border border-white/10 bg-black/35 p-3 backdrop-blur-md transition-colors hover:border-emerald-400/25 hover:bg-emerald-500/[0.06] sm:p-4"
                  >
                    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={r.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="min-w-0 break-all font-mono text-sm text-white underline-offset-4 hover:text-emerald-200 hover:underline sm:break-normal sm:truncate"
                          >
                            {r.full_name}
                          </Link>
                          <Badge variant="outline" className="border-white/10 text-[11px] text-zinc-300">
                            {r.language ?? "—"}
                          </Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{r.description ?? "No description."}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.topics.slice(0, 6).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-row items-center gap-2 md:flex-col md:items-end md:justify-end">
                        <div className="whitespace-nowrap text-[11px] font-mono text-zinc-500">
                          {new Date(r.pushed_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!lazyRepos.length ? (
                <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-zinc-400">
                  Nothing matches that search. Try another keyword.
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

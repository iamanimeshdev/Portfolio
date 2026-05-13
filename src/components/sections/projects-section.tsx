"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, GitBranch, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";
import type { GitHubRepo } from "@/lib/github";
import { RepoExplorerDialog } from "@/components/sections/repo-explorer-dialog";

type ApiResponse = { username: string; repos: GitHubRepo[]; error?: string };

export function ProjectsSection() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github/repos", { cache: "no-store" });
        const json = (await res.json()) as ApiResponse;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData({ username: siteConfig.githubUsername, repos: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(() => {
    const repos = data?.repos ?? [];
    const wanted = new Set<string>(siteConfig.featuredRepoNames);
    const picked = repos.filter((r) => wanted.has(r.name));
    if (picked.length) return picked;
    return repos.slice(0, 3);
  }, [data?.repos]);

  const user = data?.username ?? siteConfig.githubUsername;

  return (
    <section id="projects" className="relative border-b border-white/10 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(168,85,247,0.14),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.35em] text-purple-300/80">PROJECTS</p>
            <h2 className="text-balance font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Repositories engineered like products.
            </h2>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300 md:text-base">
              Featured workstreams pulled live from GitHub. Hover to deploy context: demos, stars, and the
              languages that power each build.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            Live data · {user}
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {featured.map((repo, idx) => (
              <motion.div
                key={repo.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard repo={repo} username={user} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!featured.length ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-300 backdrop-blur-md">
            Could not load repositories{data?.error ? ` (${data.error})` : ""}. Set{" "}
            <span className="font-mono text-emerald-200">NEXT_PUBLIC_GITHUB_USERNAME</span> and optionally{" "}
            <span className="font-mono text-emerald-200">GITHUB_TOKEN</span> for higher rate limits.
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="mt-12 flex justify-center"
        >
          <Button
            type="button"
            size="lg"
            onClick={() => setExplorerOpen(true)}
            className="border border-cyan-400/25 bg-gradient-to-r from-cyan-500/15 via-emerald-500/15 to-purple-500/15 text-white shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-md"
          >
            Explore More Repositories
          </Button>
        </motion.div>
      </div>

      <RepoExplorerDialog open={explorerOpen} onOpenChange={setExplorerOpen} initialRepos={data?.repos ?? []} />
    </section>
  );
}

function ProjectCard({ repo, username }: { repo: GitHubRepo; username: string }) {
  const og = `https://opengraph.githubassets.com/1/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}`;
  const demo =
    siteConfig.repoDemoUrls[repo.name as keyof typeof siteConfig.repoDemoUrls] ??
    repo.homepage ??
    repo.html_url;

  return (
    <Card className="group relative overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.18),transparent_55%)]" />
      </div>
      <div className="relative h-44 w-full overflow-hidden border-b border-white/10">
        <Image src={og} alt="" fill className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge className="border border-white/10 bg-black/50 text-white/90 backdrop-blur-md">{repo.language ?? "Repo"}</Badge>
        </div>
      </div>
      <CardContent className="relative space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold text-white">{repo.name}</div>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{repo.description ?? "No description provided."}</p>
          </div>
          <div className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-xs font-mono text-emerald-100">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {repo.stargazers_count}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(repo.topics?.length ? repo.topics.slice(0, 4) : ["code", "engineering"]).map((t) => (
            <Badge key={t} variant="outline" className="border-white/10 bg-black/30 text-xs text-zinc-200">
              {t}
            </Badge>
          ))}
        </div>

        <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <Button asChild size="sm" className="flex-1 bg-emerald-500/15 text-white hover:bg-emerald-500/25">
              <Link href={demo} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1 border-white/15 bg-white/5">
              <Link href={repo.html_url} target="_blank" rel="noreferrer">
                <GitBranch className="mr-2 h-4 w-4" />
                GitHub Repo
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-emerald-400/25" />
    </Card>
  );
}

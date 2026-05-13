"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "@/components/layout/site-header";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { NoiseOverlay } from "@/components/effects/noise-overlay";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { PageLoader } from "@/components/site/page-loader";
import { CommandPalette } from "@/components/site/command-palette";
import { EasterEggs } from "@/components/site/easter-eggs";

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <ScrollProgress />
      <CommandPalette />
      <EasterEggs />
      <CursorGlow />
      <NoiseOverlay />
      <SiteHeader />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-screen flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}

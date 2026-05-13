import { PortfolioShell } from "@/components/site/portfolio-shell";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <PortfolioShell>
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <FeaturedProjectsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <footer className="border-t border-white/10 py-10 text-center text-xs text-zinc-500">
        Built with Next.js, Framer Motion, and GSAP. Designed like a premium SaaS launch.
      </footer>
    </PortfolioShell>
  );
}

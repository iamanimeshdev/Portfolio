"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { GitBranch, Layers, Mail, TerminalSquare } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const sections = [
  { id: "hero", label: "Hero", hint: "Top" },
  { id: "about", label: "About", hint: "Profile" },
  { id: "stack", label: "Tech stack", hint: "Skills" },
  { id: "projects", label: "Projects", hint: "Case studies & repos" },
  { id: "activity-matrix", label: "Activity matrix", hint: "Visualization" },
  { id: "contact", label: "Contact", hint: "Reach out" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("portfolio:command", onOpen);
    return () => window.removeEventListener("portfolio:command", onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        const t = e.target as HTMLElement | null;
        if (t?.closest("input, textarea, [contenteditable=true]")) return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-xl">
        <CommandInput placeholder="Jump to section, open link, run vibe check…" />
        <CommandList className="max-h-[min(60vh,520px)]">
          <CommandEmpty>No results. Try a different query.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {sections.map((s) => (
              <CommandItem
                key={s.id}
                value={`${s.label} ${s.hint}`}
                onSelect={() => {
                  scrollToId(s.id);
                  setOpen(false);
                }}
              >
                <Layers className="mr-2 h-4 w-4 text-emerald-300" />
                <span>{s.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {s.hint}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Links">
            <CommandItem
              value="github profile"
              onSelect={() => {
                window.open(
                  `https://github.com/${siteConfig.githubUsername}`,
                  "_blank",
                );
                setOpen(false);
              }}
            >
              <GitBranch className="mr-2 h-4 w-4" />
              GitHub profile
            </CommandItem>
            <CommandItem
              value="contact email"
              onSelect={() => {
                scrollToId("contact");
                setOpen(false);
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </CommandItem>
            <CommandItem
              value="terminal easter egg"
              onSelect={() => {
                scrollToId("hero");
                setOpen(false);
              }}
            >
              <TerminalSquare className="mr-2 h-4 w-4" />
              Hero terminal
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

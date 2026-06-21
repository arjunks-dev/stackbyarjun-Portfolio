"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Command,
  FileText,
  FolderOpen,
  Home,
  Mail,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const commands = [
  { id: "home", label: "Go to Home", icon: Home, action: "/" },
  { id: "about", label: "About Section", icon: User, action: "/#about" },
  { id: "projects", label: "Projects Section", icon: FolderOpen, action: "/#projects" },
  { id: "contact", label: "Contact Section", icon: Mail, action: "/#contact" },
  { id: "settings", label: "Theme Settings", icon: Settings, action: "settings" },
  { id: "resume", label: "View Resume", icon: FileText, action: "/resume" },
];

export function CommandPalette({
  onOpenSettings,
}: {
  onOpenSettings: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );

  const execute = useCallback(
    (action: string) => {
      setOpen(false);
      setQuery("");
      if (action === "settings") {
        onOpenSettings();
      } else if (action.startsWith("/#")) {
        const el = document.querySelector(action.slice(1));
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(action);
      }
    },
    [onOpenSettings, router],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-[20%] z-[151] w-full max-w-lg -translate-x-1/2 px-4"
          >
            <div className="glass overflow-hidden rounded-xl shadow-lift">
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent py-4 text-sm text-foreground placeholder:text-muted focus:outline-none"
                  aria-label="Command palette search"
                />
                <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-muted">
                  ESC
                </kbd>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd.action)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    <cmd.icon className="h-4 w-4" />
                    {cmd.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-muted">No results found.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

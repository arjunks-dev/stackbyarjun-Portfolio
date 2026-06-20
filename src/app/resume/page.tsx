import Link from "next/link";
import { X } from "lucide-react";
import { getPersonalInfo } from "@/lib/content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Resume",
  description: "View and download professional resume.",
  path: "/resume",
});

export default function ResumePage() {
  const personal = getPersonalInfo();

  return (
    <main className="min-h-screen pt-[var(--header-height)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold">Resume</h1>
          <div className="flex items-center gap-3">
            <a
              href={personal.resume}
              download
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110"
            >
              Download PDF
            </a>
            <Link
              href="/#about"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
              aria-label="Close resume and return to about section"
            >
              <X className="h-4 w-4" />
              Close
            </Link>
          </div>
        </div>
        <div className="glass overflow-hidden rounded-xl">
          <iframe
            src={personal.resume}
            title="Resume"
            className="h-[calc(100vh-200px)] w-full"
          />
        </div>
      </div>
    </main>
  );
}

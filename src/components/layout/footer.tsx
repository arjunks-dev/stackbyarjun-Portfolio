import { Heart } from "lucide-react";
import type { SocialLink } from "@/types";
import { getSocialIcon } from "@/lib/icons";

export function Footer({
  socialLinks,
  name,
}: {
  socialLinks: SocialLink[];
  name: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-lg font-bold">{name}</p>
            <p className="mt-1 text-sm text-muted">System Admin · Networking · Cybersecurity · SOC</p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.icon);
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {year} {name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted">
            Built with <Heart className="h-3.5 w-3.5 text-red-500" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

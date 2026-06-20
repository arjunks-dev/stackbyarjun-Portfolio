"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { getSocialIcon } from "@/lib/icons";
import type { SocialLink } from "@/types";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      getResponse: (widgetId: string) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactSection({ socialLinks }: { socialLinks: SocialLink[] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const interval = window.setInterval(() => {
      if (window.turnstile) {
        renderWidget();
        window.clearInterval(interval);
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      let turnstileToken: string | undefined;
      if (turnstileSiteKey && widgetIdRef.current && window.turnstile) {
        turnstileToken = window.turnstile.getResponse(widgetIdRef.current);
        if (!turnstileToken) {
          setStatus("error");
          setErrorMessage("Please complete the security check.");
          return;
        }
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message.");
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send. Please try emailing directly.");
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            label="Contact"
            title="Let's Work Together"
            description="Have a project in mind? I'd love to hear from you."
          />
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <div className="space-y-6">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.icon);
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-white/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted">{link.platform}</p>
                      <p className="font-medium">{link.label}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <form onSubmit={handleSubmit} className="glass space-y-4 rounded-xl p-6">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
                  Name
                </label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  className="glass w-full resize-none rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              {turnstileSiteKey && <div ref={turnstileRef} className="min-h-[65px]" />}

              <MagneticButton className="w-full">
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4" />
                </Button>
              </MagneticButton>

              {status === "success" && (
                <p className="text-center text-sm text-green-400">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-red-400">
                  {errorMessage || "Failed to send. Please try emailing directly."}
                </p>
              )}
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

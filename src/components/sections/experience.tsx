"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ChevronDown } from "lucide-react";
import { useState } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeader } from "@/components/ui/section-header";
import { cn, formatDate } from "@/lib/utils";
import type { Experience } from "@/types";

function ExperienceCard({ item, index }: { item: Experience; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails =
    Boolean(item.description) || item.highlights.length > 0 || item.technologies.length > 0;

  return (
    <FadeIn delay={index * 0.1}>
      <div
        className={`relative mb-12 flex flex-col md:flex-row ${
          index % 2 === 0 ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="hidden w-1/2 md:block" />
        <motion.div
          whileInView={{ scale: [0, 1.2, 1] }}
          viewport={{ once: true }}
          className="absolute left-8 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-accent bg-background md:left-1/2"
        >
          <Briefcase className="h-2 w-2 text-accent" />
        </motion.div>

        <div className="ml-16 w-full md:ml-0 md:w-1/2 md:px-8">
          <div className="glass rounded-xl p-6 shadow-card transition-shadow hover:shadow-lift">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg font-semibold text-accent">{item.company}</p>
                <h3 className="mt-1 font-medium text-foreground">{item.role}</h3>
              </div>
              {item.current && (
                <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                  Current
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-muted">{item.location}</p>
            <p className="mt-1 text-sm text-muted">
              {formatDate(item.startDate)}
              {" — "}
              {item.current ? "Present" : formatDate(item.endDate)}
            </p>

            {hasDetails && (
              <>
                <button
                  type="button"
                  onClick={() => setExpanded((open) => !open)}
                  aria-expanded={expanded}
                  className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  <span>{expanded ? "Hide details" : "View details"}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        {item.description && (
                          <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                        )}
                        {item.highlights.length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {item.highlights.map((h) => (
                              <li key={h} className="flex items-start gap-2 text-sm text-muted">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section id="experience" className="relative bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            label="Experience"
            title="Professional Journey"
            description="Building impactful solutions across diverse industries and teams."
          />
        </FadeIn>

        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-accent via-accent-secondary to-transparent md:left-1/2" />

          {experience.map((item, index) => (
            <ExperienceCard key={item.slug} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

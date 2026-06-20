"use client";

import { Download } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { useCountUp } from "@/hooks/use-count-up";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import type { PersonalInfo } from "@/types";

function StatCounter({ end, label }: { end: number; label: string }) {
  const { count, ref } = useCountUp({ end });
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        {count}
        <span className="text-accent">+</span>
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export function AboutSection({ personal }: { personal: PersonalInfo }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="about" ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            label="About Me"
            title="Crafting Digital Excellence"
            description={personal.experienceSummary}
          />
        </FadeIn>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="left">
            <motion.div style={{ y: imageY }} className="mx-auto w-fit max-w-md">
              <img
                src={personal.avatar}
                alt={personal.name}
                className="block h-auto max-h-[32rem] w-auto max-w-full rounded-2xl object-contain"
              />
            </motion.div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted">{personal.bio}</p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {personal.location}
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <StatCounter end={personal.yearsOfExperience} label="Years Experience" />
                <StatCounter end={personal.projectsCompleted} label="Projects Done" />
                <StatCounter end={personal.technologiesCount} label="Technologies" />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href={personal.resume} download>
                  <Button>
                    <Download className="h-4 w-4" />
                    Download Resume
                  </Button>
                </a>
                <a href="/resume">
                  <Button variant="outline">View Resume</Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

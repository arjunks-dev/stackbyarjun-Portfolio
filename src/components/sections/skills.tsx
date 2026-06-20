"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import type { Skill, SkillCategory } from "@/types";

const categories: { id: SkillCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sysadmin", label: "System Admin" },
  { id: "networking", label: "Networking" },
  { id: "cybersecurity", label: "Cybersecurity / SOC" },
  { id: "development", label: "Development" },
];

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState<SkillCategory | "all">("all");

  const filtered =
    active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="relative bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            label="Skills"
            title="Technical Expertise"
            description="Core competencies across infrastructure, security operations, and foundational development."
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  active === cat.id
                    ? "bg-accent text-white shadow-glow"
                    : "glass text-muted hover:text-foreground",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <StaggerContainer key={active} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-muted">
              No skills in this category yet.
            </p>
          ) : (
            filtered.map((skill) => (
              <StaggerItem key={`${active}-${skill.name}`}>
              <Card className="group relative overflow-hidden" glow>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">{skill.name}</h3>
                    <span className="text-xs text-muted">{skill.proficiency}%</span>
                  </div>
                  {skill.description && (
                    <p className="mt-2 text-sm text-muted">{skill.description}</p>
                  )}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary"
                    />
                  </div>
                </div>
              </Card>
            </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}

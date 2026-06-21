import { getProjects } from "@/lib/content";
import { getSiteUrl } from "@/lib/utils";

export type SiteNodeType = "home" | "resume" | "project";

export interface SiteNode {
  id: string;
  path: string;
  type: SiteNodeType;
  title: string;
  description: string;
  image?: string;
  date?: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}

function absUrl(path: string): string {
  return `${getSiteUrl()}${path}`;
}

export function getSiteNodes(): SiteNode[] {
  const projects = getProjects();

  return [
    {
      id: "home",
      path: "/",
      type: "home",
      title: "ARJUN K S | Professional Portfolio",
      description:
        "Portfolio of a System Administrator and SOC-focused IT professional — networking, cybersecurity, and beginner Python & JavaScript projects.",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      id: "resume",
      path: "/resume",
      type: "resume",
      title: "Resume",
      description: "View and download professional resume.",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      id: `project-${project.slug}`,
      path: `/projects/${project.slug}`,
      type: "project" as const,
      title: project.title,
      description: project.description,
      image: project.coverImage,
      date: project.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

export function getSiteNodeByPath(path: string): SiteNode | undefined {
  return getSiteNodes().find((node) => node.path === path);
}

export function getSitemapEntries() {
  const siteUrl = getSiteUrl();

  return getSiteNodes().map((node) => ({
    url: absUrl(node.path),
    lastModified: node.date ? new Date(node.date) : new Date(),
    changeFrequency: node.changeFrequency,
    priority: node.priority,
  }));
}

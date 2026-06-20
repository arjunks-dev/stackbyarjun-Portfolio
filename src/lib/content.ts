import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type {
  BlogPost,
  Certification,
  Experience,
  PersonalInfo,
  Project,
  Skill,
  SocialLink,
} from "@/types";
import { normalizeDate, slugify } from "@/lib/utils";

const contentDir = path.join(process.cwd(), "content");

function fileSlug(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

function resolveSlug(filename: string, data: Record<string, unknown>): string {
  const fromFrontmatter = data.slug as string | undefined;
  if (fromFrontmatter?.trim()) return slugify(fromFrontmatter);
  return slugify(fileSlug(filename));
}

function readMarkdownFiles<T>(
  dir: string,
  transform: (slug: string, data: Record<string, unknown>, content: string) => T,
): T[] {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(fullPath, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = resolveSlug(file, data as Record<string, unknown>);
      return transform(slug, data as Record<string, unknown>, content);
    })
    .sort((a, b) => {
      const dateA = normalizeDate((a as { date?: unknown }).date);
      const dateB = normalizeDate((b as { date?: unknown }).date);
      return dateB.localeCompare(dateA);
    });
}

export function getPersonalInfo(): PersonalInfo {
  const filePath = path.join(contentDir, "personal", "info.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PersonalInfo;
}

export function getSocialLinks(): SocialLink[] {
  const filePath = path.join(contentDir, "social", "links.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as { links: SocialLink[] };
  return data.links;
}

export function getContactEmail(socialLinks: SocialLink[]): string | undefined {
  const emailLink = socialLinks.find(
    (link) => link.icon === "email" || link.url.toLowerCase().startsWith("mailto:"),
  );
  if (!emailLink) return undefined;
  return emailLink.url.replace(/^mailto:/i, "");
}

export function getSkills(): Skill[] {
  const filePath = path.join(contentDir, "skills", "skills.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as { skills: Skill[] };
  return data.skills;
}

export function getProjects(): Project[] {
  return readMarkdownFiles<Project>("projects", (slug, data, content) => ({
    slug,
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    coverImage: (data.coverImage as string) || "",
    techStack: (data.techStack as string[]) || [],
    githubUrl: data.githubUrl as string | undefined,
    liveUrl: data.liveUrl as string | undefined,
    featured: Boolean(data.featured),
    date: normalizeDate(data.date),
    body: content,
  }));
}

export function getProjectBySlug(slug: string): Project | undefined {
  const normalized = slugify(slug);
  return getProjects().find((p) => p.slug === normalized);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getExperience(): Experience[] {
  return readMarkdownFiles<Experience>("experience", (slug, data) => ({
    slug,
    company: (data.company as string) || "",
    role: (data.role as string) || "",
    location: (data.location as string) || "",
    startDate: normalizeDate(data.startDate),
    endDate: normalizeDate(data.endDate),
    current: Boolean(data.current),
    description: (data.description as string) || "",
    highlights: (data.highlights as string[]) || [],
    technologies: (data.technologies as string[]) || [],
  })).sort((a, b) => normalizeDate(b.startDate).localeCompare(normalizeDate(a.startDate)));
}

export function getCertifications(): Certification[] {
  return readMarkdownFiles<Certification>("certifications", (slug, data) => ({
    slug,
    name: (data.name as string) || "",
    issuer: (data.issuer as string) || "",
    date: normalizeDate(data.date),
    credentialId: data.credentialId as string | undefined,
    verificationUrl: data.verificationUrl as string | undefined,
    image: data.image as string | undefined,
    description: data.description as string | undefined,
  }));
}

export function getBlogPosts(includeDrafts = false): BlogPost[] {
  const posts = readMarkdownFiles<BlogPost>("blog", (slug, data, content) => ({
    slug,
    title: (data.title as string) || "",
    description: (data.description as string) || "",
    coverImage: data.coverImage as string | undefined,
    date: normalizeDate(data.date),
    tags: (data.tags as string[]) || [],
    category: (data.category as string) || "General",
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    body: content,
    readingTime: readingTime(content).text,
  }));

  return includeDrafts ? posts : posts.filter((p) => !p.draft);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts(true).find((p) => p.slug === slug);
}

export function getBlogCategories(): string[] {
  const posts = getBlogPosts();
  return [...new Set(posts.map((p) => p.category))].sort();
}

export function getBlogTags(): string[] {
  const posts = getBlogPosts();
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}

export function getAllProjectTechnologies(): string[] {
  const projects = getProjects();
  return [...new Set(projects.flatMap((p) => p.techStack))].sort();
}

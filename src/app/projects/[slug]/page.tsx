import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { generateProjectJsonLd, generateSEO } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return generateSEO({
    title: project.title,
    description: project.description,
    image: project.coverImage,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const jsonLd = generateProjectJsonLd(project);

  return (
    <main className="min-h-screen pt-[var(--header-height)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <Link
            href="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>

          <h1 className="font-display text-4xl font-bold">{project.title}</h1>
          <p className="mt-2 text-muted">{formatDate(project.date)}</p>
          <p className="mt-6 text-lg text-muted">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="rounded-md bg-secondary px-3 py-1 text-sm text-muted">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                <Github className="h-4 w-4" /> View Source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        </FadeIn>
      </article>
    </main>
  );
}

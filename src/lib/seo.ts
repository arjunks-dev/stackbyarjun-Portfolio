import type { Metadata } from "next";
import { getPersonalInfo } from "@/lib/content";
import { getSiteNodes } from "@/lib/site-graph";
import { getSiteUrl } from "./utils";

const siteName = "ARJUN K S";
const siteTagline = "Professional Portfolio";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

export function generateSEO({
  title,
  description,
  image,
  path = "",
  type = "website",
  publishedTime,
  tags,
}: SEOProps): Metadata {
  const siteUrl = getSiteUrl();
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | ${siteTagline}`;
  const defaultDescription =
    "Portfolio of a System Administrator and SOC-focused IT professional — networking, cybersecurity, and beginner Python & JavaScript projects.";
  const metaDescription = description || defaultDescription;
  const personal = getPersonalInfo();
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}${personal.avatar}`;
  const url = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description: metaDescription,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url,
      siteName: `${siteName} | ${siteTagline}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_US",
      type,
      ...(publishedTime && { publishedTime }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export function generatePersonJsonLd(
  personal: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
  },
  sameAs: string[] = [],
  email?: string,
) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: personal.name,
    jobTitle: personal.title,
    description: personal.bio,
    ...(email && { email }),
    image: `${siteUrl}${personal.avatar}`,
    url: siteUrl,
    sameAs,
  };
}

export function generateWebsiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${siteName} | ${siteTagline}`,
    url: siteUrl,
  };
}

export function generateProjectJsonLd(project: {
  title: string;
  description: string;
  date: string;
  coverImage?: string;
  slug: string;
  githubUrl?: string;
  liveUrl?: string;
}) {
  const siteUrl = getSiteUrl();
  const personal = getPersonalInfo();

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/projects/${project.slug}/#project`,
    name: project.title,
    description: project.description,
    datePublished: project.date,
    image: project.coverImage ? `${siteUrl}${project.coverImage}` : undefined,
    url: `${siteUrl}/projects/${project.slug}`,
    applicationCategory: "DeveloperApplication",
    author: {
      "@type": "Person",
      name: personal.name,
    },
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    ...(project.liveUrl && { sameAs: project.liveUrl }),
  };
}

export function generateWebPageJsonLd(node: {
  path: string;
  title: string;
  description: string;
  type: "home" | "resume" | "project";
}) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}${node.path}/#webpage`,
    name: node.title,
    description: node.description,
    url: `${siteUrl}${node.path}`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    ...(node.type === "home" && { about: { "@id": `${siteUrl}/#person` } }),
  };
}

export function generateSiteGraphJsonLd(
  personal: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
  },
  sameAs: string[] = [],
  email?: string,
) {
  const siteUrl = getSiteUrl();
  const nodes = getSiteNodes();

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: personal.name,
    jobTitle: personal.title,
    description: personal.bio,
    ...(email && { email }),
    image: `${siteUrl}${personal.avatar}`,
    url: siteUrl,
    sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${siteName} | ${siteTagline}`,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#person` },
    hasPart: nodes.map((node) => ({ "@id": `${siteUrl}${node.path}/#webpage` })),
  };

  const pages = nodes.map((node) => ({
    "@type": "WebPage",
    "@id": `${siteUrl}${node.path}/#webpage`,
    name: node.title,
    description: node.description,
    url: `${siteUrl}${node.path}`,
    isPartOf: { "@id": `${siteUrl}/#website` },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, ...pages],
  };
}

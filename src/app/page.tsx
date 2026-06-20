import { SectionDivider } from "@/components/animations/section-divider";
import { AboutSection } from "@/components/sections/about";
import { BlogSection } from "@/components/sections/blog";
import { CertificationsSection } from "@/components/sections/certifications";
import { ContactSection } from "@/components/sections/contact";
import { ExperienceSection } from "@/components/sections/experience";
import { FeaturedCarousel } from "@/components/sections/featured-carousel";
import { GitHubContributions } from "@/components/sections/github-contributions";
import { HeroSection } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";
import {
  getAllProjectTechnologies,
  getBlogCategories,
  getBlogPosts,
  getBlogTags,
  getCertifications,
  getExperience,
  getFeaturedProjects,
  getPersonalInfo,
  getProjects,
  getSkills,
  getSocialLinks,
} from "@/lib/content";

export default function HomePage() {
  const personal = getPersonalInfo();
  const projects = getProjects();
  const featuredProjects = getFeaturedProjects();
  const technologies = getAllProjectTechnologies();
  const skills = getSkills();
  const experience = getExperience();
  const certifications = getCertifications();
  const blogPosts = getBlogPosts();
  const categories = getBlogCategories();
  const tags = getBlogTags();
  const socialLinks = getSocialLinks();

  return (
    <main>
      <HeroSection personal={personal} />
      <SectionDivider />
      <AboutSection personal={personal} />
      <SectionDivider />
      <SkillsSection skills={skills} />
      <SectionDivider />
      <FeaturedCarousel projects={featuredProjects.length > 0 ? featuredProjects : projects} />
      <ProjectsSection projects={projects} technologies={technologies} />
      <SectionDivider />
      <ExperienceSection experience={experience} />
      <SectionDivider />
      <CertificationsSection certifications={certifications} />
      <GitHubContributions />
      <SectionDivider />
      <BlogSection posts={blogPosts} categories={categories} tags={tags} />
      <SectionDivider />
      <ContactSection socialLinks={socialLinks} />
    </main>
  );
}

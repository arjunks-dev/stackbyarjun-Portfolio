import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { CloudflareAnalytics } from "@/components/analytics/cloudflare-analytics";
import { ClientProviders } from "@/components/layout/client-providers";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageLoader } from "@/components/layout/page-loader";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import {
  getContactEmail,
  getPersonalInfo,
  getSocialLinks,
} from "@/lib/content";
import { generatePersonJsonLd, generateSEO, generateSiteGraphJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistSans = GeistSans;

export const metadata = generateSEO({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personal = getPersonalInfo();
  const socialLinks = getSocialLinks();
  const contactEmail = getContactEmail(socialLinks);
  const personJsonLd = generatePersonJsonLd(
    personal,
    socialLinks.map((l) => l.url),
    contactEmail,
  );
  const siteGraphJsonLd = generateSiteGraphJsonLd(
    personal,
    socialLinks.map((l) => l.url),
    contactEmail,
  );

  return (
    <html lang="en" className="dark">
      <head>
        <CloudflareAnalytics />
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${geistSans.variable} font-sans antialiased`}>
        <PageLoader />
        <ScrollProgress />
        <Header name={personal.name} />
        <ClientProviders>{children}</ClientProviders>
        <Footer socialLinks={socialLinks} name={personal.name} />
      </body>
    </html>
  );
}

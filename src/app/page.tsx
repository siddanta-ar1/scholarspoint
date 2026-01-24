import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import GlobalSearch from "@/components/GlobalSearch";
import OpportunityTabs from "@/components/OpportunityTabs";

export const metadata: Metadata = {
  title:
    "ScholarsPoint – Fully Funded International Scholarships & Opportunities",
  description:
    "Your trusted platform for exploring fully funded international scholarships, graduate fellowships, undergraduate internships, and detailed student visa guides. Updated daily.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "ScholarsPoint – Explore Global Scholarships, Fellowships & Internships",
    description:
      "Explore 1000+ international opportunities – fully funded scholarships, fellowships, internships, and visa help for students globally.",
    url: "https://scholarspoint.net",
    siteName: "ScholarsPoint",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarsPoint | Your Hub for Global Scholarships & Opportunities",
    description:
      "We connect global students with verified scholarships, fellowships, internships & visa guidance.",
    creator: "@scholarspoint",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ScholarsPoint",
    url: "https://scholarspoint.net",
    logo: "https://scholarspoint.net/favicon.png",
    description:
      "A trusted resource for students to find verified international scholarships, internships, and visa guides.",
    sameAs: [
      "https://www.facebook.com/scholars.point.133274",
      "https://www.instagram.com/scholarspoint3/",
      "https://www.tiktok.com/@scholars_point",
      "https://www.linkedin.com/company/scholarspoint",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://scholarspoint.net/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="space-y-8 sm:space-y-12 md:space-y-16 pb-12 sm:pb-16 md:pb-20">
        {/* Hero Section - Full width, no padding */}
        <HeroSection />

        {/* Search - Overlapping hero on larger screens */}
        <section className="relative z-20 -mt-8 sm:-mt-12 md:-mt-16">
          <GlobalSearch />
        </section>

        {/* Opportunities */}
        <section className="pt-4 sm:pt-8">
          <OpportunityTabs />
        </section>
      </main>
    </>
  );
}

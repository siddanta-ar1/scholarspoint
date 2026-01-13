import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import GlobalSearch from "@/components/GlobalSearch";
import OpportunityTabs from "@/components/OpportunityTabs";
import BannerSlider from "@/components/BannerSlider"; // Import the slider component

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

      <main className="space-y-16 pb-20">
        {/* The BannerSlider fetches data from your 'banners' table */}
        {/*<section className="container mx-auto px-4 pt-6">
          <BannerSlider />
        </section>*/}

        <HeroSection />

        <section className="-mt-10 mb-10">
          <GlobalSearch />
        </section>

        <OpportunityTabs />
      </main>
    </>
  );
}

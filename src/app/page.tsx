// src/app/page.tsx
import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import GlobalSearch from '@/components/GlobalSearch';
import OpportunityTabs from '@/components/OpportunityTabs';

// --- SEO POWER-UP: HOMEPAGE-SPECIFIC METADATA ---
// This object overrides the defaults in your layout.tsx to provide
// highly specific SEO information for your main landing page.
export const metadata: Metadata = {
  title: 'ScholarsPoint – Fully Funded International Scholarships & Opportunities',
  description: 'Your trusted platform for exploring fully funded international scholarships, graduate fellowships, undergraduate internships, and detailed student visa guides. Updated daily.',
  
  // The canonical URL for the homepage is the root domain.
  alternates: {
    canonical: '/',
  },

  // Open Graph (Facebook, LinkedIn, etc.) tailored for the homepage.
  openGraph: {
    title: 'ScholarsPoint – Explore Global Scholarships, Fellowships & Internships',
    description: 'Explore 1000+ international opportunities – fully funded scholarships, fellowships, internships, and visa help for students globally. Apply smarter with ScholarsPoint.',
    // The image URL is inherited from layout.tsx, but you can override it here if needed.
    // url: '/',
  },

  // Twitter Card tailored for the homepage.
  twitter: {
    title: 'ScholarsPoint | Your Hub for Global Scholarships & Opportunities',
    description: 'We connect global students with verified scholarships, fellowships, internships & visa guidance. Ideal for students from Nepal, Africa & Asia.',
    // image: '/twitter-home-image.png', // Optional: override layout image
  },
};

export default function HomePage() {
  // --- ENHANCED JSON-LD STRUCTURED DATA ---
  // This consolidated schema is cleaner and more powerful for Google.
  // It clearly defines your organization and its search capabilities.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'ScholarsPoint',
    url: 'https://scholarspoint.net',
    logo: 'https://scholarspoint.net/favicon.png', // Ensure this points to a good logo file
    description: 'A trusted resource for students from Nepal, Asia, Africa, and around the world to find verified international scholarships, internships, and visa guides.',
    sameAs: [ // Your social media profiles to establish entity connections
      'https://www.facebook.com/scholars.point.133274',
      'https://www.instagram.com/scholarspoint3/',
      'https://www.tiktok.com/@scholars_point',
      'https://www.linkedin.com/company/scholarspoint' // It's better to use a company page
    ],
    potentialAction: { // This helps enable the sitelinks search box in Google
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://scholarspoint.net/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* The JSON-LD script is injected directly here.
        This is the correct and modern way to add structured data.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* The main content of your page. Notice the <Metadata /> component is gone.
        The layout is cleaner and more focused on content.
      */}
      <main className="space-y-20">
        <HeroSection />
        <section className="-mt-10 mb-10">
          <GlobalSearch />
        </section>
        <OpportunityTabs />
      </main>
    </>
  );
}
import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import GlobalSearch from "@/components/GlobalSearch";
import OpportunityTabs from "@/components/OpportunityTabs";
import WhyScholarsPoint from "@/components/WhyScholarsPoint";
import HowItWorks from "@/components/HowItWorks";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Plane, Briefcase } from "lucide-react";

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

const categories = [
  {
    title: "Scholarships",
    description: "Fully funded undergraduate, masters, and PhD scholarships from top universities worldwide.",
    icon: GraduationCap,
    href: "/scholarships",
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    title: "Fellowships",
    description: "Research fellowships and leadership programs for early-career professionals and graduates.",
    icon: BookOpen,
    href: "/fellowships",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    title: "Internships",
    description: "Paid internships at leading organizations including UN, Google, Microsoft, and more.",
    icon: Briefcase,
    href: "/internships",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "Visa Guides",
    description: "Step-by-step student visa guides for USA, UK, Canada, Australia, and other destinations.",
    icon: Plane,
    href: "/visa-guides",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

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

      <main>
        {/* Hero Section - Full width, no padding */}
        <HeroSection />

        {/* Search - Overlapping hero on larger screens */}
        <section className="relative z-20 -mt-8 sm:-mt-12 md:-mt-16">
          <GlobalSearch />
        </section>


        {/* Opportunities Tabs */}
        <section className="pt-4 sm:pt-8 pb-8">
          <OpportunityTabs />
        </section>

        {/* What is ScholarsPoint - SEO Rich Content */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                What is <span className="text-sky-600">ScholarsPoint</span>?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                ScholarsPoint is a comprehensive educational platform designed to help students
                from around the world discover and apply for international scholarships,
                fellowships, internships, and exchange programs. Founded with the mission of
                democratizing access to global education, our platform provides verified,
                up-to-date information about thousands of fully-funded opportunities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Whether you&apos;re a high school student dreaming of studying abroad, a graduate
                seeking research fellowships, or a professional looking for international
                internship opportunities, ScholarsPoint is your trusted companion on the
                journey to academic and career success. We update our database daily to
                ensure you never miss an important deadline.
              </p>

              {/* Category Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.title}
                      href={category.href}
                      className={`group p-5 rounded-2xl border ${category.color} hover:shadow-lg transition-all duration-300`}
                    >
                      <Icon className="w-8 h-8 mb-3" />
                      <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                        Explore <ArrowRight size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        {/* Why ScholarsPoint */}
        <WhyScholarsPoint />

        {/* How It Works */}
        <HowItWorks />

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-sky-600 to-blue-700 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Trusted by Students Worldwide
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Join thousands of students who have discovered their dream opportunities
                through ScholarsPoint.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2">1000+</div>
                <div className="text-white/80 font-medium">Active Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2">50+</div>
                <div className="text-white/80 font-medium">Countries Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2">Daily</div>
                <div className="text-white/80 font-medium">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black mb-2">Free</div>
                <div className="text-white/80 font-medium">Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Expert Guides & Success Stories
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our blog features comprehensive guides on scholarship applications,
                visa interviews, statement of purpose writing, and inspiring success
                stories from students who achieved their dreams through international
                education opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blogs"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
                >
                  Read Our Blog
                  <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

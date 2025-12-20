import Image from "next/image";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// SEO Metadata
export const metadata: Metadata = {
  title: "About Us | 🎓 ScholarsPoint",
  description:
    "Discover the mission of ScholarsPoint. We connect students globally with scholarships, fellowships, and international career opportunities.",
  openGraph: {
    title: "About ScholarsPoint",
    description: "Empowering learners through global education opportunities.",
    url: "https://scholarspoint.net/about",
    siteName: "ScholarsPoint",
    images: [
      {
        url: "/og-about.jpg", // Replace with your actual OG image path
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const teamMembers = [
  {
    name: "Siddanta Sodari",
    role: "Founder & CEO",
    img: "/siddanta.png",
    bio: "Passionate about education access and technology.",
  }
];

const milestones = [
  {
    title: "Many Opportunities",
    description: "Curated scholarships, fellowships, and internships.",
    icon: "https://media.istockphoto.com/id/471741807/photo/yellow-opportunity-ahead-road-sign-with-sky.webp?a=1&b=1&s=612x612&w=0&k=20&c=IcsZaScAuEdYnwwKR4dSWLEBTk1p9QVeE4s68NaEunI=",
  },
  {
    title: "Multiple Countries",
    description: "Connecting students globally across continents.",
    icon: "https://images.unsplash.com/photo-1651421479704-470a78eef530?w=300&auto=format&fit=crop&q=60",
  },
  {
    title: "Passionate Users",
    description: "Empowering learners and professionals worldwide.",
    icon: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=60",
  },
];

export default function AboutPage() {
  // Structured Data for Sitelinks & SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "ScholarsPoint",
      "url": "https://scholarspoint.net",
      "logo": "https://scholarspoint.net/logo.png",
      "description": "A platform for global education and career opportunities.",
      "founder": teamMembers.map(m => ({
        "@type": "Person",
        "name": m.name,
        "jobTitle": m.role
      }))
    }
  };

  return (
    <>
      {/* Injecting JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20 text-gray-800">
        <nav className="flex items-center justify-between mb-4">
          <Link href="/" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
            <ArrowLeft size={20} /> Back
          </Link>
        
        </nav>
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-tight">
            About 🎓 ScholarsPoint
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            ScholarsPoint is a platform dedicated to connecting students, researchers, and professionals
            with the best global opportunities — scholarships, internships, fellowships, and visa guides.
          </p>
        </header>

        {/* Milestones Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {milestones.map(({ title, description, icon }) => (
            <article
              key={title}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-40 w-full mb-6 overflow-hidden rounded-lg">
                <Image
                  fill
                  src={icon}
                  alt={title}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="text-2xl font-bold text-blue-700">{title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
            </article>
          ))}
        </section>

        {/* Mission & Vision */}
        <div className="space-y-16">
          <section className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-full md:w-1/2 aspect-video md:aspect-square overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1607013407627-6ee814329547?w=800&auto=format&fit=crop&q=60"
                alt="Students studying at a university"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                <span>🎯</span> Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To empower learners globally by simplifying access to verified and up-to-date academic and
                career opportunities. We remove the barriers between potential and opportunity.
              </p>
            </div>
          </section>

          <section className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="relative w-full md:w-1/2 aspect-video md:aspect-square overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60"
                alt="Team working together"
                fill
                className="object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                <span>🌍</span> Our Vision
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A world where every deserving individual can achieve their educational dreams regardless of
                geography or background. We aim to be the first point of contact for global seekers.
              </p>
            </div>
          </section>
        </div>

        {/* Team Section */}
        <section className="space-y-12">
          <h2 className="text-4xl font-bold text-blue-700 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map(({ name, role, img, bio }) => (
              <div
                key={name}
                className="group bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-50 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative mx-auto mb-6 w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 group-hover:border-blue-600 transition-colors">
                  <Image
                    src={img}
                    alt={`${name} - ${role} at ScholarsPoint`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                <p className="text-blue-600 font-semibold uppercase tracking-wide text-sm mb-4">{role}</p>
                <p className="text-gray-600 italic">"{bio}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <footer className="bg-blue-50 rounded-3xl p-10 text-center space-y-6">
          <h2 className="text-3xl font-bold text-blue-800">Ready to start your journey?</h2>
          <p className="text-lg text-blue-900/80">
            Join thousands of students finding their future today.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-3 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/opportunities"
              className="px-8 py-3 bg-white text-blue-700 border border-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors"
            >
              Browse Opportunities
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
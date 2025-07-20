// components/Metadata.tsx
import Head from 'next/head'

export default function Metadata() {
  return (
    <Head>
      {/* Basic Metadata */}
      <title>Scholarspoint.net – Fully Funded International Scholarships, Fellowships, Internships & Visa Support for Global Students</title>
      <meta
        name="description"
        content="Scholarspoint.net is your trusted platform for exploring fully funded international scholarships, graduate fellowships, undergraduate internships, and detailed student visa guides. Updated daily for students from Nepal, India, Africa, Asia, and across the world."
      />
      <link rel="canonical" href="https://scholarspoint.net" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0f172a" />
      <meta charSet="UTF-8" />

      {/* Language & Regional Settings */}
      <meta httpEquiv="Content-Language" content="en" />
      <link rel="alternate" hrefLang="en" href="https://scholarspoint.net/" />
      <link rel="alternate" hrefLang="ne" href="https://scholarspoint.net/ne" />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu" />
      <meta name="geo.position" content="27.7172;85.3240" />

      {/* Keywords */}
      <meta
        name="keywords"
        content="international scholarships, fully funded scholarships, scholarships 2025, fellowships for students, internships abroad, visa guides for students, scholarships for Nepalese, UK visa for students, Canada scholarships, Erasmus Mundus, DAAD, Chevening, MEXT, student jobs abroad, scholarship blog, remote internships, visa SOP writing, scholarship deadlines, scholarships for Asia, scholarships without IELTS, scholarships for female students, postgrad fellowships, STEM scholarships, climate fellowships, Gates Cambridge, Fulbright, Commonwealth, research funding, study abroad help, global education platform, scholarspoint.net"
      />

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Scholarspoint – Explore Scholarships, Fellowships, Internships & Visa Support" />
      <meta
        property="og:description"
        content="Explore 1000+ international opportunities – fully funded scholarships, fellowships, internships, and visa help for students globally. Apply faster and smarter with Scholarspoint.net."
      />
      <meta property="og:url" content="https://scholarspoint.net" />
      <meta property="og:image" content="https://scholarspoint.net/og-image.jpg" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Scholarspoint.net" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Scholarspoint.net | Global Hub for Scholarships, Fellowships & Visa Support" />
      <meta
        name="twitter:description"
        content="Scholarspoint connects global students with scholarships, fellowships, internships & visa guidance. Ideal for Nepalese, African & Asian students. 100% verified listings."
      />
      <meta name="twitter:image" content="https://scholarspoint.net/og-image.jpg" />
      <meta name="twitter:creator" content="@scholarspoint" />

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Google Site Verification */}
      <meta name="google-site-verification" content="OSw3ARsfxcZGSRhPnc4vdDvnld5a95kIvjikK-ZJFj0" />

      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Scholarspoint.net",
              "url": "https://scholarspoint.net",
              "logo": "https://scholarspoint.net/favicon.png",
              "description": "Explore verified international scholarships, internships, and visa guides at Scholarspoint.net — a trusted resource for students from Nepal, Asia, Africa, and around the world.",
              "sameAs": [
                "https://www.facebook.com/scholars.point.133274",
                "https://www.instagram.com/scholarspoint3/",
                "https://www.tiktok.com/@scholars_point",
                "https://www.linkedin.com/in/siddanta-sodari-08596a335/"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://scholarspoint.net",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://scholarspoint.net/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Scholarspoint Homepage",
              "description": "Discover global academic opportunities through scholarships, internships, fellowships, and student visa resources with Scholarspoint.net"
            }
          ]),
        }}
      />

      {/* Additional Metadata for SEO & Accessibility */}
      <meta name="robots" content="index, follow" />
      <meta name="rating" content="general" />
      <meta name="author" content="Siddanta Sodari" />
      <meta name="copyright" content="© 2025 ScholarsPoint" />
      <meta name="reply-to" content="contact@scholarspoint.net" />
      <meta name="coverage" content="Worldwide" />
    </Head>
  )
}

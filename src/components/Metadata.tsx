// components/Metadata.tsx
import Head from 'next/head'

export default function Metadata() {
  return (
    <Head>
      {/* Title & Description */}
      <title>Scholarspoint.net – Global Scholarships, Internships, Fellowships & Visa Support</title>
      <meta
        name="description"
        content="Scholarspoint.net is a trusted global hub for higher school, college, undergraduate, graduate, and PhD students seeking scholarships, internships, fellowships, and visa guidance."
      />
      <link rel="canonical" href="https://scholarspoint.net" />

      {/* Mobile & Theme Setup */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0f172a" />

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Scholarspoint – Scholarships, Internships & Visa Hub" />
      <meta
        property="og:description"
        content="Discover handpicked global opportunities for students and professionals — scholarships, internships, fellowships, and visa advice updated daily."
      />
      <meta property="og:url" content="https://scholarspoint.net" />
      <meta property="og:image" content="https://scholarspoint.net/favicon.png" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Scholarspoint.net | Your Gateway to Global Opportunities" />
      <meta
        name="twitter:description"
        content="Get the latest scholarships, internships, fellowships & visa support. Ideal for students and professionals worldwide."
      />
      <meta name="twitter:image" content="https://scholarspoint.net/favicon.png" />

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.png" />

      {/* Google Site Verification */}
      <meta name="google-site-verification" content="OSw3ARsfxcZGSRhPnc4vdDvnld5a95kIvjikK-ZJFj0" />

      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Scholarspoint.net",
            url: "https://scholarspoint.net",
            logo: "https://scholarspoint.net/favicon.png",
            description:
              "Scholarspoint.net provides global opportunities for high school, college, undergraduate, and postgraduate students – including scholarships, internships, fellowships, and visa guidance.",
            sameAs: [
             " https://www.facebook.com/scholars.point.133274",
              "https://www.instagram.com/scholarspoint3/", 
              "https://www.tiktok.com/@scholars_point",
              "https://www.linkedin.com/in/siddanta-sodari-08596a335/"
            ]
          }),
        }}
      />
    </Head>
  );
}

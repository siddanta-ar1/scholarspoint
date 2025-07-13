// components/Metadata.tsx
import Head from 'next/head'

export default function Metadata() {
  return (
    <Head>
      <title>Scholarspoint.net - Scholarships, Internships, Fellowships & Visa Guidance</title>
      <meta
        name="description"
        content="Find global scholarships, internships, fellowships, and visa guidance for students worldwide. Scholarspoint.net helps you unlock new academic and career opportunities."
      />
      <meta property="og:title" content="Scholarspoint - Scholarships & Internships Portal" />
      <meta
        property="og:description"
        content="Explore scholarships, internships, and visa guidance at Scholarspoint.net."
      />
      <meta property="og:url" content="https://scholarspoint.net" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://scholarspoint.net" />
    </Head>
  )
}

// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'ScholarsPoint - Global Scholarships & Internships Platform',
  description:
    'Explore top Scholarships, Internships, Fellowships, and Visa Guidance for students worldwide. Stay updated and apply faster!',
  openGraph: {
    title: '🎓 ScholarsPoint - Scholarships, Internships & More',
    description:
      'Explore top Scholarships, Internships, Fellowships, and Visa Guidance for students worldwide.',
    url: 'https://scholarspoint.net',
    siteName: 'ScholarsPoint',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎓 ScholarsPoint',
    description:
      'Unlock global academic opportunities with up-to-date information on scholarships, internships, and more.',
    creator: '@scholarspoint',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.jpeg',
  },
  keywords: [
  'international scholarships',
  'global scholarships 2025',
  'fully funded scholarships for international students',
  'scholarships for Nepali students',
  'study abroad scholarships',
  'international fellowships',
  'postgraduate fellowships',
  'undergraduate fellowships abroad',
  'student visa guides',
  'student visa for USA',
  'student visa for UK',
  'student visa for Canada',
  'student visa for Australia',
  'student visa tips',
  'internships for international students',
  'remote internships for students',
  'global opportunities for students',
  'ScholarsPoint',
  'scholarspoint.net',
  'merit-based scholarships 2025',
  'need-based scholarships',
  'PhD scholarships abroad',
  'master’s degree scholarships',
  'bachelor’s degree scholarships',
  'MBA scholarships for international students',
  'research fellowships 2025',
  'summer internships for students',
  'winter internships abroad',
  'internships with stipend',
  'fully funded fellowships',
  'short-term fellowships abroad',
  'visa interview tips for students',
  'student visa application checklist',
  'scholarships in Europe',
  'scholarships in USA',
  'scholarships in Canada',
  'scholarships in UK',
  'scholarships in Australia',
  'scholarships in Germany',
  'DAAD scholarships',
  'Erasmus Mundus scholarships',
  'Chevening scholarships',
  'Fulbright scholarships',
  'Rhodes scholarships',
  'Commonwealth scholarships',
  'Gates Cambridge scholarships',
  'MEXT scholarships for Nepalese',
  'Korean Government Scholarship (GKS)',
  'Chinese Government Scholarship (CSC)',
  'scholarships for Nepali undergraduates',
  'fully funded scholarships for Nepali students',
  'visa guides for Nepalese students',
  'study abroad consultants in Nepal',
  'IELTS for scholarships',
  'TOEFL requirements for scholarships',
  'GRE for international students',
  'SOP writing tips for scholarships',
  'LOR tips for scholarships',
  'how to get international scholarships',
  'scholarship application tips',
  'motivation letter for scholarship',
  'study abroad with full scholarship',
  'student visa rejection reasons',
  'how to appeal student visa rejection',
  'visa requirements for Nepali students',
  'visa processing time for students',
  'visa success tips for Nepali applicants',
  'student jobs abroad',
  'part-time work for students overseas',
  'internship visa process',
  'exchange programs for students',
  'international student mobility',
  'higher education abroad',
  'international education fair Nepal',
  'apply for scholarship 2025',
  'scholarships with no IELTS',
  'online internships for students',
  'UN internships 2025',
  'Google internships for students',
  'Microsoft internships for students',
  'research internships abroad',
  'visa categories for students',
  'student visa SOP sample',
  'student insurance abroad',
  'accommodation tips for international students',
  'bank statements for visa',
  'study abroad packing list',
  'pre-departure checklist for students',
  'post-arrival guide for students',
  'study abroad mentorship',
  'visa interview questions and answers',
  'cost of studying abroad',
  'funding your education abroad',
  'top universities offering scholarships',
  'scholarship deadlines 2025',
  'scholarships for arts students',
  'scholarships for engineering students',
  'medical scholarships abroad',
  'IT scholarships for international students',
  'tech fellowships for graduates',
  'women in STEM scholarships',
  'climate change fellowships',
  'youth exchange fellowships',
  'global education funding',
  'scholarship blog',
  'fellowship blog',
  'visa guidance blog'
]
,
  metadataBase: new URL('https://scholarspoint.net'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#1d4ed8" />
        <link rel="canonical" href="https://scholarspoint.net" />

        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ScholarsPoint",
              "url": "https://scholarspoint.net",
              "logo": "https://scholarspoint.net/favicon.png",
              "sameAs": [
                " https://www.facebook.com/scholars.point.133274",
              "https://www.instagram.com/scholarspoint3/", 
              "https://www.tiktok.com/@scholars_point",
              "https://www.linkedin.com/in/siddanta-sodari-08596a335/"
              ]
            }),
          }}
        ></script>
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Toaster richColors position="top-center" />
        <Navbar />
        <main
          role="main"
          id="main-content"
          className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </main>
        <Footer />
        <Analytics/>
      </body>
    </html>
  )
}

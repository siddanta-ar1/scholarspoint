// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'ScholarsPoint - International Scholarships, Fellowships, Internships & Visa Guides for Global Students',

 description: `ScholarsPoint is your ultimate destination for exploring international scholarships, fellowships, internships, and comprehensive visa guidance tailored for global students. Whether you’re a high school graduate, undergraduate, master’s, PhD, or postdoctoral aspirant, our platform provides updated, verified, and categorized opportunities from top global institutions. From fully funded scholarships in the USA, UK, Canada, Germany, and Australia to government-sponsored programs like Chevening, Fulbright, DAAD, Erasmus Mundus, and MEXT, we connect students with life-changing educational pathways. Nepali students, Indian students, African students, and learners from all developing regions will find scholarships that suit their academic and financial background. 

In addition to academic funding, ScholarsPoint offers internship listings including remote, paid, and seasonal internships from renowned companies like Google, Microsoft, UN, and other global organizations. Our curated fellowships cover areas such as research, leadership, STEM, climate change, social impact, and more — perfect for early-career professionals and recent graduates.

We also provide clear and up-to-date visa guides for student visas to countries such as the USA (F1), UK (Tier 4), Canada (study permit), Australia (subclass 500), and more. Learn how to prepare for visa interviews, gather required documents, write your SOP (Statement of Purpose), and avoid common mistakes that lead to rejection. Our guides also cover how to get student insurance, find accommodation, open international bank accounts, and plan for part-time jobs abroad.

For students from Global especially, ScholarsPoint serves as a valuable one-stop solution offering localized guidance in Nepali and English, ensuring no student misses out on international opportunities due to lack of access or understanding. We also publish regular blog posts, articles, and newsletters on trending scholarship deadlines, personal statement writing, application strategies, and real success stories from past recipients.

Our advanced search system allows you to filter scholarships and fellowships by level of study, field of interest, location, funding type, and eligibility criteria. Whether you're looking for medical scholarships, engineering fellowships, arts scholarships, or tech internships, ScholarsPoint has it covered.

Join a global student community, stay informed, apply early, and never miss an opportunity to advance your academic or professional career abroad. With a mission to democratize access to international education, ScholarsPoint continues to empower thousands of students each month. Sign up to get alerts, bookmark your favorite programs, and receive personalized recommendations. 

Let ScholarsPoint guide you through every step of your journey—from finding the right scholarship or internship to submitting a strong application and finally securing your student visa. Explore your future. Empower your dreams. Study abroad made simple with ScholarsPoint.`,

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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
 keywords : [
    // --- Scholarships ---
    'international scholarships',
    'global scholarships 2025',
    'fully funded scholarships for international students',
    'scholarships for Nepali students',
    'study abroad scholarships',
    'merit-based scholarships 2025',
    'need-based scholarships',
    'PhD scholarships abroad',
    'master’s degree scholarships',
    'bachelor’s degree scholarships',
    'MBA scholarships for international students',
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
    'scholarships with no IELTS',
    'scholarships for arts students',
    'scholarships for engineering students',
    'medical scholarships abroad',
    'IT scholarships for international students',
    'women in STEM scholarships',
    'climate change fellowships',
    'youth exchange fellowships',
    'global education funding',
    'apply for scholarship 2025',
    'scholarship deadlines 2025',
    'how to get international scholarships',
    'scholarship application tips',
    'scholarship blog',

    // --- Fellowships ---
    'international fellowships',
    'postgraduate fellowships',
    'undergraduate fellowships abroad',
    'research fellowships 2025',
    'fully funded fellowships',
    'short-term fellowships abroad',
    'tech fellowships for graduates',
    'fellowship blog',

    // --- Study Abroad ---
    'study abroad with full scholarship',
    'higher education abroad',
    'best countries to study abroad for free',
    'study in USA with full scholarship',
    'study in UK with visa sponsorship',
    'study in Canada with low tuition fees',
    'study in Australia with post-study work visa',
    'study in Germany with free tuition',
    'study in Japan with MEXT scholarship',
    'study in South Korea with GKS scholarship',
    'study in China with CSC scholarship',
    'international student mobility',
    'international education fair Nepal',
    'study abroad consultants in Nepal',
    'study abroad mentorship',
    'cost of studying abroad',
    'funding your education abroad',
    'top universities offering scholarships',

    // --- Visas & Immigration ---
    'student visa guides',
    'student visa for USA',
    'student visa for UK',
    'student visa for Canada',
    'student visa for Australia',
    'student visa tips',
    'visa interview tips for students',
    'student visa application checklist',
    'visa requirements for Nepali students',
    'visa processing time for students',
    'visa success tips for Nepali applicants',
    'student visa rejection reasons',
    'how to appeal student visa rejection',
    'visa categories for students',
    'student visa SOP sample',
    'visa interview questions and answers',
    'visa guidance blog',
    'visa guides for Nepalese students',
    'F-1 visa guide for USA students',
    'Tier 4 visa process for UK students',
    'Canada study permit application 2025',
    'Australian student visa (subclass 500) checklist',
    'Schengen student visa for Europe',
    'post-study work visa policies',

    // --- Internships & Jobs ---
    'internships for international students',
    'remote internships for students',
    'global opportunities for students',
    'summer internships for students',
    'winter internships abroad',
    'internships with stipend',
    'online internships for students',
    'UN internships 2025',
    'Google internships for students',
    'Microsoft internships for students',
    'research internships abroad',
    'student jobs abroad',
    'part-time work for students overseas',
    'internship visa process',
    'CPT and OPT for US international students',
    'UK Tier 5 temporary worker visa for interns',
    'how to convert internship into full-time job',

    // --- Test Prep & Application ---
    'IELTS for scholarships',
    'TOEFL requirements for scholarships',
    'GRE for international students',
    'SOP writing tips for scholarships',
    'LOR tips for scholarships',
    'motivation letter for scholarship',
    'scholarship essay prompts',
    'CV/resume tips for scholarship applications',
    'Duolingo accepted universities',
    'IELTS waiver scholarships 2025',

    // --- Student Resources ---
    'student insurance abroad',
    'accommodation tips for international students',
    'bank statements for visa',
    'study abroad packing list',
    'pre-departure checklist for students',
    'post-arrival guide for students',
    'exchange programs for students',
    'global scholarships for developing countries',
    'how to study abroad for free',

    // --- Branded Keywords ---
    'Scholars Point',
    'ScholarsPoint',
    'scholarspoint.net',
    'Scholarspoint.net scholarship database',
    'Scholarspoint Nepal reviews',
    'how to apply through Scholarspoint',
    'Scholarspoint scholarship webinar 2025',

    // --- Additional Long-Tail Keywords ---
    'fully funded MBA scholarships for Nepali students 2025',
    'study in Germany with IELTS waiver',
    'visa success stories for Nepali students',
    'best scholarship search engines',
    'post-study immigration pathways',
    'Nepal embassy attestation process',
    'Nepali student communities abroad',
    'ScholarsPoint internship guides',
    'ScholarsPoint study abroad blog',
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
        
        {/* --- FIX: REMOVED THE STANDARD AD SENSE SCRIPT TAG FROM HERE --- */}

        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Scholarspoint",
              "url": "https://scholarspoint.net",
              "logo": "https://scholarspoint.net/favicon.ico",
              "sameAs": [
                "https://www.facebook.com/scholars.point.133274",
                "https://www.instagram.com/scholarspoint3/", 
                "https://www.tiktok.com/@scholars_point",
                "https://www.linkedin.com/in/siddanta-sodari-08596a335/"
              ]
            }),
          }}
        />
      </head>
      
      {/* --- FIX: Added inter.className to apply the font --- */}
      <body className={inter.className}>
        <Navbar /> {/* You likely missed adding this back in your snippet, so I added it here if you use it */}
        
        {children}
        
        <Footer/>
        <Analytics />

        {/* --- FIX: Single Source of Truth for AdSense --- */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6531423360862071"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}

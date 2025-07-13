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
    apple: '/apple-touch-icon.png',
  },
  keywords: [
    'scholarships',
    'fellowships',
    'internships',
    'visa guidance',
    'study abroad',
    'fully funded',
    'international students',
    'scholarspoint',
    'scholarspoint.net',
  ],
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
                "https://www.linkedin.com/company/scholars-point/",
                "https://twitter.com/scholarspoint"
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

// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

import { Toaster } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: ' ScholarsPoint',
  description:
    'Explore top Scholarships, Internships, Fellowships, and Visa Guidance for students worldwide. Stay updated and apply faster!',
  openGraph: {
    title: '🎓 ScholarsPoint',
    description:
      'Explore top Scholarships, Internships, Fellowships, and Visa Guidance for students worldwide.',
    url: 'https://scholarspoint.vercel.app', // ✅ Replace with your actual URL
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
    'visa guide',
    'international students',
    'study abroad',
    'PhD scholarships',
    'graduate funding',
    'fully funded',
  ],
  metadataBase: new URL('https://scholarspoint.vercel.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#1d4ed8" />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Toaster richColors position="top-center" />
        <Navbar />
        <main
          role="main"
          className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import { Footer } from "@/components/footer";
import Script from "next/script";
import Navbar from "@/components/navbar";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import CookieConsent from "@/components/CookieConsent";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title:
    "ScholarsPoint - International Scholarships, Fellowships, Internships & Visa Guides for Global Students",

  description: "ScholarsPoint is your ultimate destination for exploring international scholarships, fellowships, internships, and comprehensive visa guidance tailored for global students.",

  openGraph: {
    title: "🎓 ScholarsPoint - Scholarships, Internships & More",
    description:
      "Explore top Scholarships, Internships, Fellowships, and Visa Guidance for students worldwide.",
    url: "https://scholarspoint.net",
    siteName: "ScholarsPoint",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🎓 ScholarsPoint",
    description:
      "Unlock global academic opportunities with up-to-date information on scholarships, internships, and more.",
    creator: "@scholarspoint",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  keywords: [
    "international scholarships",
    "study abroad",
    "fellowships",
    "internships",
    "visa guidance",
    "global students",
    "fully funded scholarships"
  ],
  metadataBase: new URL("https://scholarspoint.net"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ScholarsPoint",
              url: "https://scholarspoint.net",
              logo: "https://scholarspoint.net/logo.png",
            }),
          }}
        />
              

        {/* Google AdSense - loaded unconditionally for verification */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6531423360862071"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* This wrapper handles hiding Navbar/Footer on Admin pages */}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>

        <Toaster position="top-center" richColors />
        <Analytics />

        <CookieConsent />
      </body>
    </html>
  );
}

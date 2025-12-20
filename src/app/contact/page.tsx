import { ContactForm } from '@/components/ContactForm'
import { Metadata } from 'next'
import Script from 'next/script'
import React from 'react'
import { Mail, MapPin, MessageCircle, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Enhanced SEO Metadata
export const metadata: Metadata = {
  title: 'Contact Us | ScholarsPoint',
  description: 'Have questions about scholarships or internships? Reach out to the ScholarsPoint team for support, partnerships, or feedback.',
  openGraph: {
    title: 'Contact ScholarsPoint',
    description: 'Get in touch with us for global education opportunities and queries.',
    url: 'https://scholarspoint.net/contact',
    type: 'website',
  },
}

const ContactPage = () => {
  // JSON-LD for ContactPage and Organization ContactPoint
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact ScholarsPoint",
    "description": "Contact page for ScholarsPoint team regarding scholarships and global opportunities.",
    "mainEntity": {
      "@type": "Organization",
      "name": "ScholarsPoint",
      "url": "https://scholarspoint.net",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "support@scholarspoint.net", // Replace with your actual email
        "contactType": "customer support",
        "availableLanguage": "en"
      }
    }
  };

  return (
    <>
      {/* Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center justify-between mb-4">
          <Link href="/" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
            <ArrowLeft size={20} /> Back
          </Link>
        
        </nav>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="max-w-2xl mx-auto text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-blue-700 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Have a question, feedback, or a partnership proposal? We'd love to hear from you. 
              Our team typically responds within 24 hours.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           

            {/* Right Column: Contact Form */}
            <section className="lg:col-span-7">
              <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-3xl p-6 sm:p-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <ContactForm />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}

export default ContactPage
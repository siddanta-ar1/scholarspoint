import { ContactForm } from "@/components/ContactForm";
import { Metadata } from "next";
import React from "react";
import {
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowLeft,
  Globe,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | ScholarsPoint",
  description:
    "Reach out to the ScholarsPoint team for support, partnerships, or scholarship feedback.",
  openGraph: {
    title: "Contact ScholarsPoint",
    url: "https://scholarspoint.net/contact",
    type: "website",
  },
};

const ContactPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact ScholarsPoint",
    mainEntity: {
      "@type": "Organization",
      name: "ScholarsPoint",
      url: "https://scholarspoint.net",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@scholarspoint.net",
        contactType: "customer support",
      },
    },
  };

  const contactInfo = [
    {
      icon: <Mail className="text-sky-600" />,
      title: "Email Us",
      detail: "support@scholarspoint.net",
      sub: "Online support 24/7",
    },
    {
      icon: <MessageCircle className="text-green-600" />,
      title: "Live Chat",
      detail: "Join our Community",
      sub: "Discord & Telegram",
    },
    {
      icon: <Clock className="text-amber-600" />,
      title: "Response Time",
      detail: "Within 24 Hours",
      sub: "Monday - Friday",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sky-600 font-bold transition-all hover:gap-3"
            >
              <ArrowLeft size={20} /> <span>Back to Home</span>
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Info */}
            <div className="lg:col-span-5 space-y-12">
              <header className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
                  Get in{" "}
                  <span className="text-sky-600 underline decoration-sky-100">
                    Touch
                  </span>
                </h1>
                <p className="text-gray-500 text-lg font-medium leading-relaxed">
                  Have a question about a scholarship or interested in a
                  partnership? Our team is here to help you navigate your global
                  education journey.
                </p>
              </header>

              <div className="grid gap-6">
                {contactInfo.map((info, i) => (
                  <div
                    key={i}
                    className="flex gap-5 p-6 rounded-[24px] bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{info.title}</h3>
                      <p className="text-sky-600 font-bold text-sm">
                        {info.detail}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 font-medium uppercase tracking-widest">
                        {info.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <section className="lg:col-span-7">
              <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[40px] p-8 sm:p-12 border border-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Globe size={120} className="text-sky-600" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                    Send a Message
                  </h2>
                  <ContactForm />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;

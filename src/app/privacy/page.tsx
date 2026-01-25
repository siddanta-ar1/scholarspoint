import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Cookie, Eye, Lock, Mail, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | ScholarsPoint",
  description:
    "Learn how ScholarsPoint collects, uses, and protects your personal information. Our comprehensive privacy policy covers data collection, cookies, advertising, and your rights.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description: "ScholarsPoint Privacy Policy - How we handle your data",
    publisher: {
      "@type": "Organization",
      name: "ScholarsPoint",
      url: "https://scholarspoint.net",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              Your privacy is important to us. This policy explains how
              ScholarsPoint collects, uses, and protects your personal
              information.
            </p>
            <p className="text-sm text-white/70 mt-4">
              Last Updated: January 25, 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-sky max-w-none">
              {/* Introduction */}
              <section className="mb-12 p-6 bg-sky-50 rounded-3xl border border-sky-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Globe className="text-sky-600" size={24} />
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to ScholarsPoint (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). ScholarsPoint
                  is a comprehensive platform dedicated to connecting students,
                  researchers, and professionals worldwide with international
                  scholarships, fellowships, internships, and visa guidance
                  opportunities. We are committed to protecting your personal
                  information and your right to privacy. This Privacy Policy
                  explains what information we collect, how we use it, and what
                  rights you have in relation to it.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By accessing or using our website at{" "}
                  <a
                    href="https://scholarspoint.net"
                    className="text-sky-600 hover:underline"
                  >
                    scholarspoint.net
                  </a>
                  , you agree to the collection and use of information in
                  accordance with this policy. If you have any questions or
                  concerns about this policy or our practices, please contact us
                  at{" "}
                  <a
                    href="mailto:support@scholarspoint.net"
                    className="text-sky-600 hover:underline"
                  >
                    support@scholarspoint.net
                  </a>
                  .
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Eye className="text-sky-600" size={24} />
                  Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information that you provide directly to us, as
                  well as information that is automatically collected when you
                  use our services.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Personal Information You Provide
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Account Information:</strong> When you create an
                    account, we collect your email address, name, and password.
                  </li>
                  <li>
                    <strong>Profile Information:</strong> You may choose to
                    provide additional information such as your educational
                    background, country of residence, and areas of interest.
                  </li>
                  <li>
                    <strong>Communication Data:</strong> When you contact us
                    through our contact form, email, or social media channels,
                    we collect the information you provide in those
                    communications.
                  </li>
                  <li>
                    <strong>Saved Preferences:</strong> Information about
                    scholarships, internships, and opportunities you bookmark or
                    save for later.
                  </li>
                  <li>
                    <strong>Feedback and Survey Responses:</strong> Any feedback
                    you provide about our services or responses to surveys.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Automatically Collected Information
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Device Information:</strong> Browser type, operating
                    system, device type, and unique device identifiers.
                  </li>
                  <li>
                    <strong>Log Data:</strong> IP address, access times, pages
                    viewed, referring URL, and the page you visited before
                    navigating to our services.
                  </li>
                  <li>
                    <strong>Usage Information:</strong> How you interact with
                    our website, including search queries, opportunities viewed,
                    and features used.
                  </li>
                  <li>
                    <strong>Location Information:</strong> General location data
                    derived from your IP address.
                  </li>
                </ul>
              </section>

              {/* Cookies and Advertising */}
              <section className="mb-10 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Cookie className="text-amber-600" size={24} />
                  Cookies, Tracking Technologies, and Advertising
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to collect
                  and use personal information about you, including to serve
                  interest-based advertising. This section provides important
                  information about our advertising partners and how they
                  collect data.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Google AdSense and Third-Party Advertising
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>
                    ScholarsPoint uses Google AdSense to display advertisements
                    on our website.
                  </strong>{" "}
                  Google AdSense is an advertising service provided by Google
                  LLC. Google, as a third-party vendor, uses cookies to serve
                  ads on our site. Google&apos;s use of the DART cookie enables it
                  and its partners to serve ads to our users based on their
                  visit to our site and other sites on the Internet.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Users may opt out of personalized advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline"
                  >
                    Google Ads Settings
                  </a>
                  . Alternatively, you can opt out of third-party vendor&apos;s use
                  of cookies for personalized advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:underline"
                  >
                    www.aboutads.info
                  </a>
                  .
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Types of Cookies We Use
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the
                    operation of our website, including user authentication and
                    security.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> We use Google Analytics
                    to understand how visitors interact with our website. This
                    helps us improve our services and user experience.
                  </li>
                  <li>
                    <strong>Advertising Cookies:</strong> Used by Google AdSense
                    and advertising partners to deliver personalized
                    advertisements based on your interests and browsing history.
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings
                    and preferences for a better experience.
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Third-Party Advertising Partners
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Third-party ad servers or ad networks use technologies like
                  cookies, JavaScript, or Web Beacons in their respective
                  advertisements and links that appear on ScholarsPoint. They
                  automatically receive your IP address when this occurs. These
                  technologies are used to measure the effectiveness of their
                  advertising campaigns and/or to personalize the advertising
                  content that you see on websites that you visit. Note that
                  ScholarsPoint has no access to or control over these cookies
                  that are used by third-party advertisers.
                </p>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes,
                  including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Providing, maintaining, and improving our services and
                    platform functionality
                  </li>
                  <li>
                    Personalizing your experience and delivering scholarship
                    recommendations based on your interests
                  </li>
                  <li>
                    Sending you updates about new scholarships, fellowships, and
                    opportunities that match your preferences
                  </li>
                  <li>
                    Responding to your comments, questions, and providing
                    customer support
                  </li>
                  <li>
                    Analyzing usage patterns to improve our website and develop
                    new features
                  </li>
                  <li>
                    Displaying advertisements through Google AdSense and
                    measuring their effectiveness
                  </li>
                  <li>
                    Detecting, preventing, and addressing technical issues and
                    security threats
                  </li>
                  <li>Complying with legal obligations and enforcing our terms</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How We Share Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Service Providers:</strong> With third-party
                    companies that perform services on our behalf, such as
                    hosting, analytics (Google Analytics), and email delivery.
                  </li>
                  <li>
                    <strong>Advertising Partners:</strong> With Google AdSense
                    and other advertising partners for the purpose of displaying
                    relevant advertisements.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or
                    to respond to legal process, protect our rights, or ensure
                    the safety of our users.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with any
                    merger, sale of company assets, or acquisition.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> When you have given us
                    explicit permission to share your information.
                  </li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-10 p-6 bg-green-50 rounded-3xl border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Lock className="text-green-600" size={24} />
                  Data Security and Retention
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                  These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>SSL/TLS encryption for data in transit</li>
                  <li>Secure password hashing and authentication systems</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls limiting employee access to personal data</li>
                  <li>Secure hosting infrastructure provided by trusted providers</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We retain your personal information for as long as necessary
                  to provide our services, comply with legal obligations,
                  resolve disputes, and enforce our agreements. When you delete
                  your account, we will delete or anonymize your personal
                  information within 30 days, unless retention is required by
                  law.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Privacy Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights
                  regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal
                    information we hold about you.
                  </li>
                  <li>
                    <strong>Correction:</strong> Request that we correct any
                    inaccurate or incomplete personal information.
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request that we delete your
                    personal information, subject to certain exceptions.
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in
                    a structured, machine-readable format.
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Opt out of marketing
                    communications and personalized advertising at any time.
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> Where we rely on consent
                    to process your data, you may withdraw consent at any time.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise any of these rights, please contact us at{" "}
                  <a
                    href="mailto:support@scholarspoint.net"
                    className="text-sky-600 hover:underline"
                  >
                    support@scholarspoint.net
                  </a>
                  . We will respond to your request within 30 days.
                </p>
              </section>

              {/* International Users */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  International Data Transfers
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  ScholarsPoint is based in Nepal and our services are provided
                  globally. If you are accessing our services from outside
                  Nepal, please be aware that your information may be
                  transferred to, stored, and processed in countries where our
                  servers are located and our central database is operated. By
                  using our services, you consent to the transfer of your
                  information to countries outside your country of residence,
                  which may have different data protection rules.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under the age of
                  13. We do not knowingly collect personal information from
                  children under 13. If you are a parent or guardian and believe
                  that your child has provided us with personal information,
                  please contact us immediately at{" "}
                  <a
                    href="mailto:support@scholarspoint.net"
                    className="text-sky-600 hover:underline"
                  >
                    support@scholarspoint.net
                  </a>
                  , and we will take steps to delete such information from our
                  systems.
                </p>
              </section>

              {/* Changes to Policy */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices or for other operational, legal, or
                  regulatory reasons. We will notify you of any material changes
                  by posting the new Privacy Policy on this page and updating
                  the &quot;Last Updated&quot; date above. We encourage you to review this
                  Privacy Policy periodically for any changes.
                </p>
              </section>

              {/* Contact */}
              <section className="p-6 bg-sky-50 rounded-3xl border border-sky-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Mail className="text-sky-600" size={24} />
                  Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, your
                  personal data, or would like to exercise your privacy rights,
                  please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@scholarspoint.net"
                      className="text-sky-600 hover:underline"
                    >
                      support@scholarspoint.net
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://scholarspoint.net/contact"
                      className="text-sky-600 hover:underline"
                    >
                      scholarspoint.net/contact
                    </a>
                  </p>
                  <p>
                    <strong>Organization:</strong> ScholarsPoint
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

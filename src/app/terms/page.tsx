import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, AlertTriangle, Users, Shield, Gavel } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | ScholarsPoint",
  description:
    "Read the terms and conditions governing your use of ScholarsPoint. Understand your rights, responsibilities, and our policies for using our scholarship and opportunity platform.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfServicePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service",
    description: "ScholarsPoint Terms of Service and Conditions of Use",
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
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <FileText className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Terms of Service
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              These terms govern your use of ScholarsPoint. Please read them
              carefully before using our services.
            </p>
            <p className="text-sm text-white/70 mt-4">
              Last Updated: January 25, 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-indigo max-w-none">
              {/* Introduction */}
              <section className="mb-12 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Scale className="text-indigo-600" size={24} />
                  Agreement to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to ScholarsPoint! These Terms of Service
                  (&quot;Terms&quot;) constitute a legally binding agreement
                  between you (&quot;User,&quot; &quot;you,&quot; or
                  &quot;your&quot;) and ScholarsPoint (&quot;Company,&quot;
                  &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) governing
                  your access to and use of our website at{" "}
                  <a
                    href="https://scholarspoint.net"
                    className="text-indigo-600 hover:underline"
                  >
                    scholarspoint.net
                  </a>{" "}
                  and all associated services, features, and content
                  (collectively, the &quot;Services&quot;).
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By accessing or using our Services, you acknowledge that you
                  have read, understood, and agree to be bound by these Terms.
                  If you do not agree to these Terms, you must not access or use
                  our Services.
                </p>
              </section>

              {/* Eligibility */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Users className="text-indigo-600" size={24} />
                  Eligibility and Account Registration
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use ScholarsPoint, you must be at least 13 years of age. If
                  you are under 18, you represent that you have obtained consent
                  from a parent or legal guardian to use the Services.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Account Responsibilities
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account.
                  </li>
                  <li>
                    You agree to provide accurate, current, and complete
                    information during registration and to update such
                    information to keep it accurate and complete.
                  </li>
                  <li>
                    You must notify us immediately of any unauthorized use of
                    your account or any other breach of security.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts that
                    violate these Terms or that we believe may pose security
                    risks.
                  </li>
                </ul>
              </section>

              {/* Acceptable Use */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Acceptable Use Policy
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree to use the Services only for lawful purposes and in
                  accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Use the Services in any way that violates any applicable
                    federal, state, local, or international law or regulation.
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion of the
                    Services, other users&apos; accounts, or any systems or networks
                    connected to the Services.
                  </li>
                  <li>
                    Use any robot, spider, scraper, or other automated means to
                    access the Services without our express written permission.
                  </li>
                  <li>
                    Transmit any viruses, malware, or other malicious code that
                    may harm the Services or other users.
                  </li>
                  <li>
                    Impersonate or attempt to impersonate ScholarsPoint, a
                    ScholarsPoint employee, another user, or any other person or
                    entity.
                  </li>
                  <li>
                    Engage in any conduct that restricts or inhibits anyone&apos;s
                    use or enjoyment of the Services.
                  </li>
                  <li>
                    Use the Services to send unsolicited promotional or
                    marketing material (spam).
                  </li>
                  <li>
                    Copy, modify, distribute, sell, or lease any part of the
                    Services or included software.
                  </li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-10 p-6 bg-purple-50 rounded-3xl border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Intellectual Property Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Services and all content, features, and functionality
                  (including but not limited to all information, software, text,
                  displays, images, video, and audio, and the design, selection,
                  and arrangement thereof) are owned by ScholarsPoint, its
                  licensors, or other providers and are protected by copyright,
                  trademark, patent, trade secret, and other intellectual
                  property or proprietary rights laws.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Limited License
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Subject to these Terms, we grant you a limited, non-exclusive,
                  non-transferable, revocable license to access and use the
                  Services for your personal, non-commercial use. This license
                  does not include the right to: (a) modify or copy the
                  materials; (b) use the materials for any commercial purpose;
                  (c) remove any copyright or other proprietary notations from
                  the materials; or (d) transfer the materials to another person
                  or &quot;mirror&quot; the materials on any other server.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  User Content
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of any content you submit, post, or
                  display on or through the Services. By submitting content, you
                  grant us a worldwide, non-exclusive, royalty-free license to
                  use, reproduce, modify, and display such content in connection
                  with the Services.
                </p>
              </section>

              {/* Third-Party Content */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Third-Party Content and Opportunity Listings
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ScholarsPoint provides information about scholarships,
                  internships, fellowships, and other educational opportunities
                  offered by third-party organizations. It is important to
                  understand:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>No Guarantee:</strong> We do not guarantee the
                    accuracy, completeness, or availability of any opportunity
                    listing. Details such as deadlines, eligibility criteria,
                    and funding amounts are subject to change by the offering
                    organization.
                  </li>
                  <li>
                    <strong>No Endorsement:</strong> Inclusion of an opportunity
                    on our platform does not constitute an endorsement or
                    recommendation by ScholarsPoint.
                  </li>
                  <li>
                    <strong>Verification Required:</strong> Users are strongly
                    encouraged to verify all information directly with the
                    offering organization before applying.
                  </li>
                  <li>
                    <strong>No Affiliation:</strong> ScholarsPoint is not
                    affiliated with, sponsored by, or endorsed by any
                    scholarship, fellowship, or internship provider unless
                    explicitly stated.
                  </li>
                </ul>
              </section>

              {/* Disclaimer */}
              <section className="mb-10 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <AlertTriangle className="text-amber-600" size={24} />
                  Disclaimer of Warranties
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4 uppercase font-semibold text-sm">
                  THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                  AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the fullest extent permitted by applicable law,
                  ScholarsPoint disclaims all warranties, express or implied,
                  including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Implied warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties that the Services will be uninterrupted, error-free, or secure</li>
                  <li>Warranties regarding the accuracy or reliability of any content or information</li>
                  <li>Warranties that defects will be corrected or that the Services are free of viruses</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Shield className="text-indigo-600" size={24} />
                  Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by applicable law, in no event
                  shall ScholarsPoint, its officers, directors, employees,
                  agents, or affiliates be liable for any:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Indirect, incidental, special, consequential, or punitive
                    damages
                  </li>
                  <li>
                    Loss of profits, revenue, data, use, goodwill, or other
                    intangible losses
                  </li>
                  <li>
                    Damages resulting from your access to or use of (or
                    inability to access or use) the Services
                  </li>
                  <li>
                    Damages resulting from any content or conduct of any third
                    party on the Services
                  </li>
                  <li>
                    Damages resulting from unauthorized access, use, or
                    alteration of your content or transmissions
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  ScholarsPoint is not responsible for any missed scholarship
                  deadlines, rejected applications, or any decisions made by
                  third-party scholarship or opportunity providers.
                </p>
              </section>

              {/* Indemnification */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Indemnification
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless ScholarsPoint
                  and its officers, directors, employees, contractors, agents,
                  licensors, and suppliers from and against any claims,
                  liabilities, damages, judgments, awards, losses, costs,
                  expenses, or fees (including reasonable attorneys&apos; fees)
                  arising out of or relating to your violation of these Terms or
                  your use of the Services.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Termination
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may terminate or suspend your access to the Services
                  immediately, without prior notice or liability, for any reason
                  whatsoever, including without limitation if you breach these
                  Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use the Services will cease
                  immediately. All provisions of the Terms which by their nature
                  should survive termination shall survive, including ownership
                  provisions, warranty disclaimers, indemnity, and limitations
                  of liability.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-10 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Gavel className="text-indigo-600" size={24} />
                  Governing Law and Dispute Resolution
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance
                  with the laws of Nepal, without regard to its conflict of law
                  provisions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any disputes arising out of or relating to these Terms or the
                  Services shall be resolved through good faith negotiations. If
                  negotiations fail, disputes shall be submitted to the
                  exclusive jurisdiction of the courts located in Nepal.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Changes to These Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any
                  time at our sole discretion. If a revision is material, we
                  will provide at least 30 days&apos; notice prior to any new terms
                  taking effect. What constitutes a material change will be
                  determined at our sole discretion. By continuing to access or
                  use our Services after those revisions become effective, you
                  agree to be bound by the revised terms.
                </p>
              </section>

              {/* Severability */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Severability and Waiver
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Severability:</strong> If any provision of these Terms
                  is held to be invalid or unenforceable, that provision will be
                  enforced to the maximum extent permissible, and the other
                  provisions of the Terms will remain in full force and effect.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Waiver:</strong> Our failure to enforce any right or
                  provision of these Terms will not be considered a waiver of
                  those rights. The waiver of any such right or provision will
                  be effective only if in writing and signed by a duly
                  authorized representative of ScholarsPoint.
                </p>
              </section>

              {/* Contact */}
              <section className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@scholarspoint.net"
                      className="text-indigo-600 hover:underline"
                    >
                      support@scholarspoint.net
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://scholarspoint.net/contact"
                      className="text-indigo-600 hover:underline"
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

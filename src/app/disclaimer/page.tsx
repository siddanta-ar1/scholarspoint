import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle, FileWarning, Scale, Mail, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | ScholarsPoint",
  description:
    "Important disclaimer about the information provided on ScholarsPoint. Understand the limitations of our content, DMCA policy, and how we aggregate scholarship and opportunity data.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Disclaimer",
    description: "ScholarsPoint Disclaimer and DMCA Policy",
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
        <div className="bg-gradient-to-br from-rose-600 via-red-600 to-orange-700 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
            >
              <ArrowLeft size={18} /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <FileWarning className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Disclaimer
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              Important information about the content, data sources, and
              limitations of ScholarsPoint.
            </p>
            <p className="text-sm text-white/70 mt-4">
              Last Updated: March 27, 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-red max-w-none">
              {/* General Disclaimer */}
              <section className="mb-12 p-6 bg-rose-50 rounded-3xl border border-rose-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <AlertCircle className="text-rose-600" size={24} />
                  General Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The information provided on ScholarsPoint (
                  <a
                    href="https://scholarspoint.net"
                    className="text-rose-600 hover:underline"
                  >
                    scholarspoint.net
                  </a>
                  ) is for <strong>general informational purposes only</strong>.
                  While we strive to keep the information up to date and
                  accurate, we make no representations or warranties of any
                  kind, express or implied, about the completeness, accuracy,
                  reliability, suitability, or availability of the information,
                  products, services, or related graphics contained on this
                  website.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Any reliance you place on such information is therefore
                  <strong> strictly at your own risk</strong>. In no event will
                  we be liable for any loss or damage including without
                  limitation, indirect or consequential loss or damage, or any
                  loss or damage whatsoever arising from the use of this
                  website.
                </p>
              </section>

              {/* Content Aggregation */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Scale className="text-rose-600" size={24} />
                  Content Aggregation &amp; Sources
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ScholarsPoint is a <strong>content aggregation platform</strong>.
                  We curate, compile, and present information about scholarships,
                  fellowships, internships, exchange programs, and visa guidance
                  sourced from publicly available information published by
                  universities, governments, non-profit organizations, and other
                  legitimate institutions worldwide.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <strong>We are NOT the official source</strong> of any
                    scholarship, fellowship, internship, or opportunity listed on
                    our platform. All opportunity details (including eligibility,
                    deadlines, funding amounts, and application procedures)
                    originate from and are owned by their respective
                    organizations.
                  </li>
                  <li>
                    <strong>We do not guarantee accuracy:</strong> Information
                    about opportunities may change at any time without notice.
                    Deadlines, eligibility criteria, and funding details are
                    subject to change by the offering organization.
                  </li>
                  <li>
                    <strong>We strongly encourage</strong> all users to verify
                    information directly with the official organization or
                    institution before making any decisions or submitting
                    applications.
                  </li>
                  <li>
                    <strong>No endorsement:</strong> Listing an opportunity on
                    ScholarsPoint does not constitute an endorsement,
                    recommendation, or guarantee of any program, organization,
                    or institution.
                  </li>
                  <li>
                    <strong>No affiliation:</strong> Unless explicitly stated,
                    ScholarsPoint is not affiliated with, sponsored by, or
                    endorsed by any scholarship provider, university, or
                    organization featured on our platform.
                  </li>
                </ul>
              </section>

              {/* Application Disclaimer */}
              <section className="mb-10 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Application &amp; Selection Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ScholarsPoint is an <strong>information platform only</strong>.
                  We do not process, review, or have any influence over
                  scholarship or opportunity applications. Specifically:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    We do not accept, process, or forward applications on behalf
                    of any organization.
                  </li>
                  <li>
                    We have no role in the selection or decision-making process
                    of any scholarship, fellowship, or internship provider.
                  </li>
                  <li>
                    We cannot guarantee admission, selection, or funding for any
                    opportunity listed on our platform.
                  </li>
                  <li>
                    We are not responsible for any missed deadlines, rejected
                    applications, or any outcomes resulting from the use of
                    information on our website.
                  </li>
                </ul>
              </section>

              {/* External Links */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  External Links Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website contains links to external websites that are not
                  operated or controlled by ScholarsPoint. We have no control
                  over the content, privacy policies, or practices of any
                  third-party websites. We do not endorse or assume
                  responsibility for the content, privacy policies, or practices
                  of any third-party sites or services. We strongly advise you
                  to review the privacy policy and terms of service of every
                  external site you visit.
                </p>
              </section>

              {/* Advertising Disclaimer */}
              <section className="mb-10 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Advertising Disclaimer
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ScholarsPoint displays advertisements through Google AdSense
                  and may include other third-party advertising services. These
                  advertisements help us keep our platform free for all users.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Advertisements appearing on our website do not constitute
                    endorsements of the products or services advertised.
                  </li>
                  <li>
                    ScholarsPoint is not responsible for the content of
                    third-party advertisements.
                  </li>
                  <li>
                    Users should exercise their own judgment when interacting
                    with advertisements on our site.
                  </li>
                </ul>
              </section>

              {/* DMCA Policy */}
              <section className="mb-10 p-6 bg-green-50 rounded-3xl border border-green-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Shield className="text-green-600" size={24} />
                  DMCA &amp; Copyright Policy
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ScholarsPoint respects the intellectual property rights of
                  others and expects our users to do the same. If you believe
                  that any content on our website infringes upon your copyright,
                  please notify us immediately.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  How to Submit a DMCA Takedown Notice
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you are a copyright owner or authorized to act on behalf of
                  one, and you believe that copyrighted material has been used on
                  our site in a way that constitutes copyright infringement,
                  please submit a written notice to our DMCA agent at{" "}
                  <a
                    href="mailto:support@scholarspoint.net"
                    className="text-rose-600 hover:underline"
                  >
                    support@scholarspoint.net
                  </a>{" "}
                  with the following information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    A description of the copyrighted work that you claim has been
                    infringed.
                  </li>
                  <li>
                    A description of where the infringing material is located on
                    our site (please provide the URL).
                  </li>
                  <li>
                    Your contact information (name, address, telephone number,
                    and email address).
                  </li>
                  <li>
                    A statement that you have a good faith belief that the
                    disputed use is not authorized by the copyright owner, its
                    agent, or the law.
                  </li>
                  <li>
                    A statement, made under penalty of perjury, that the
                    information in the notice is accurate and that you are the
                    copyright owner or authorized to act on behalf of the
                    copyright owner.
                  </li>
                  <li>
                    Your physical or electronic signature.
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Upon receiving a valid DMCA notice, we will promptly
                  investigate and take appropriate action, which may include
                  removing or disabling access to the allegedly infringing
                  content.
                </p>
              </section>

              {/* Professional Advice */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Not Professional Advice
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The content on ScholarsPoint, including blog posts, guides, and
                  visa information, is provided for general informational
                  purposes and should not be construed as professional legal,
                  financial, immigration, or academic advisory services. Always
                  consult with qualified professionals for advice specific to
                  your situation, especially regarding visa applications,
                  immigration matters, and financial decisions.
                </p>
              </section>

              {/* Contact */}
              <section className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Mail className="text-rose-600" size={24} />
                  Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions or concerns about this disclaimer, or
                  if you wish to report inaccurate information or submit a
                  copyright notice, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@scholarspoint.net"
                      className="text-rose-600 hover:underline"
                    >
                      support@scholarspoint.net
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://scholarspoint.net/contact"
                      className="text-rose-600 hover:underline"
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

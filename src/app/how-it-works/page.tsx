import { Metadata } from "next";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    BookOpen,
    FileText,
    Send,
    CheckCircle2,
    ArrowRight,
    GraduationCap,
    Globe,
    Bell,
    Users,
} from "lucide-react";

export const metadata: Metadata = {
    title: "How It Works | ScholarsPoint",
    description:
        "Learn how to use ScholarsPoint to find and apply for international scholarships, fellowships, and internships. Step-by-step guide to achieving your study abroad dreams.",
    alternates: {
        canonical: "/how-it-works",
    },
    openGraph: {
        title: "How ScholarsPoint Works",
        description:
            "Your complete guide to finding scholarships and opportunities on ScholarsPoint.",
        url: "https://scholarspoint.net/how-it-works",
    },
};

const steps = [
    {
        number: 1,
        icon: Search,
        title: "Browse Our Opportunity Database",
        description:
            "Start by exploring our comprehensive database of verified international scholarships, fellowships, internships, and exchange programs. Use our advanced search and filtering options to narrow down opportunities that match your academic level, field of study, target country, and funding preferences.",
        tips: [
            "Use filters to find opportunities by deadline, country, or study level",
            "Browse category pages for scholarships, fellowships, or internships",
            "Check our blog for featured opportunities and application tips",
        ],
        color: "sky",
    },
    {
        number: 2,
        icon: BookOpen,
        title: "Research Each Opportunity",
        description:
            "Click on any opportunity to view its complete details including eligibility criteria, required documents, application deadlines, funding coverage, and official application links. Each listing is manually verified by our team to ensure accuracy and legitimacy.",
        tips: [
            "Read eligibility requirements carefully before starting your application",
            "Note all required documents and start gathering them early",
            "Check if English proficiency tests (IELTS/TOEFL) are required",
        ],
        color: "emerald",
    },
    {
        number: 3,
        icon: FileText,
        title: "Prepare Your Application Materials",
        description:
            "Strong applications require careful preparation. Gather essential documents like academic transcripts, letters of recommendation, statement of purpose, and proof of English proficiency. Our blog offers comprehensive guides on writing compelling application essays and preparing for interviews.",
        tips: [
            "Start drafting your statement of purpose at least 2 weeks before deadline",
            "Request recommendation letters from professors who know your work well",
            "Have your documents reviewed by teachers or mentors before submission",
        ],
        color: "violet",
    },
    {
        number: 4,
        icon: Send,
        title: "Submit Your Application",
        description:
            "Each opportunity listing on ScholarsPoint includes a direct link to the official application portal. Click the 'Apply Now' button to be taken directly to the scholarship provider's website where you can complete and submit your application. Always apply well before the deadline to avoid technical issues.",
        tips: [
            "Save copies of everything you submit for your records",
            "Apply to multiple scholarships to increase your chances",
            "Submit at least 48 hours before the deadline to avoid last-minute issues",
        ],
        color: "amber",
    },
];

const features = [
    {
        icon: GraduationCap,
        title: "Verified Opportunities",
        description:
            "Every scholarship and program on our platform is manually verified against official sources to ensure legitimacy.",
    },
    {
        icon: Globe,
        title: "Global Coverage",
        description:
            "Access opportunities from 50+ countries including USA, UK, Canada, Australia, Germany, and more.",
    },
    {
        icon: Bell,
        title: "Daily Updates",
        description:
            "Our team updates the database daily, adding new opportunities and removing expired listings.",
    },
    {
        icon: Users,
        title: "Free Forever",
        description:
            "ScholarsPoint is completely free for students. No hidden fees, no premium tiers, no paywalls.",
    },
];

const colorClasses = {
    sky: "bg-sky-100 text-sky-600 border-sky-200",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
    violet: "bg-violet-100 text-violet-600 border-violet-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200",
};

export default function HowItWorksPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Find and Apply for Scholarships on ScholarsPoint",
        description:
            "A step-by-step guide to discovering and applying for international scholarships, fellowships, and internships using ScholarsPoint.",
        step: steps.map((step) => ({
            "@type": "HowToStep",
            position: step.number,
            name: step.title,
            text: step.description,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
                    <div className="container mx-auto px-4 py-12 md:py-16">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft size={18} /> Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                            How <span className="text-violet-200">ScholarsPoint</span> Works
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                            Your complete guide to finding and applying for international
                            scholarships, fellowships, and study abroad opportunities.
                        </p>
                    </div>
                </div>

                {/* Steps Section */}
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
                                Four Simple Steps to Your Dream Opportunity
                            </h2>

                            <div className="space-y-8 md:space-y-12">
                                {steps.map((step) => {
                                    const Icon = step.icon;
                                    return (
                                        <div
                                            key={step.number}
                                            className="relative flex flex-col md:flex-row gap-6 p-6 md:p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
                                        >
                                            {/* Step Number */}
                                            <div className="shrink-0">
                                                <div
                                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${colorClasses[step.color as keyof typeof colorClasses]
                                                        }`}
                                                >
                                                    <Icon size={28} />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-gray-400 uppercase">
                                                        Step {step.number}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>

                                                {/* Tips */}
                                                <div className="pt-2">
                                                    <p className="text-sm font-semibold text-gray-500 mb-2">
                                                        Pro Tips:
                                                    </p>
                                                    <ul className="space-y-2">
                                                        {step.tips.map((tip, i) => (
                                                            <li
                                                                key={i}
                                                                className="flex items-start gap-2 text-sm text-gray-600"
                                                            >
                                                                <CheckCircle2
                                                                    size={16}
                                                                    className="shrink-0 mt-0.5 text-emerald-500"
                                                                />
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-12 md:py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
                                Why Students Trust ScholarsPoint
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={feature.title}
                                            className="p-6 bg-white rounded-2xl border border-gray-100"
                                        >
                                            <Icon className="w-10 h-10 text-indigo-600 mb-4" />
                                            <h3 className="font-bold text-gray-900 mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-black text-gray-900 mb-6">
                                About ScholarsPoint
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-600">
                                <p className="leading-relaxed">
                                    ScholarsPoint was founded with a simple mission: to democratize
                                    access to international education opportunities. We believe that
                                    every student, regardless of their financial background or
                                    geographic location, deserves the chance to pursue their academic
                                    dreams at world-class institutions.
                                </p>
                                <p className="leading-relaxed mt-4">
                                    Our platform aggregates thousands of fully-funded scholarships,
                                    fellowships, internships, and exchange programs from universities,
                                    governments, and organizations around the world. Unlike other
                                    scholarship databases, we manually verify each opportunity to
                                    ensure accuracy and legitimacy, protecting students from scams
                                    and outdated information.
                                </p>
                                <p className="leading-relaxed mt-4">
                                    Whether you&apos;re a high school student exploring undergraduate
                                    opportunities, a graduate seeking research fellowships, or a
                                    professional looking to advance your career through international
                                    experience, ScholarsPoint is your trusted companion on the journey
                                    to academic and professional success.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] text-center text-white">
                            <h2 className="text-3xl md:text-4xl font-black mb-4">
                                Ready to Start Your Journey?
                            </h2>
                            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                                Begin exploring thousands of scholarships and opportunities
                                waiting for you. Your dream school might be just a click away.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/scholarships"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                                >
                                    Browse Scholarships
                                    <ArrowRight className="ml-2" size={18} />
                                </Link>
                                <Link
                                    href="/faq"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition-colors border border-white/30"
                                >
                                    View FAQ
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

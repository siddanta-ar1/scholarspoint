import { Search, BookOpen, FileText, Send } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Discover Opportunities",
        description:
            "Browse our extensive database of fully-funded scholarships, internships, fellowships, and exchange programs. Use our advanced filters to find opportunities that match your academic level, field of study, and preferred destination country.",
        color: "sky",
    },
    {
        number: "02",
        icon: BookOpen,
        title: "Research Requirements",
        description:
            "Each opportunity listing includes detailed eligibility criteria, required documents, application deadlines, and funding coverage. Read our visa guides and blog articles for insider tips on successful applications.",
        color: "emerald",
    },
    {
        number: "03",
        icon: FileText,
        title: "Prepare Your Application",
        description:
            "Gather required documents like transcripts, recommendation letters, and statements of purpose. Our platform provides links to official application portals and helpful resources to strengthen your application.",
        color: "violet",
    },
    {
        number: "04",
        icon: Send,
        title: "Apply and Track",
        description:
            "Submit your application directly through the official scholarship or program website. Save opportunities to your bookmarks to track deadlines and receive updates when new matching opportunities are posted.",
        color: "amber",
    },
];

const colorClasses = {
    sky: "bg-sky-100 text-sky-600 border-sky-200",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
    violet: "bg-violet-100 text-violet-600 border-violet-200",
    amber: "bg-amber-100 text-amber-600 border-amber-200",
};

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-full mb-4">
                        Getting Started
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        How <span className="text-indigo-600">ScholarsPoint</span> Works
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Finding and applying for international scholarships has never been
                        easier. ScholarsPoint streamlines your journey from discovery to
                        application with our user-friendly platform designed specifically
                        for students seeking global education opportunities.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.number}
                                className="relative p-6 md:p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Step Number */}
                                <span className="absolute -top-4 -left-2 text-7xl font-black text-gray-100 select-none">
                                    {step.number}
                                </span>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${colorClasses[step.color as keyof typeof colorClasses]
                                            }`}
                                    >
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="mt-12 md:mt-16 text-center">
                    <p className="text-gray-600 mb-6 text-lg">
                        Ready to start your journey to international education?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/scholarships"
                            className="inline-flex items-center justify-center px-8 py-4 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
                        >
                            Explore Scholarships
                        </Link>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Read Our Guides
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

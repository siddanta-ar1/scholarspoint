import {
    GraduationCap,
    Globe,
    FileCheck,
    Bell,
    Search,
    Shield,
} from "lucide-react";

const features = [
    {
        icon: GraduationCap,
        title: "Curated Scholarships",
        description:
            "Access hundreds of verified, fully-funded scholarships from prestigious universities worldwide. We manually verify each opportunity to ensure authenticity and current availability.",
        color: "sky",
    },
    {
        icon: Globe,
        title: "Global Opportunities",
        description:
            "Discover international internships, fellowships, and exchange programs across 50+ countries. From the USA to Japan, Germany to Australia - your dream destination awaits.",
        color: "emerald",
    },
    {
        icon: FileCheck,
        title: "Visa Guidance",
        description:
            "Comprehensive student visa guides with step-by-step instructions, document checklists, and interview tips for major study destinations including USA, UK, Canada, and Australia.",
        color: "violet",
    },
    {
        icon: Bell,
        title: "Daily Updates",
        description:
            "Our team updates the platform daily with new scholarship deadlines and opportunities. Never miss an important deadline with our notification system.",
        color: "amber",
    },
    {
        icon: Search,
        title: "Smart Search",
        description:
            "Find exactly what you're looking for with our advanced filtering system. Search by country, study level, funding type, deadline, and field of study.",
        color: "rose",
    },
    {
        icon: Shield,
        title: "Verified Information",
        description:
            "Every scholarship and opportunity is verified against official sources. We cross-check deadlines, eligibility criteria, and application requirements for accuracy.",
        color: "indigo",
    },
];

const colorClasses = {
    sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
};

export default function WhyScholarsPoint() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-700 font-semibold text-sm rounded-full mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        Your Trusted Partner in{" "}
                        <span className="text-sky-600">Global Education</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        ScholarsPoint is dedicated to connecting ambitious students with
                        life-changing international opportunities. We believe that
                        financial constraints should never be a barrier to quality
                        education. Our platform simplifies the complex world of
                        scholarships, fellowships, and visa processes, making your study
                        abroad dreams achievable.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <article
                                key={feature.title}
                                className="group p-6 md:p-8 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${colorClasses[feature.color as keyof typeof colorClasses]
                                        }`}
                                >
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </article>
                        );
                    })}
                </div>

                {/* Mission Statement */}
                <div className="mt-16 md:mt-20 p-8 md:p-12 bg-gradient-to-br from-sky-600 to-blue-700 rounded-[40px] text-white text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        To democratize access to international education by providing free,
                        verified, and comprehensive information about scholarships,
                        fellowships, and global opportunities. We aim to empower students
                        from all backgrounds to pursue their academic dreams without
                        geographical or financial limitations. Every student deserves the
                        chance to study at world-class institutions, and ScholarsPoint is
                        here to make that possible.
                    </p>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronDown, HelpCircle, Search, GraduationCap, FileText, Globe } from "lucide-react";

const faqCategories = [
    {
        title: "Scholarships & Applications",
        icon: GraduationCap,
        questions: [
            {
                q: "What is ScholarsPoint and how does it help students?",
                a: "ScholarsPoint is a free educational platform that aggregates verified international scholarships, fellowships, internships, and exchange programs from universities and organizations worldwide. We help students discover fully-funded opportunities, understand eligibility requirements, and navigate the application process. Our team manually verifies each listing and updates deadlines daily to ensure accuracy."
            },
            {
                q: "Are the scholarships listed on ScholarsPoint free to apply?",
                a: "Yes, all scholarships listed on ScholarsPoint are free to apply. We only feature legitimate opportunities from recognized universities, governments, and organizations. Beware of any external sources that ask for application fees for scholarship applications. Legitimate scholarships never charge students to apply."
            },
            {
                q: "How do I apply for scholarships through ScholarsPoint?",
                a: "ScholarsPoint is an information platform, not an application portal. Each scholarship listing includes a direct link to the official application page where you can submit your application. We provide detailed information about requirements, deadlines, and eligibility criteria to help you prepare, but the actual application is submitted directly to the scholarship provider."
            },
            {
                q: "What documents do I typically need for scholarship applications?",
                a: "Common requirements include: academic transcripts, proof of English proficiency (IELTS/TOEFL), letters of recommendation (2-3), statement of purpose or personal essay, CV/resume, valid passport, and proof of financial need for some scholarships. Requirements vary by program, so always check each scholarship's specific requirements."
            },
            {
                q: "Can I apply for multiple scholarships at the same time?",
                a: "Absolutely! We encourage students to apply to multiple scholarships to increase their chances of success. There's no limit to how many scholarships you can apply for, and most scholarship providers allow applicants to hold other scholarships unless specifically stated otherwise. Just make sure you can meet all the deadlines and requirements."
            },
            {
                q: "What GPA do I need to qualify for international scholarships?",
                a: "GPA requirements vary significantly between scholarships. Some competitive scholarships like Rhodes or Fulbright require exceptional academic records (typically top 5-10% of class), while many government scholarships like DAAD or Chevening value well-rounded candidates with leadership experience. Always check each scholarship's specific requirements."
            },
        ]
    },
    {
        title: "Visa & Immigration",
        icon: Globe,
        questions: [
            {
                q: "Does ScholarsPoint help with visa applications?",
                a: "Yes, we provide comprehensive student visa guides for popular study destinations including the USA (F-1 visa), UK (Student Visa), Canada (Study Permit), Australia (Subclass 500), Germany (Student Visa), and many more. Our guides include step-by-step instructions, required documents, interview tips, and common mistakes to avoid."
            },
            {
                q: "When should I start my visa application process?",
                a: "We recommend starting your visa application at least 3-4 months before your intended travel date. Some countries have longer processing times, especially during peak seasons (July-September for fall intake). After receiving your university admission letter and scholarship confirmation, begin gathering visa documents immediately."
            },
            {
                q: "What are the common reasons for student visa rejection?",
                a: "Common reasons include: incomplete or incorrect documentation, insufficient financial proof, lack of strong ties to home country, poor interview performance, discrepancies in application information, and incomplete university admission. Our visa guides help you avoid these common pitfalls."
            },
            {
                q: "Do I need to show bank statements for a scholarship visa?",
                a: "It depends on the scholarship coverage. Fully-funded scholarships that cover tuition, accommodation, and living stipend typically provide an official letter confirming financial support, which reduces the need for personal bank statements. However, some embassies may still require proof of personal funds for initial expenses. Check your specific country's requirements."
            },
        ]
    },
    {
        title: "Fellowships & Internships",
        icon: FileText,
        questions: [
            {
                q: "What is the difference between a scholarship and a fellowship?",
                a: "Scholarships are primarily for students pursuing degrees (undergraduate, masters, PhD) and typically cover tuition and living expenses. Fellowships are usually for post-graduate students, researchers, or professionals and often include research funding, professional development opportunities, and may not require formal coursework. Fellowships are often more competitive and targeted at specific fields or career stages."
            },
            {
                q: "Can undergraduates apply for fellowships?",
                a: "Some fellowships are open to undergraduates, particularly those focused on leadership development or research experience. Examples include the Fulbright Summer Institutes, DAAD RISE internships, and various leadership fellowships. Check each fellowship's eligibility criteria, as most are designed for graduate students or working professionals."
            },
            {
                q: "Are the internships on ScholarsPoint paid?",
                a: "We list both paid and unpaid internships, but we clearly indicate the compensation details for each opportunity. Many international internships at organizations like the UN, World Bank, and major tech companies offer stipends or salaries. We recommend filtering by 'paid' opportunities if compensation is important to you."
            },
            {
                q: "How competitive are international internships?",
                a: "International internships at prestigious organizations can be highly competitive, with acceptance rates sometimes below 5%. To improve your chances, apply early, tailor your application to each organization, highlight relevant experience and skills, and consider applying to multiple internships simultaneously."
            },
        ]
    },
    {
        title: "Using ScholarsPoint",
        icon: Search,
        questions: [
            {
                q: "Is ScholarsPoint completely free to use?",
                a: "Yes, ScholarsPoint is 100% free for students. We believe access to educational opportunities should not be limited by financial barriers. Our platform is supported by advertising and partnerships, allowing us to provide this service at no cost to users. You will never be asked to pay for access to scholarship listings."
            },
            {
                q: "How often is the scholarship database updated?",
                a: "Our team updates the database daily. We add new opportunities as they become available and remove expired listings. We also update deadline information and eligibility criteria when changes are announced by scholarship providers. You can trust that the information on ScholarsPoint is current and accurate."
            },
            {
                q: "Can I save scholarships to view later?",
                a: "Yes! Create a free account on ScholarsPoint to bookmark scholarships, internships, and fellowships you're interested in. Your saved opportunities are accessible from any device, and you can organize them to help track your application progress."
            },
            {
                q: "How can I get personalized scholarship recommendations?",
                a: "After creating an account, complete your profile with your educational background, field of interest, target countries, and academic level. Our platform will use this information to show you relevant opportunities first. You can also subscribe to our newsletter for weekly updates on new scholarships matching your interests."
            },
            {
                q: "Does ScholarsPoint guarantee scholarship acceptance?",
                a: "No, ScholarsPoint is an information platform and cannot guarantee acceptance to any scholarship or program. Selection decisions are made entirely by the scholarship providers based on their own criteria. We provide verified information and application tips to help maximize your chances, but the final decision rests with the awarding organizations."
            },
        ]
    },
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
            q =>
                q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(category => category.questions.length > 0);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Frequently Asked Questions
                        </h1>
                    </div>
                    <p className="text-lg text-white/90 max-w-2xl">
                        Find answers to common questions about scholarships, applications,
                        visas, and using ScholarsPoint.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="container mx-auto px-4 -mt-6">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    {filteredCategories.map((category, catIndex) => {
                        const Icon = category.icon;
                        return (
                            <section key={catIndex}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                                        <Icon size={22} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {category.title}
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {category.questions.map((item, qIndex) => {
                                        const itemId = `${catIndex}-${qIndex}`;
                                        const isOpen = openItems.includes(itemId);
                                        return (
                                            <div
                                                key={qIndex}
                                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors"
                                            >
                                                <button
                                                    onClick={() => toggleItem(itemId)}
                                                    className="w-full flex items-start justify-between gap-4 p-5 text-left"
                                                >
                                                    <span className="font-semibold text-gray-900">
                                                        {item.q}
                                                    </span>
                                                    <ChevronDown
                                                        size={20}
                                                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5">
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {item.a}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No questions found matching &quot;{searchQuery}&quot;
                            </p>
                        </div>
                    )}
                </div>

                {/* Still Have Questions */}
                <div className="max-w-4xl mx-auto mt-16 p-8 md:p-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[40px] text-center border border-emerald-100">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Still Have Questions?
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
                        Can&apos;t find the answer you&apos;re looking for? Our support team is here to help
                        you with any questions about scholarships or using our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors"
                        >
                            Contact Support
                        </Link>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
                        >
                            Browse Our Guides
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

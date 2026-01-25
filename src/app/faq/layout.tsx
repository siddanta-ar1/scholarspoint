import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Frequently Asked Questions | ScholarsPoint",
    description:
        "Find answers to common questions about international scholarships, fellowship applications, student visas, and using ScholarsPoint to discover global education opportunities.",
    alternates: {
        canonical: "/faq",
    },
    openGraph: {
        title: "FAQ - ScholarsPoint",
        description:
            "Get answers to common questions about scholarships, visas, and applications.",
        url: "https://scholarspoint.net/faq",
    },
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is ScholarsPoint and how does it help students?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "ScholarsPoint is a free educational platform that aggregates verified international scholarships, fellowships, internships, and exchange programs from universities and organizations worldwide.",
                },
            },
            {
                "@type": "Question",
                name: "Are the scholarships listed on ScholarsPoint free to apply?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, all scholarships listed on ScholarsPoint are free to apply. We only feature legitimate opportunities from recognized universities, governments, and organizations.",
                },
            },
            {
                "@type": "Question",
                name: "Is ScholarsPoint completely free to use?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, ScholarsPoint is 100% free for students. We believe access to educational opportunities should not be limited by financial barriers.",
                },
            },
            {
                "@type": "Question",
                name: "How often is the scholarship database updated?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our team updates the database daily. We add new opportunities as they become available and remove expired listings.",
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}

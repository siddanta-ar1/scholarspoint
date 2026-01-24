import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center space-y-8">
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-black text-gray-100 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center">
                            <Search className="w-12 h-12 text-sky-600" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-gray-900">
                        Page Not Found
                    </h2>
                    <p className="text-gray-500 text-lg">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button className="bg-sky-600 hover:bg-sky-700 rounded-xl h-12 px-8 w-full sm:w-auto">
                            <Home className="w-4 h-4 mr-2" />
                            Go to Homepage
                        </Button>
                    </Link>
                    <Link href="/scholarships">
                        <Button variant="outline" className="rounded-xl h-12 px-8 w-full sm:w-auto">
                            Browse Scholarships
                        </Button>
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-4">Popular destinations:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { label: "Scholarships", href: "/scholarships" },
                            { label: "Internships", href: "/internships" },
                            { label: "Fellowships", href: "/fellowships" },
                            { label: "Blogs", href: "/blogs" },
                            { label: "Visa Guides", href: "/visa-guides" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

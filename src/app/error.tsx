"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-gray-900">
                        Something went wrong!
                    </h1>
                    <p className="text-gray-500">
                        We encountered an unexpected error. Don't worry, our team has been notified.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-sky-600 hover:bg-sky-700 rounded-xl h-11 px-6"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="rounded-xl h-11 px-6 w-full sm:w-auto">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <details className="text-left mt-8 p-4 bg-gray-100 rounded-xl">
                        <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                            Error Details (Development Only)
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}

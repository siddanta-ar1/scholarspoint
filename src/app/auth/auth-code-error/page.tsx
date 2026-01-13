"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeError() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
        <div className="h-2 w-full bg-red-500" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-gray-900 uppercase">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6 text-center">
          <p className="text-gray-600 leading-relaxed font-medium">
            Something went wrong while verifying your session. This usually
            happens if the login link has expired or has already been used.
          </p>

          <div className="space-y-3 pt-4">
            <Button
              asChild
              className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-700 font-bold shadow-lg"
            >
              <Link
                href="/login"
                className="flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> Try Logging In Again
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-full h-12 rounded-xl text-gray-500 hover:text-sky-600 font-bold"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft size={18} /> Back to Homepage
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              ScholarsPoint Security Hub
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

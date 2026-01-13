"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorModal from "@/components/ErrorModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Modal State for professional error handling
  const [errorState, setErrorState] = useState({
    isOpen: false,
    message: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // REPLACE alert(error.message) with custom modal state
      setErrorState({
        isOpen: true,
        message:
          error.message || "Invalid email or password. Please try again.",
      });
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorState({
        isOpen: true,
        message: error.message,
      });
    }
  };

  return (
    <>
      <ErrorModal
        isOpen={errorState.isOpen}
        title="Login Failed"
        message={errorState.message}
        onClose={() => setErrorState({ ...errorState, isOpen: false })}
      />

      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50/50 dark:bg-transparent">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-sky-600">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to manage your opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google OAuth Button */}
            <Button
              variant="outline"
              className="w-full h-11 gap-3 font-medium border-gray-300 hover:bg-gray-50 transition-all"
              onClick={handleGoogleLogin}
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt="Google"
                width={18}
                height={18}
              />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-950 px-2 text-muted-foreground">
                  Or use email and password
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-sky-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                className="w-full bg-sky-600 hover:bg-sky-700 h-12 text-white font-semibold shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  "Sign In to ScholarsPoint"
                )}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm border-t pt-6">
              <span className="text-muted-foreground">
                Don&apos;t have an account yet?{" "}
              </span>
              <Link
                href="/signup"
                className="text-sky-600 font-bold hover:underline"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Note: Re-import Label if it's used; otherwise, the simple HTML label or a custom one works too.
import { Label } from "@/components/ui/label";

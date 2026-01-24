"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    profile: {
        id: string;
        email: string | null;
        full_name: string | null;
        role: string;
    } | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        isAdmin: false,
        profile: null,
    });

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            // Profile fetch with timeout to prevent infinite loading
            const profilePromise = supabase
                .from("profiles")
                .select("id, email, full_name, role")
                .eq("id", userId)
                .single();

            const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: "Profile fetch timed out" }), 5000)
            );

            const { data: profile } = await Promise.race([
                profilePromise,
                timeoutPromise
            ]) as any;

            return profile;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        // Get initial session
        const initializeAuth = async () => {
            try {
                // Session fetch with timeout
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<{ data: { session: null }; error: any }>((_, reject) =>
                    setTimeout(() => reject(new Error("Auth initialization timed out")), 5000)
                );

                const {
                    data: { session },
                } = await Promise.race([sessionPromise, timeoutPromise]) as any;

                if (!mounted) return;

                if (session?.user) {
                    // If we have a session, try to get the profile
                    // But don't let a slow profile fetch block the UI forever
                    const profile = await fetchProfile(session.user.id);

                    if (mounted) {
                        setAuthState({
                            user: session.user,
                            session,
                            isLoading: false,
                            isAdmin: profile?.role === "admin",
                            profile,
                        });
                    }
                } else {
                    if (mounted) {
                        setAuthState({
                            user: null,
                            session: null,
                            isLoading: false,
                            isAdmin: false,
                            profile: null,
                        });
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                if (mounted) {
                    setAuthState((prev) => ({ ...prev, isLoading: false }));
                }
            }
        };

        initializeAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (session?.user) {
                setAuthState(prev => ({ ...prev, isLoading: true }));
                const profile = await fetchProfile(session.user.id);

                if (mounted) {
                    setAuthState({
                        user: session.user,
                        session,
                        isLoading: false,
                        isAdmin: profile?.role === "admin",
                        profile,
                    });
                }
            } else {
                if (mounted) {
                    setAuthState({
                        user: null,
                        session: null,
                        isLoading: false,
                        isAdmin: false,
                        profile: null,
                    });
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    // Auth actions
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    }, []);

    const signInWithEmail = useCallback(
        async (email: string, password: string) => {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        },
        []
    );

    const signUpWithEmail = useCallback(
        async (email: string, password: string, fullName?: string) => {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        },
        []
    );

    return {
        ...authState,
        signOut,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
    };
}

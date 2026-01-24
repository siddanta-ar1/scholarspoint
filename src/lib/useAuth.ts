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
        const { data: profile } = await supabase
            .from("profiles")
            .select("id, email, full_name, role")
            .eq("id", userId)
            .single();

        return profile;
    }, []);

    useEffect(() => {
        // Get initial session
        const initializeAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    setAuthState({
                        user: session.user,
                        session,
                        isLoading: false,
                        isAdmin: profile?.role === "admin",
                        profile,
                    });
                } else {
                    setAuthState({
                        user: null,
                        session: null,
                        isLoading: false,
                        isAdmin: false,
                        profile: null,
                    });
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                setAuthState((prev) => ({ ...prev, isLoading: false }));
            }
        };

        initializeAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const profile = await fetchProfile(session.user.id);
                setAuthState({
                    user: session.user,
                    session,
                    isLoading: false,
                    isAdmin: profile?.role === "admin",
                    profile,
                });
            } else {
                setAuthState({
                    user: null,
                    session: null,
                    isLoading: false,
                    isAdmin: false,
                    profile: null,
                });
            }
        });

        return () => {
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

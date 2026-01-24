"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

    const mounted = useRef(false);

    // robust profile fetch with timeout
    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const profilePromise = supabase
                .from("profiles")
                .select("id, email, full_name, role")
                .eq("id", userId)
                .single();

            const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
                setTimeout(
                    () => resolve({ data: null, error: "Profile fetch timed out" }),
                    4000
                )
            );

            const { data: profile } = (await Promise.race([
                profilePromise,
                timeoutPromise,
            ])) as any;

            return profile;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }, []);

    // Centralized state updater
    const refreshAuthState = useCallback(
        async (session: Session | null) => {
            if (!mounted.current) return;

            if (!session?.user) {
                setAuthState({
                    user: null,
                    session: null,
                    isLoading: false,
                    isAdmin: false,
                    profile: null,
                });
                return;
            }

            // We have a user, now get the profile
            // Keep loading true if this is an initial load, but if it's an update, maybe not needed?
            // Actually best to show loading if we are transitioning from no-user to user
            // But for updates, we might want to be smoother.
            // For now, let's just fetch profile.

            const profile = await fetchProfile(session.user.id);

            if (mounted.current) {
                setAuthState({
                    user: session.user,
                    session,
                    isLoading: false,
                    isAdmin: profile?.role === "admin",
                    profile,
                });
            }
        },
        [fetchProfile]
    );

    useEffect(() => {
        mounted.current = true;

        const initializeAuth = async () => {
            try {
                // 1. Get Initial Session with timeout
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<{
                    data: { session: null };
                    error: any;
                }>((_, reject) =>
                    setTimeout(() => reject(new Error("Auth init timed out")), 4000)
                );

                const {
                    data: { session },
                } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

                await refreshAuthState(session);
            } catch (error) {
                console.error("Auth initialization failed:", error);
                if (mounted.current) {
                    setAuthState((prev) => ({ ...prev, isLoading: false }));
                }
            }
        };

        initializeAuth();

        // 2. Set up listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            // Logic: If the session changed, we need to refresh.
            // 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', etc.
            // We pass the new session to our centralized handler
            if (mounted.current) {
                // If we are signing in, we might want to show loading
                if (event === 'SIGNED_IN') {
                    setAuthState(prev => ({ ...prev, isLoading: true }));
                }

                await refreshAuthState(session);
            }
        });

        return () => {
            mounted.current = false;
            subscription.unsubscribe();
        };
    }, [refreshAuthState]);

    // Auth actions
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        // State update will happen via onAuthStateChange -> refreshAuthState
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

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

    // Centralized state updater that respects previous state
    const refreshAuthState = useCallback(
        async (session: Session | null, eventType?: string) => {
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

            // Optimization: If we already have this user loaded, DON'T show global loading spinner
            // This prevents the flickering when tab focus triggers validation
            const isSameUser = authState.user?.id === session.user.id;

            // Only set loading if we don't have a user yet, or if it's an explicit sign-in event from no-auth
            if (!isSameUser) {
                setAuthState(prev => ({ ...prev, isLoading: true }));
            }

            // Fetch profile (in background if it's just a refresh)
            const profile = await fetchProfile(session.user.id);

            if (mounted.current) {
                setAuthState({
                    user: session.user,
                    session,
                    isLoading: false, // Always done loading here
                    isAdmin: profile?.role === "admin",
                    profile,
                });
            }
        },
        [fetchProfile, authState.user?.id] // Depend on current user ID for comparison
    );

    useEffect(() => {
        mounted.current = true;

        // 1. Initial Load
        const initializeAuth = async () => {
            try {
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<{ data: { session: null }; error: any }>((_, reject) =>
                    setTimeout(() => reject(new Error("Auth init timed out")), 4000)
                );

                const { data: { session } } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

                await refreshAuthState(session, 'INITIAL_LOAD');
            } catch (error) {
                console.error("Auth initialization failed:", error);
                if (mounted.current) {
                    setAuthState((prev) => ({ ...prev, isLoading: false }));
                }
            }
        };

        initializeAuth();

        // 2. Subscription Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted.current) {
                // Skip updating if it's just a token refresh and we have the same user
                // But we still want to update the session object in state
                await refreshAuthState(session, event);
            }
        });

        return () => {
            mounted.current = false;
            subscription.unsubscribe();
        };
    }, []); // Empty dependency array for init logic

    // Separate effect for refreshAuthState when it changes due to closure?
    // Actually onAuthStateChange is set up once. The closure inside it will have stale `refreshAuthState` if we are not careful.
    // HOWEVER, supabase listener should probably call a ref-stable function or use a ref for state comparison.
    // A cleaner way for the comparison:
    // Instead of relying on `authState` closure inside the listener (which is stale),
    // we can pass the logic to `setAuthState` functional update or just check session IDs.

    // Actually, I should use a Ref to hold the current user ID so the listener can check it without recreating the listener.
    const currentUserIdRef = useRef<string | null>(null);

    // Sync ref
    useEffect(() => {
        currentUserIdRef.current = authState.user?.id || null;
    }, [authState.user?.id]);

    // Re-write initialize/listener to use the Ref for comparison
    useEffect(() => {
        mounted.current = true;

        const performUpdate = async (session: Session | null) => {
            if (!session?.user) {
                if (mounted.current) {
                    setAuthState({
                        user: null, session: null, isLoading: false, isAdmin: false, profile: null
                    });
                }
                return;
            }

            const isSamgeUser = currentUserIdRef.current === session.user.id;
            // Only set loading true if it's a DIFFERENT user
            if (!isSamgeUser && mounted.current) {
                setAuthState(prev => ({ ...prev, isLoading: true }));
            }

            const profile = await fetchProfile(session.user.id);

            if (mounted.current) {
                setAuthState({
                    user: session.user,
                    session,
                    isLoading: false,
                    isAdmin: profile?.role === "admin",
                    profile
                });
            }
        };

        // Init
        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                await performUpdate(session);
            } catch (e) {
                console.error(e);
                if (mounted.current) setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        };
        init();

        // Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            performUpdate(session);
        });

        return () => {
            mounted.current = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile]); // Only depend on stable fetchProfile

    // Auth actions (unchanged)
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }, []);

    const signUpWithEmail = useCallback(async (email: string, password: string, fullName?: string) => {
        const { error } = await supabase.auth.signUp({
            email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
    }, []);

    return { ...authState, signOut, signInWithGoogle, signInWithEmail, signUpWithEmail };
}

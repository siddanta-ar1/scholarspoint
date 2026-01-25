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

// Profile cache to persist across tab changes
const profileCache = new Map<string, { data: AuthState["profile"]; timestamp: number }>();
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        isLoading: true,
        isAdmin: false,
        profile: null,
    });

    const mounted = useRef(false);
    const currentUserIdRef = useRef<string | null>(null);

    // Get cached profile if valid
    const getCachedProfile = useCallback((userId: string) => {
        const cached = profileCache.get(userId);
        if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_TTL) {
            return cached.data;
        }
        return null;
    }, []);

    // Robust profile fetch with timeout and caching
    const fetchProfile = useCallback(async (userId: string, forceRefresh = false) => {
        // Check cache first (unless force refresh)
        if (!forceRefresh) {
            const cached = getCachedProfile(userId);
            if (cached) return cached;
        }

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

            // Cache the result
            if (profile) {
                profileCache.set(userId, { data: profile, timestamp: Date.now() });
            }

            return profile;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }, [getCachedProfile]);

    // Single consolidated useEffect for auth initialization and listener
    useEffect(() => {
        mounted.current = true;

        const performUpdate = async (session: Session | null, isInitialLoad = false) => {
            if (!session?.user) {
                if (mounted.current) {
                    setAuthState({
                        user: null,
                        session: null,
                        isLoading: false,
                        isAdmin: false,
                        profile: null
                    });
                    currentUserIdRef.current = null;
                }
                return;
            }

            const isSameUser = currentUserIdRef.current === session.user.id;

            // Key optimization: Only show loading spinner on initial load or user change
            // NOT on tab visibility changes for the same user
            if (isInitialLoad && !isSameUser && mounted.current) {
                setAuthState(prev => ({ ...prev, isLoading: true }));
            }

            // For the same user on tab change, use cached profile immediately
            if (isSameUser && !isInitialLoad) {
                const cachedProfile = getCachedProfile(session.user.id);
                if (cachedProfile && mounted.current) {
                    // Update session silently without loading state
                    setAuthState(prev => ({
                        ...prev,
                        session,
                        user: session.user,
                    }));
                    return; // Skip profile fetch entirely for same user
                }
            }

            // Fetch profile (will use cache if available)
            const profile = await fetchProfile(session.user.id);

            if (mounted.current) {
                currentUserIdRef.current = session.user.id;
                setAuthState({
                    user: session.user,
                    session,
                    isLoading: false,
                    isAdmin: profile?.role === "admin",
                    profile
                });
            }
        };

        // Initialize auth
        const init = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                await performUpdate(session, true);
            } catch (e) {
                console.error("Auth initialization failed:", e);
                if (mounted.current) {
                    setAuthState(prev => ({ ...prev, isLoading: false }));
                }
            }
        };
        init();

        // Single auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // Tab visibility changes fire TOKEN_REFRESHED events - handle gracefully
            performUpdate(session, false);
        });

        return () => {
            mounted.current = false;
            subscription.unsubscribe();
        };
    }, [fetchProfile, getCachedProfile]);

    // Auth actions
    const signOut = useCallback(async () => {
        // Clear profile cache on sign out
        profileCache.clear();
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

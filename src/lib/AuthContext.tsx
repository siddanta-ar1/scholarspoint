"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

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
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

// Module-level cache shared across all hook consumers
const profileCache = new Map<
  string,
  { data: AuthState["profile"]; timestamp: number }
>();
const PROFILE_CACHE_TTL = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<
    Omit<
      AuthState,
      "signOut" | "signInWithGoogle" | "signInWithEmail" | "signUpWithEmail"
    >
  >({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
    profile: null,
  });

  const mounted = useRef(true);
  // Prevent concurrent profile fetches for the same user
  const fetchingUserId = useRef<string | null>(null);

  const fetchProfileBackground = useCallback(async (userId: string) => {
    if (fetchingUserId.current === userId) return;

    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_TTL) {
      if (mounted.current) {
        setState((prev) => ({
          ...prev,
          isAdmin: cached.data?.role === "admin",
          profile: cached.data,
        }));
      }
      return;
    }

    fetchingUserId.current = userId;
    try {
      const { data: profile } = (await Promise.race([
        supabase
          .from("profiles")
          .select("id, email, full_name, role")
          .eq("id", userId)
          .single(),
        new Promise<{ data: null; error: string }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: "timeout" }), 4000)
        ),
      ])) as any;

      if (profile) {
        profileCache.set(userId, { data: profile, timestamp: Date.now() });
      }

      if (mounted.current) {
        setState((prev) => ({
          ...prev,
          isAdmin: profile?.role === "admin",
          profile: profile ?? null,
        }));
      }
    } catch {
      // Profile fetch failed — user still authenticated, just no profile data
    } finally {
      fetchingUserId.current = null;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted.current) return;

      if (!session?.user) {
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAdmin: false,
          profile: null,
        });
        return;
      }

      // INITIAL_SESSION fires synchronously from localStorage — no network call.
      // Immediately unblock the UI with user/session, then fetch profile in background.
      setState((prev) => ({
        ...prev,
        user: session.user,
        session,
        isLoading: false,
      }));

      // Background profile fetch — updates isAdmin/profile without blocking render
      fetchProfileBackground(session.user.id);
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileBackground]);

  const signOut = useCallback(async () => {
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

  return (
    <AuthContext.Provider
      value={{ ...state, signOut, signInWithGoogle, signInWithEmail, signUpWithEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

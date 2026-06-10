// Server-side Supabase client for Server Components and API routes
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // Handle cookie errors in Server Components
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.delete({ name, ...options });
                    } catch {
                        // Handle cookie errors in Server Components
                    }
                },
            },
        }
    );
}

// Helper to get current user session on server
// Uses getUser() which validates the JWT with Supabase — getSession() trusts
// the local cookie without server verification and is not safe for auth checks.
export async function getServerSession() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Reconstruct a minimal session-like object callers expect
    return { user };
}

// Helper to get current user profile with role
export async function getServerUserProfile() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return profile;
}

// Check if current user is admin
export async function isServerAdmin() {
    const profile = await getServerUserProfile();
    return profile?.role === "admin";
}

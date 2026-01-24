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
export async function getServerSession() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) {
        console.error("Session error:", error.message);
        return null;
    }

    return session;
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

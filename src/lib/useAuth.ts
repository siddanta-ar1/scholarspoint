// Re-exports from AuthContext so existing imports continue to work.
// Auth state is now managed by a single AuthProvider in the component tree.
export { useAuth } from "@/lib/AuthContext";
export type { AuthState } from "@/lib/AuthContext";

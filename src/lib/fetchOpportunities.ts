import { supabase } from "@/lib/supabaseClient";
import { Opportunity } from "@/types/database";

export type FetchOpportunitiesResult = {
  featured: Opportunity[];
  latest: Opportunity[];
};

/**
 * Fetches opportunities from the unified 'opportunities' table.
 * Returns a mix of featured items and the latest uploads.
 */
export async function fetchOpportunities(): Promise<FetchOpportunitiesResult> {
  // 1. Fetch Featured Opportunities (e.g., Top 3)
  const { data: featured } = await supabase
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(3);

  // 2. Fetch Latest Opportunities (e.g., Top 6 recent)
  // We exclude the ones that are already featured to avoid duplicates
  const featuredIds = featured?.map((f) => f.id) || [];

  let query = supabase
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (featuredIds.length > 0) {
    query = query.not("id", "in", `(${featuredIds.join(",")})`);
  }

  const { data: latest } = await query;

  return {
    featured: (featured as Opportunity[]) || [],
    latest: (latest as Opportunity[]) || [],
  };
}

/**
 * Helper to fetch opportunities by specific type (for specific pages)
 */
export async function fetchOpportunitiesByType(type: string, limit = 10) {
  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .eq("type", type)
    .order("deadline", { ascending: true }) // Show expiring soon first
    .limit(limit);

  return (data as Opportunity[]) || [];
}

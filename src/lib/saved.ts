import { supabase } from "@/lib/supabaseClient";

/**
 * Check if an opportunity is saved by the user
 */
export async function isSaved(opportunityId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("id")
    .eq("user_id", userId)
    .eq("opportunity_id", opportunityId)
    .maybeSingle();

  return !!data && !error;
}

/**
 * Save an opportunity for the user
 */
export async function saveOpportunity(opportunityId: string, userId: string) {
  const { error } = await supabase.from("saved_opportunities").insert({
    opportunity_id: opportunityId,
    user_id: userId,
  });

  if (error) {
    // Handle unique constraint violation gracefully
    if (error.code === "23505") {
      return { error: null, alreadySaved: true };
    }
    return { error };
  }

  return { error: null };
}

/**
 * Remove a saved opportunity for the user
 */
export async function unsaveOpportunity(opportunityId: string, userId: string) {
  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("opportunity_id", opportunityId)
    .eq("user_id", userId);

  return { error };
}

/**
 * Get all saved opportunities for a user
 */
export async function getSavedOpportunities(userId: string) {
  const { data, error } = await supabase
    .from("saved_opportunities")
    .select(`
      id,
      created_at,
      opportunity:opportunities(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved opportunities:", error);
    return [];
  }

  return data || [];
}

/**
 * Toggle save status for an opportunity
 */
export async function toggleSaveOpportunity(
  opportunityId: string,
  userId: string
): Promise<{ saved: boolean; error: any }> {
  const currentlySaved = await isSaved(opportunityId, userId);

  if (currentlySaved) {
    const { error } = await unsaveOpportunity(opportunityId, userId);
    return { saved: false, error };
  } else {
    const { error } = await saveOpportunity(opportunityId, userId);
    return { saved: true, error };
  }
}

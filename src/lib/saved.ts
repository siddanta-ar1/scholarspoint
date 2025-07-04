import { supabase } from '@/lib/supabaseClient'

export async function isSaved(opportunity_id: string, type: string, user_id: string) {
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('id')
    .eq('user_id', user_id)
    .eq('opportunity_id', opportunity_id)
    .eq('opportunity_type', type)
    .maybeSingle()

  return !!data && !error
}

export async function saveOpportunity(opportunity_id: string, type: string, user_id: string) {
  return await supabase.from('saved_opportunities').insert([
    { opportunity_id, opportunity_type: type, user_id },
  ])
}

export async function unsaveOpportunity(opportunity_id: string, type: string, user_id: string) {
  return await supabase
    .from('saved_opportunities')
    .delete()
    .eq('opportunity_id', opportunity_id)
    .eq('opportunity_type', type)
    .eq('user_id', user_id)
}

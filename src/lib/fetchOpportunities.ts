// lib/fetchOpportunities.ts
import { supabase } from '@/lib/supabaseClient'

export async function fetchOpportunities() {
  const { data: sch } = await supabase
    .from('scholarships')
    .select('id, title, organization, student_level, image_url')
    .eq('is_active', true)
    .limit(3)

  const { data: int } = await supabase
    .from('internships')
    .select('id, title, company, student_level, image_url')
    .eq('is_active', true)
    .limit(3)

  const { data: fel } = await supabase
    .from('fellowships')
    .select('id, title, organization, student_level, image_url')
    .eq('is_active', true)
    .limit(3)

  return { scholarships: sch || [], internships: int || [], fellowships: fel || [] }
}

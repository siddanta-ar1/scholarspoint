import { supabase } from "@/lib/supabaseClient";
import OpportunityDetailView from "@/components/OpportunityDetailView";
import { notFound } from "next/navigation";

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // FETCH FROM UNIFIED TABLE
  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) return notFound();

  // OpportunityDetailView already uses the professional "Poster" layout
  return <OpportunityDetailView data={data} />;
}

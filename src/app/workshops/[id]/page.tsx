import { supabase } from "@/lib/supabaseClient";
import OpportunityDetailView from "@/components/OpportunityDetailView";
import { notFound } from "next/navigation";

export const revalidate = 60; // Revalidate every minute

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch from the UNIFIED table
  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return notFound();

  return <OpportunityDetailView data={data} />;
}

import { supabase } from "@/lib/supabaseClient";
import OpportunityDetailView from "@/components/OpportunityDetailView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("opportunities")
    .select("title, description, image_url, organization, country")
    .eq("id", id)
    .single();

  if (!data) return { title: "Scholarship Not Found | ScholarsPoint" };

  return {
    title: `${data.title} | ScholarsPoint Scholarships`,
    description: data.description?.substring(0, 160) || `Apply for ${data.title} at ${data.organization}. Find details, eligibility, deadlines, and application links on ScholarsPoint.`,
    openGraph: {
      title: data.title,
      description: data.description?.substring(0, 160),
      images: data.image_url ? [data.image_url] : undefined,
      url: `https://scholarspoint.net/scholarships/${id}`,
    },
  };
}

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

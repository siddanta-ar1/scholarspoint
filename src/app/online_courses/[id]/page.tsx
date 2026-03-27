import { supabase } from "@/lib/supabaseClient";
import OpportunityDetailView from "@/components/OpportunityDetailView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60;

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

  if (!data) return { title: "Online Course Not Found | ScholarsPoint" };

  return {
    title: `${data.title} | ScholarsPoint Online Courses`,
    description: data.description?.substring(0, 160) || `Enroll in ${data.title} from ${data.organization}. Find details, eligibility, and enrollment links on ScholarsPoint.`,
    openGraph: {
      title: data.title,
      description: data.description?.substring(0, 160),
      images: data.image_url ? [data.image_url] : undefined,
      url: `https://scholarspoint.net/online_courses/${id}`,
    },
  };
}

export default async function OnlineCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return notFound();

  return <OpportunityDetailView data={data} />;
}

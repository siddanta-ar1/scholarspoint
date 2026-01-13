"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import OpportunityForm from "@/components/admin/OpportunityForm";
import { Loader2 } from "lucide-react";
import { Opportunity } from "@/types/database";

// Next.js 15: params is a Promise
export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsRef = use(params); // Unlock the params
  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", paramsRef.id)
        .single();

      if (!error && data) {
        setData(data as Opportunity);
      }
      setLoading(false);
    };
    fetch();
  }, [paramsRef.id]);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!data) return <div>Opportunity not found</div>;

  return <OpportunityForm initialData={data} />;
}

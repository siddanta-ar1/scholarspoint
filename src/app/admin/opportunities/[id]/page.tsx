"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import OpportunityForm from "@/components/admin/OpportunityForm";
import { Loader2 } from "lucide-react";
import { Opportunity } from "@/types/database";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setData(data as Opportunity);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (notFound || !data)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Opportunity Not Found</h2>
        <p className="text-gray-500 mt-2">The requested opportunity does not exist.</p>
      </div>
    );

  return <OpportunityForm initialData={data} />;
}

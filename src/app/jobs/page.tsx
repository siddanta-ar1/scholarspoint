import { supabase } from "@/lib/supabaseClient";
import OpportunityList from "@/components/OpportunityList";
import { Briefcase } from "lucide-react";

export default async function JobsPage() {
  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("type", "job")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="container mx-auto px-4 py-12 space-y-10">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
          <Briefcase size={32} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">
          Global <span className="text-sky-600">Jobs</span>
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Verified career opportunities for international students and
          graduates.
        </p>
      </div>

      <OpportunityList title="Latest Career Openings" data={data || []} />
    </main>
  );
}

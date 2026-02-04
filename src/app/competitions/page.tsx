import { supabase } from "@/lib/supabaseClient";
import OpportunityList from "@/components/OpportunityList";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Opportunity } from "@/types/database";
import Link from "next/link";

export const revalidate = 3600; // Cache for 1 hour

export default async function CompetitionsPage() {
  // Fetch from the UNIFIED table
  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("type", "competition")
    .eq("is_active", true)
    .order("deadline", { ascending: true });

  const competitions = (data as Opportunity[]) || [];

  return (
    <main className="container mx-auto px-4 py-16 space-y-12 animate-in fade-in duration-700">
      {/* Professional Header Section */}
      <div className="bg-sky-600 rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          <div className="inline-flex p-3 bg-white/20 backdrop-blur-md rounded-2xl">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            Global <span className="text-sky-200 underline">Competitions</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90 leading-relaxed">
            Explore the best competitions globally .
          </p>
        </div>
        {/* Background Decorative Icon */}
        <GraduationCap className="absolute -bottom-20 -right-20 w-96 h-96 text-white/5 rotate-[-15deg] pointer-events-none" />
      </div>

      {/* Reusable Opportunity List Component */}
      <div className="pb-20">
        <OpportunityList title="Featured Competitions" data={competitions} />
      </div>
    </main>
  );
}

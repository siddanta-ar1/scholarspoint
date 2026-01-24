import { supabase } from "@/lib/supabaseClient";
import OpportunityList from "@/components/OpportunityList";
import { GraduationCap } from "lucide-react";
import { Opportunity } from "@/types/database";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "International Scholarships 2025 | Fully Funded | ScholarsPoint",
  description:
    "Discover fully funded international scholarships for undergraduate, masters, and PhD students. Updated daily with the latest scholarship opportunities worldwide.",
  keywords: [
    "scholarships",
    "fully funded scholarships",
    "international scholarships",
    "study abroad",
    "scholarship 2025",
  ],
  openGraph: {
    title: "Fully Funded Scholarships | ScholarsPoint",
    description: "Explore 100+ fully funded international scholarship opportunities",
    url: "https://scholarspoint.net/scholarships",
  },
};

export default async function ScholarshipsPage() {
  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .eq("type", "scholarship")
    .eq("is_active", true)
    .order("deadline", { ascending: true });

  const scholarships = (data as Opportunity[]) || [];

  return (
    <main className="min-h-screen">
      {/* Header Section - Mobile optimized */}
      <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-10 sm:py-16 md:py-20 relative z-10">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Icon */}
            <div className="inline-flex p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Global{" "}
              <span className="text-sky-200 underline decoration-4 underline-offset-4">
                Scholarships
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl font-medium opacity-90 leading-relaxed max-w-xl">
              Fully-funded opportunities to study at the world's most prestigious universities.
            </p>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-10 pt-2 sm:pt-4">
              <div>
                <div className="text-2xl sm:text-3xl font-black">{scholarships.length}+</div>
                <div className="text-xs sm:text-sm text-sky-200">Active Scholarships</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black">50+</div>
                <div className="text-xs sm:text-sm text-sky-200">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative */}
        <GraduationCap className="absolute -bottom-16 -right-16 sm:-bottom-20 sm:-right-20 w-64 h-64 sm:w-96 sm:h-96 text-white/5 rotate-[-15deg] pointer-events-none" />

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-background rounded-t-[40px] sm:rounded-t-[60px]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 sm:py-10 pb-16 sm:pb-20">
        <OpportunityList
          title="Featured Scholarships"
          data={scholarships}
          showViewToggle={true}
          showFilters={true}
        />
      </div>
    </main>
  );
}

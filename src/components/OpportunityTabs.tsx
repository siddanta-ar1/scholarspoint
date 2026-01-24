"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { Opportunity, OpportunityType } from "@/types/database";
import { cn } from "@/lib/utils";

// Map the DB Enum types to readable Labels and URL paths
const TABS_CONFIG: {
  value: OpportunityType;
  label: string;
  path: string;
  emoji: string;
}[] = [
    { value: "scholarship", label: "Scholarships", path: "/scholarships", emoji: "🎓" },
    { value: "internship", label: "Internships", path: "/internships", emoji: "💼" },
    { value: "fellowship", label: "Fellowships", path: "/fellowships", emoji: "🏅" },
    { value: "competition", label: "Competitions", path: "/competitions", emoji: "🏆" },
    { value: "conference", label: "Conferences", path: "/conferences", emoji: "🎤" },
    { value: "workshop", label: "Workshops", path: "/workshops", emoji: "🛠️" },
    { value: "exchange_program", label: "Exchanges", path: "/exchange_programs", emoji: "✈️" },
    { value: "online_course", label: "Courses", path: "/online_courses", emoji: "📚" },
    { value: "job", label: "Jobs", path: "/jobs", emoji: "👔" },
  ];

type TabData = {
  [key in OpportunityType]?: Opportunity[];
};

// Skeleton card for loading state
function SkeletonCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse">
        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1 py-0.5 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] sm:aspect-video bg-gray-200 dark:bg-gray-800" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export default function OpportunityTabs() {
  const [data, setData] = useState<TabData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OpportunityType>("scholarship");
  const [retryCount, setRetryCount] = useState(0);

  const fetchAllOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all at once with a single query for better performance
      // Added a timeout to prevent infinite hanging
      const fetchPromise = supabase
        .from("opportunities")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(60); // Increased limit slightly

      // Timeout after 10 seconds
      const timeoutPromise = new Promise<{ data: null; error: any }>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      );

      const { data: allData, error: apiError } = await Promise.race([
        fetchPromise,
        timeoutPromise,
      ]) as any;

      if (apiError) throw apiError;

      // Group by type
      const grouped: TabData = {};
      TABS_CONFIG.forEach((tab) => {
        grouped[tab.value] = (allData || [])
          .filter((item: Opportunity) => item.type === tab.value)
          .slice(0, 4) as Opportunity[];
      });

      setData(grouped);
    } catch (err: any) {
      console.error("Failed to fetch opportunities:", err);
      setError(err.message || "Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array as it doesn't depend on props

  // Initial fetch with auto-retry logic on failure
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await fetchAllOpportunities();
    };

    load();

    return () => {
      mounted = false;
    };
  }, [fetchAllOpportunities]);

  const currentTabConfig = useMemo(
    () => TABS_CONFIG.find((t) => t.value === activeTab),
    [activeTab]
  );

  const currentOpportunities = data[activeTab] || [];

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchAllOpportunities();
  };

  return (
    <section className="container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 space-y-2 sm:space-y-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-50">
          Latest <span className="text-sky-600">Opportunities</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover scholarships, internships, and fellowships worldwide
        </p>
      </div>

      {/* Category Pills */}
      <div className="relative mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
          {TABS_CONFIG.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex-shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap",
                activeTab === tab.value
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/30"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-background to-transparent pointer-events-none sm:hidden" />
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {loading ? (
          <>
            {/* Desktop skeleton */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            {/* Mobile skeleton */}
            <div className="sm:hidden space-y-3">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} compact />
              ))}
            </div>
          </>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center space-y-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-red-900 dark:text-red-200">
                Failed to load opportunities
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 max-w-xs mx-auto">
                {error === "Request timed out"
                  ? "The connection is slow. Please try again."
                  : "Something went wrong while fetching data."}
              </p>
            </div>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-red-200 hover:bg-red-100 text-red-700 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
          </div>
        ) : currentOpportunities.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center space-y-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <span className="text-4xl">{currentTabConfig?.emoji}</span>
            <p className="text-muted-foreground font-medium">
              No {currentTabConfig?.label.toLowerCase()} found
            </p>
            <p className="text-sm text-gray-400">
              Check back soon for new opportunities!
            </p>
          </div>
        ) : (
          // Success State
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Desktop: Grid view */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {currentOpportunities.map((op) => (
                <OpportunityCard key={op.id} data={op} />
              ))}
            </div>

            {/* Mobile: Compact list view */}
            <div className="sm:hidden space-y-3">
              {currentOpportunities.map((op) => (
                <OpportunityCard key={op.id} data={op} compact />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center pt-2">
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 sm:px-8 h-10 sm:h-11 border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-800 dark:hover:bg-sky-950 font-bold group"
              >
                <Link href={currentTabConfig?.path || "/"}>
                  View all {currentTabConfig?.label}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

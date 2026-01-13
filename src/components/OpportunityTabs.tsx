"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { Opportunity, OpportunityType } from "@/types/database";

// Map the DB Enum types to readable Labels and URL paths
const TABS_CONFIG: { value: OpportunityType; label: string; path: string }[] = [
  { value: "scholarship", label: "Scholarships", path: "/scholarships" },
  { value: "internship", label: "Internships", path: "/internships" },
  { value: "fellowship", label: "Fellowships", path: "/fellowships" },
  { value: "competition", label: "Competitions", path: "/competitions" },
  { value: "conference", label: "Conferences", path: "/conferences" },
  { value: "workshop", label: "Workshops", path: "/workshops" }, // Assuming 'trainings' maps to workshops/trainings
  { value: "exchange_program", label: "Exchanges", path: "/exchange_programs" },
  { value: "online_course", label: "Online_Courses", path: "/online_courses" },
  { value: "job", label: "Jobs", path: "/jobs" },
];

type TabData = {
  [key in OpportunityType]?: Opportunity[];
};

export default function OpportunityTabs() {
  const [data, setData] = useState<TabData>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("scholarship");

  useEffect(() => {
    const fetchAllOpportunities = async () => {
      setLoading(true);
      try {
        // We fetch the top 4 active items for EACH category in parallel
        const queries = TABS_CONFIG.map((tab) => {
          return supabase
            .from("opportunities") // Query the NEW Unified Table
            .select("*")
            .eq("type", tab.value)
            .eq("is_active", true)
            .order("created_at", { ascending: false }) // Show newest first
            .limit(4);
        });

        const responses = await Promise.all(queries);

        const newData: TabData = {};

        responses.forEach((response, index) => {
          const type = TABS_CONFIG[index].value;
          if (response.data) {
            newData[type] = response.data as Opportunity[];
          } else {
            newData[type] = [];
          }

          if (response.error) {
            console.error(`Error fetching ${type}:`, response.error.message);
          }
        });

        setData(newData);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOpportunities();
  }, []);

  const renderTabContent = (
    opportunities: Opportunity[],
    tabConfig: (typeof TABS_CONFIG)[0],
  ) => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      );
    }

    if (!opportunities || opportunities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-muted-foreground">
            No upcoming {tabConfig.label.toLowerCase()} found at the moment.
          </p>
          {/* Optional: Add a 'Check back later' or similar message */}
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {opportunities.map((op) => (
            // FIX: Pass the whole object as 'data' prop
            <OpportunityCard key={op.id} data={op} />
          ))}
        </div>
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-900 dark:hover:bg-sky-950"
          >
            <Link href={tabConfig.path}>View all {tabConfig.label} →</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-10 space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-50">
          Latest <span className="text-sky-600">Opportunities</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Discover fully funded scholarships, internships, and fellowships
          curated for you.
        </p>
      </div>

      {/* Mobile Selector */}
      <div className="sm:hidden mb-6">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {TABS_CONFIG.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="hidden sm:block"
      >
        <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-8">
          {TABS_CONFIG.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-sky-600 data-[state=active]:text-white border border-transparent data-[state=active]:shadow-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS_CONFIG.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {renderTabContent(data[tab.value as OpportunityType] || [], tab)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Mobile Content Display */}
      <div className="sm:hidden">
        {(() => {
          const currentConfig = TABS_CONFIG.find((t) => t.value === activeTab);
          return currentConfig
            ? renderTabContent(
                data[activeTab as OpportunityType] || [],
                currentConfig,
              )
            : null;
        })()}
      </div>
    </section>
  );
}

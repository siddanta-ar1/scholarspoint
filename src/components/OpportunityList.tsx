"use client";

import { useState } from "react";
import { Opportunity } from "@/types/database";
import { OpportunityCard } from "./OpportunityCard";
import { BadgeCheck, Grid3X3, List, Filter, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { sortByDeadline } from "@/lib/opportunityHelpers";

type Props = {
  title: string;
  data: Opportunity[];
  viewAllLink?: string;
  showViewToggle?: boolean;
  showFilters?: boolean;
};

export default function OpportunityList({
  title,
  data,
  viewAllLink,
  showViewToggle = true,
  showFilters = true,
}: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showExpired, setShowExpired] = useState(false);

  // Sort and filter
  const sortedData = sortByDeadline(data, showExpired);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 font-medium">No opportunities found</p>
        <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          {title}
          <BadgeCheck className="text-sky-500 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm font-normal text-gray-400">
            ({sortedData.length})
          </span>
        </h3>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Expired Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowExpired(!showExpired)}
              className={cn(
                "text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all",
                showExpired
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              )}
            >
              {showExpired ? "Hide Expired" : "Show Expired"}
            </button>
          )}

          {/* View Toggle - Desktop only */}
          {showViewToggle && (
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-sky-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 shadow-sm text-sky-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          )}

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline hidden sm:block"
            >
              View All →
            </Link>
          )}
        </div>
      </div>

      {/* Opportunities Grid/List */}
      {viewMode === "grid" ? (
        <>
          {/* Desktop: Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {sortedData.map((item) => (
              <OpportunityCard key={item.id} data={item} />
            ))}
          </div>
          {/* Mobile: Compact list */}
          <div className="sm:hidden space-y-3">
            {sortedData.map((item) => (
              <OpportunityCard key={item.id} data={item} compact />
            ))}
          </div>
        </>
      ) : (
        // List view for desktop
        <div className="space-y-3">
          {sortedData.map((item) => (
            <OpportunityCard key={item.id} data={item} compact />
          ))}
        </div>
      )}

      {/* Mobile View All */}
      {viewAllLink && (
        <div className="sm:hidden text-center pt-2">
          <Link href={viewAllLink}>
            <Button variant="outline" className="rounded-full px-6">
              View All →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

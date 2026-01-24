"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Building2, AlertTriangle } from "lucide-react";
import { Opportunity } from "@/types/database";
import { isExpired, getDeadlineStatus } from "@/lib/opportunityHelpers";

type OpportunityCardProps = {
  data: Opportunity;
  compact?: boolean; // For mobile compact mode
};

// Helper to extract a tertiary detail based on type
const getTypeDetail = (data: Opportunity) => {
  const details = data.details as any;

  switch (data.type) {
    case "internship":
      return details?.stipend ? `💰 ${details.stipend}` : null;
    case "scholarship":
      return details?.degree || details?.funding_type?.replace("_", " ") || null;
    case "competition":
      return details?.prizes?.[0] ? `🏆 ${details.prizes[0]}` : null;
    case "fellowship":
      return details?.fellowship_value || null;
    case "online_course":
      return details?.cost_type === "free" ? "🆓 Free" : null;
    default:
      return null;
  }
};

// Get the correct URL path for the opportunity type
const getOpportunityPath = (type: string) => {
  const pathMap: Record<string, string> = {
    scholarship: "/scholarships",
    internship: "/internships",
    fellowship: "/fellowships",
    competition: "/competitions",
    conference: "/conferences",
    workshop: "/workshops",
    exchange_program: "/exchange_programs",
    online_course: "/online_courses",
    job: "/jobs",
  };
  return pathMap[type] || "/opportunities";
};

export const OpportunityCard = ({ data, compact = false }: OpportunityCardProps) => {
  const expired = isExpired(data.deadline);
  const status = getDeadlineStatus(data.deadline);
  const typeDetail = getTypeDetail(data);

  // Compact mobile card
  if (compact) {
    return (
      <Link
        href={`${getOpportunityPath(data.type)}/${data.id}`}
        className="flex gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group"
      >
        {/* Small thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={data.image_url || "/placeholder.jpg"}
            alt={data.title}
            fill
            className={cn(
              "object-cover",
              expired && "grayscale"
            )}
            sizes="64px"
          />
          {expired && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className={cn(
            "font-semibold text-sm line-clamp-2 leading-tight",
            expired ? "text-gray-500" : "text-gray-900 dark:text-gray-100 group-hover:text-sky-600"
          )}>
            {data.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
            <span className="truncate">{data.organization}</span>
            {data.country && (
              <>
                <span>•</span>
                <span>{data.country}</span>
              </>
            )}
          </div>
          {status && !expired && (
            <Badge className={cn("mt-1.5 text-[10px] px-2 py-0", status.bgColor, status.color)}>
              {status.label}
            </Badge>
          )}
        </div>
      </Link>
    );
  }

  // Standard card (desktop/tablet)
  return (
    <Link
      href={`${getOpportunityPath(data.type)}/${data.id}`}
      className="block h-full group outline-none"
    >
      <div
        className={cn(
          "h-full flex flex-col overflow-hidden bg-white dark:bg-neutral-900 border border-gray-100 dark:border-gray-800 rounded-2xl",
          "transition-all duration-300 ease-out",
          expired
            ? "opacity-75 grayscale hover:opacity-90 hover:grayscale-0"
            : "hover:shadow-xl hover:-translate-y-1 hover:border-sky-200"
        )}
      >
        {/* Image Section - Responsive height */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden bg-gray-100">
          <Image
            src={data.image_url || "/placeholder.jpg"}
            alt={data.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !expired && "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Expired Overlay */}
          {expired && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-red-600 text-white text-xs sm:text-sm px-3 py-1 font-bold">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Expired
              </Badge>
            </div>
          )}

          {/* Type Badge */}
          {!expired && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 backdrop-blur-md bg-white/90 text-gray-900 capitalize text-[10px] sm:text-xs shadow-sm"
            >
              {data.type.replace("_", " ")}
            </Badge>
          )}

          {/* Featured Badge */}
          {data.is_featured && !expired && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none text-[10px] sm:text-xs shadow-lg">
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
          {/* Organization */}
          <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground gap-1.5">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{data.organization}</span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-bold text-sm sm:text-base leading-tight line-clamp-2 transition-colors",
              expired
                ? "text-gray-500"
                : "text-gray-900 dark:text-gray-100 group-hover:text-sky-600"
            )}
          >
            {data.title}
          </h3>

          <div className="flex-grow" />

          {/* Footer */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {/* Location & Detail Row */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{data.country || "Remote"}</span>
              </div>
              {typeDetail && (
                <span className="font-medium text-sky-600 capitalize truncate max-w-[80px] sm:max-w-[100px]">
                  {typeDetail}
                </span>
              )}
            </div>

            {/* Deadline Badge */}
            {status && (
              <div className="flex items-center justify-end">
                <Badge
                  className={cn(
                    "font-medium text-[10px] sm:text-xs px-2 py-0.5",
                    status.bgColor,
                    status.color
                  )}
                >
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

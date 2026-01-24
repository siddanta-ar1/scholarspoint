"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tag, MapPin, Calendar, Building2, AlertTriangle } from "lucide-react";
import { Opportunity } from "@/types/database";
import { isExpired, getDeadlineStatus } from "@/lib/opportunityHelpers";

type OpportunityCardProps = {
  data: Opportunity;
};

// Helper to extract a tertiary detail based on type
const getTypeDetail = (data: Opportunity) => {
  const details = data.details as any;

  switch (data.type) {
    case "internship":
      return details?.stipend ? `💰 ${details.stipend}` : "Internship";
    case "scholarship":
      return details?.degree ? `🎓 ${details.degree}` : "Scholarship";
    case "competition":
      return details?.prizes?.[0] ? `🏆 ${details.prizes[0]}` : "Competition";
    case "fellowship":
      return details?.fellowship_value ? `💵 ${details.fellowship_value}` : "Fellowship";
    case "online_course":
      return details?.cost_type === "free" ? "🆓 Free" : "Online Course";
    default:
      return data.type.replace("_", " ");
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

export const OpportunityCard = ({ data }: OpportunityCardProps) => {
  const expired = isExpired(data.deadline);
  const status = getDeadlineStatus(data.deadline);

  return (
    <Link
      href={`${getOpportunityPath(data.type)}/${data.id}`}
      className="no-underline h-full group outline-none block"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden bg-white dark:bg-neutral-900 border-border/60 shadow-sm",
          "transition-all duration-300 ease-in-out",
          expired
            ? "opacity-70 grayscale hover:opacity-90 hover:grayscale-0"
            : "hover:shadow-lg hover:-translate-y-1 hover:border-sky-500/50"
        )}
      >
        {/* Image Section */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={data.image_url || "/placeholder.jpg"}
            alt={data.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !expired && "group-hover:scale-105"
            )}
            sizes="(max-width: 768px) 100vw, 300px"
          />

          {/* Expired Overlay */}
          {expired && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-red-600 text-white text-sm px-4 py-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Expired
              </Badge>
            </div>
          )}

          {/* Floating Type Badge */}
          {!expired && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="backdrop-blur-md bg-white/90 text-black capitalize shadow-sm"
              >
                {data.type.replace("_", " ")}
              </Badge>
            </div>
          )}

          {/* Featured Badge */}
          {data.is_featured && !expired && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
                ⭐ Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="space-y-1">
            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <Building2 className="w-3 h-3" />
              <span className="truncate max-w-[200px]">
                {data.organization}
              </span>
            </div>
            <h3
              className={cn(
                "font-bold text-lg leading-tight line-clamp-2 transition-colors",
                expired
                  ? "text-gray-500"
                  : "text-gray-900 dark:text-gray-100 group-hover:text-sky-600"
              )}
            >
              {data.title}
            </h3>
          </div>

          <div className="flex-grow" />

          {/* Metadata Footer */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            {/* Location & Detail Row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{data.country || "Remote"}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-sky-600">
                <Tag className="w-3.5 h-3.5" />
                <span className="capitalize truncate max-w-[100px]">
                  {getTypeDetail(data)}
                </span>
              </div>
            </div>

            {/* Deadline Badge */}
            {status && (
              <div className="flex items-center justify-end">
                <Badge
                  className={cn(
                    "font-medium",
                    status.bgColor,
                    status.color
                  )}
                >
                  <Calendar className="w-3 h-3 mr-1.5" />
                  {status.label}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

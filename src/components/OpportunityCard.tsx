"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tag, MapPin, Calendar, Building2 } from "lucide-react";
import { Opportunity } from "@/types/database";

type OpportunityCardProps = {
  data: Opportunity;
};

// Helper to determine the status badge color
const getDeadlineStatus = (deadline: string | null) => {
  if (!deadline) return null;
  const daysLeft = Math.ceil(
    (new Date(deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysLeft < 0) return { label: "Expired", color: "bg-red-600" };
  if (daysLeft <= 7)
    return { label: `${daysLeft} days left`, color: "bg-orange-500" };
  return { label: `${daysLeft} days left`, color: "bg-green-600" };
};

// Helper to extract a tertiary detail based on type
const getTypeDetail = (data: Opportunity) => {
  const details = data.details as any;

  switch (data.type) {
    case "internship":
      return details.stipend ? `💰 ${details.stipend}` : "Internship";
    case "scholarship":
      return details.degree ? `🎓 ${details.degree}` : "Scholarship";
    case "competition":
      return details.prizes ? `🏆 Prize: ${details.prizes[0]}` : "Competition";
    default:
      return data.type.replace("_", " ");
  }
};

export const OpportunityCard = ({ data }: OpportunityCardProps) => {
  const status = getDeadlineStatus(data.deadline);

  return (
    // Note: URL structure assumes /opportunities/[slug] or /[type]/[slug]
    <Link
      href={`/${data.type}s/${data.id}`}
      className="no-underline h-full group outline-none block"
    >
      <Card
        className={cn(
          "h-full flex flex-col overflow-hidden bg-white dark:bg-neutral-900 border-border/60 shadow-sm",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-lg hover:-translate-y-1 hover:border-sky-500/50",
        )}
      >
        {/* Image Section */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={data.image_url || "/placeholder.jpg"}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {/* Floating Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-white/90 text-black capitalize shadow-sm"
            >
              {data.type.replace("_", " ")}
            </Badge>
          </div>
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
            <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-sky-600 transition-colors">
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
                <Badge className={cn("text-white font-normal", status.color)}>
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

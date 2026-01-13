"use client";

import { Opportunity } from "@/types/database";
import { OpportunityCard } from "./OpportunityCard";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  data: Opportunity[];
  viewAllLink?: string;
};

export default function OpportunityList({ title, data, viewAllLink }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          {title} <BadgeCheck className="text-sky-500" size={24} />
        </h3>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
          >
            View All &rarr;
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <OpportunityCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

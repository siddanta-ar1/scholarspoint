"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Briefcase,
  Award,
  GraduationCap,
  Plane,
  Trophy,
  Presentation,
  BookOpen,
} from "lucide-react";
import { OpportunityType } from "@/types/database";

// Unified type for search results
type SearchResult = {
  id: string;
  title: string;
  image_url?: string | null;
  organization: string;
  type: OpportunityType;
  href: string;
};

// Map types to professional labels and icons
const typeConfig: Record<
  string,
  { label: string; icon: React.ReactNode; path: string }
> = {
  scholarship: {
    label: "Scholarship",
    icon: <Award className="w-4 h-4 text-yellow-500" />,
    path: "/scholarships",
  },
  internship: {
    label: "Internship",
    icon: <Briefcase className="w-4 h-4 text-blue-500" />,
    path: "/internships",
  },
  fellowship: {
    label: "Fellowship",
    icon: <GraduationCap className="w-4 h-4 text-green-500" />,
    path: "/fellowships",
  },
  competition: {
    label: "Competition",
    icon: <Trophy className="w-4 h-4 text-red-500" />,
    path: "/competitions",
  },
  conference: {
    label: "Conference",
    icon: <Presentation className="w-4 h-4 text-purple-500" />,
    path: "/conferences",
  },
  exchange_program: {
    label: "Exchange",
    icon: <Plane className="w-4 h-4 text-indigo-500" />,
    path: "/exchange-programs",
  },
  online_course: {
    label: "Online Course",
    icon: <BookOpen className="w-4 h-4 text-sky-500" />,
    path: "/online-courses",
  },
  workshop: {
    label: "Workshop",
    icon: <Presentation className="w-4 h-4 text-orange-500" />,
    path: "/workshops",
  },
  job: {
    label: "Job",
    icon: <Briefcase className="w-4 h-4 text-neutral-500" />,
    path: "/jobs",
  },
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const performSearch = async (term: string) => {
      if (!term.trim() || term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);

      try {
        // FIX: Query the unified table instead of separate tables
        const { data, error } = await supabase
          .from("opportunities")
          .select("id, title, image_url, organization, type")
          .eq("is_active", true)
          .or(`title.ilike.%${term}%,organization.ilike.%${term}%`) // Search both title and org
          .limit(8);

        if (error) throw error;

        if (data) {
          const mapped = data.map((item) => ({
            id: item.id,
            title: item.title,
            image_url: item.image_url,
            organization: item.organization,
            type: item.type as OpportunityType,
            href: `${typeConfig[item.type]?.path || "/opportunities"}/${item.id}`,
          }));
          setResults(mapped);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-[100]" ref={searchRef}>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-sky-600 text-gray-400">
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Search scholarships, courses, or organizations..."
          className="w-full pl-14 pr-6 h-16 text-lg rounded-3xl shadow-2xl border-none ring-1 ring-gray-100 focus-visible:ring-2 focus-visible:ring-sky-500 bg-white/80 backdrop-blur-xl transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full mt-4 w-full bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <Loader2 className="animate-spin h-8 w-8 mb-2 text-sky-600" />
                <p className="text-sm font-medium">
                  Scanning global opportunities...
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-4">
                <p className="px-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Search Results
                </p>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-50">
                      {result.image_url ? (
                        <Image
                          src={result.image_url}
                          alt={result.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-sky-50 text-sky-600">
                          {typeConfig[result.type]?.icon || (
                            <Search size={20} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-sky-600 transition-colors">
                        {result.title}
                      </p>
                      <p className="text-xs font-medium text-gray-500 truncate uppercase tracking-wider">
                        {result.organization}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="hidden sm:flex items-center gap-1.5 py-1 px-3 border-sky-100 bg-white text-[10px] font-bold text-sky-700 shadow-sm rounded-lg"
                    >
                      {typeConfig[result.type]?.icon}
                      {typeConfig[result.type]?.label}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-500 font-medium">
                  No matches found for{" "}
                  <span className="text-sky-600 font-bold">"{searchTerm}"</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a broader term or different keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
  X,
} from "lucide-react";
import { OpportunityType } from "@/types/database";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  title: string;
  image_url?: string | null;
  organization: string;
  type: OpportunityType;
  href: string;
};

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
    path: "/exchange_programs",
  },
  online_course: {
    label: "Course",
    icon: <BookOpen className="w-4 h-4 text-sky-500" />,
    path: "/online_courses",
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const performSearch = async (term: string) => {
      if (!term.trim() || term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select("id, title, image_url, organization, type")
          .eq("is_active", true)
          .or(`title.ilike.%${term}%,organization.ilike.%${term}%`)
          .limit(6);

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

  // Keyboard shortcut (desktop only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-[100] px-4 sm:px-0" ref={searchRef}>
      <div className="relative group">
        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-sky-600 text-gray-400">
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search opportunities..."
          className="w-full pl-11 sm:pl-14 pr-10 h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border-none ring-1 ring-gray-100 focus-visible:ring-2 focus-visible:ring-sky-500 bg-white/95 backdrop-blur-xl transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        {/* Keyboard shortcut hint - desktop only */}
        <div className="absolute right-12 sm:right-16 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-xs text-gray-400">
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full mt-2 sm:mt-3 w-full bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xl sm:shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8 sm:p-12 text-gray-400 gap-2">
                <Loader2 className="animate-spin h-5 w-5 text-sky-600" />
                <span className="text-sm font-medium">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {results.length} result{results.length > 1 ? "s" : ""}
                </p>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all group"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-50">
                      {result.image_url ? (
                        <Image
                          src={result.image_url}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-sky-50 text-sky-600">
                          {typeConfig[result.type]?.icon || <Search size={16} />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-sky-600 transition-colors">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {result.organization}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="hidden sm:flex items-center gap-1 py-1 px-2 border-sky-100 bg-white text-[10px] font-bold text-sky-700 rounded-md"
                    >
                      {typeConfig[result.type]?.icon}
                      <span className="hidden lg:inline">{typeConfig[result.type]?.label}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-10 text-center">
                <div className="bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Search className="text-gray-300" size={20} />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No results for "<span className="text-sky-600">{searchTerm}</span>"
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different keyword
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

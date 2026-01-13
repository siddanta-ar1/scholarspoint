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
} from "lucide-react";

// A unified type for all search results to make rendering easy
type SearchResult = {
  id: string;
  title: string;
  image_url?: string | null;
  detail: string; // This will hold company, organization, institution, etc.
  href: string;
  category: string;
};

// A map to associate categories with icons
const categoryIcons: { [key: string]: React.ReactNode } = {
  Scholarship: <Award className="w-4 h-4 text-yellow-500" />,
  Internship: <Briefcase className="w-4 h-4 text-blue-500" />,
  Fellowship: <GraduationCap className="w-4 h-4 text-green-500" />,
  Competition: <Trophy className="w-4 h-4 text-red-500" />,
  Conference: <Presentation className="w-4 h-4 text-purple-500" />,
  "Exchange Program": <Plane className="w-4 h-4 text-indigo-500" />,
};

// Custom hook for debouncing input
function useDebouncedValue<T>(value: T, delay = 400) {
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
    // Fetches data from all tables in parallel
    const performSearch = async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);

      const tables = [
        {
          name: "scholarships",
          detailKey: "organization",
          category: "Scholarship",
          path: "/scholarships",
        },
        {
          name: "internships",
          detailKey: "company",
          category: "Internship",
          path: "/internships",
        },
        {
          name: "fellowships",
          detailKey: "organization",
          category: "Fellowship",
          path: "/fellowships",
        },
        {
          name: "competitions",
          detailKey: "organization",
          category: "Competition",
          path: "/competitions",
        },
        {
          name: "conferences",
          detailKey: "scholarship_name",
          category: "Conference",
          path: "/conferences",
        },
        {
          name: "trainings",
          detailKey: "organization",
          category: "Training",
          path: "/workshops",
        },
        {
          name: "exchange_programs",
          detailKey: "organization",
          category: "Exchange Program",
          path: "/exchange_programs",
        },
        {
          name: "online_courses",
          detailKey: "institution",
          category: "Online Course",
          path: "/online_courses",
        },
      ];

      try {
        const queries = tables.map((table) =>
          supabase
            .from(table.name)
            .select(`id, title, image_url, ${table.detailKey}`)
            .ilike("title", `%${term}%`)
            .limit(4),
        );

        const responses = await Promise.all(queries);

        let allResults: SearchResult[] = [];

        responses.forEach((res, index) => {
          if (res.data) {
            const table = tables[index];
            const mappedData = res.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              image_url: item.image_url,
              detail: item[table.detailKey] || "",
              href: `${table.path}/${item.id}`,
              category: table.category,
            }));
            allResults = [...allResults, ...mappedData];
          }
        });

        setResults(allResults);
      } catch (error) {
        console.error("Error performing global search:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Effect to handle clicks outside the search component to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for any opportunity..."
          className="w-full pl-12 pr-4 py-3 h-14 text-lg rounded-full shadow-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && searchTerm && (
        <div className="absolute top-full mt-2 w-full bg-background rounded-lg border shadow-xl z-50 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="animate-spin w-6 h-6 text-primary" />
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li key={`${result.category}-${result.id}`}>
                  <Link
                    href={result.href}
                    className="flex items-center gap-4 p-3 hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)} // Close dropdown on item click
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {result.image_url ? (
                        <Image
                          src={result.image_url}
                          alt={result.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          {categoryIcons[result.category]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{result.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.detail}
                      </p>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {categoryIcons[result.category]}
                      <span className="ml-1.5">{result.category}</span>
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

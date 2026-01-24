"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { isExpired } from "@/lib/opportunityHelpers";

type ResourceType = "opportunities" | "posts" | "visa_guides";

// Mapping resource to its specific edit route - FIXED PATHS
const editPaths: Record<ResourceType, string> = {
  posts: "/admin/blogs",
  visa_guides: "/admin/visa_guides",  // FIXED: was visa-guides
  opportunities: "/admin/opportunities",
};

// Mapping resource to public view path
const viewPaths: Record<ResourceType, (item: any) => string> = {
  opportunities: (item) => {
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
    return `${pathMap[item.type] || "/opportunities"}/${item.id}`;
  },
  posts: (item) => `/blogs/${item.slug}`,
  visa_guides: (item) => `/visa-guides/${item.id}`,
};

export default function DashboardTable({
  resource,
}: {
  resource: ResourceType;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(resource)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, [resource]);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this item?")) return;

    // Optimistic Update
    const previousItems = [...items];
    setItems(items.filter((i) => i.id !== id));

    const { error } = await supabase.from(resource).delete().eq("id", id);
    if (error) {
      toast.error("Deletion failed");
      setItems(previousItems); // Rollback
    } else {
      toast.success("Item deleted successfully");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-sky-600" size={32} />
        <p className="text-sm text-gray-500 mt-2">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed">
        <p className="text-gray-500 font-medium">No items found</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first {resource.replace("_", " ")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[24px] border shadow-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold">Title</TableHead>
            <TableHead className="font-bold">Type/Status</TableHead>
            <TableHead className="font-bold">Visibility</TableHead>
            {resource === "opportunities" && (
              <TableHead className="font-bold">Deadline</TableHead>
            )}
            <TableHead className="text-right font-bold px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const expired = resource === "opportunities" && isExpired(item.deadline);

            return (
              <TableRow
                key={item.id}
                className={`hover:bg-gray-50/50 transition-colors ${expired ? "bg-red-50/30" : ""
                  }`}
              >
                <TableCell className="max-w-[400px]">
                  <div className="font-bold truncate flex items-center gap-2">
                    {expired && (
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    {item.title}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {item.slug || item.id.slice(0, 8)}...
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize bg-sky-50 text-sky-700 border-sky-100"
                  >
                    {item.type || resource.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.is_active ?? item.is_published ? (
                    <Badge className="bg-green-50 text-green-700 border-none">
                      <Globe size={10} className="mr-1" /> Live
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                {resource === "opportunities" && (
                  <TableCell>
                    {item.deadline ? (
                      <span className={expired ? "text-red-600 font-medium" : ""}>
                        {new Date(item.deadline).toLocaleDateString()}
                        {expired && " (Expired)"}
                      </span>
                    ) : (
                      <span className="text-gray-400">No deadline</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    {/* View on site */}
                    <Link href={viewPaths[resource](item)} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-gray-100 text-gray-500"
                        title="View on site"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </Link>
                    {/* Edit */}
                    <Link href={`${editPaths[resource]}/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-sky-100 text-sky-600 border border-sky-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                    </Link>
                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-red-50 text-red-500 border border-red-50"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

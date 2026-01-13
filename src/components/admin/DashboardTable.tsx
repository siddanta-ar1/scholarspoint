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
import { Edit, Trash2, Globe, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardTable({
  resource,
}: {
  resource: "opportunities" | "posts" | "visa_guides";
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapping resource to its specific edit route
  const editPaths = {
    posts: "/admin/blogs",
    visa_guides: "/admin/visa-guides",
    opportunities: "/admin/opportunities",
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(resource)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setItems(data);
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
      toast.success("Item deleted");
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-sky-600" />
      </div>
    );

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[24px] border shadow-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold">Content Title</TableHead>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="max-w-[400px]">
                <div className="font-bold truncate">{item.title}</div>
                <div className="text-[10px] text-gray-400 font-mono">
                  {item.slug || item.id}
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
                {item.is_active || item.is_published ? (
                  <Badge className="bg-green-50 text-green-700 border-none">
                    <Globe size={10} className="mr-1" /> Live
                  </Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}
              </TableCell>
              <TableCell className="text-right px-6">
                <div className="flex justify-end gap-2">
                  <Link href={`${editPaths[resource]}/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-sky-100 text-sky-600 border border-sky-50"
                    >
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-red-50 text-red-500 border border-red-50"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

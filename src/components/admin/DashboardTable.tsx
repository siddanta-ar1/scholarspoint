"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Opportunity } from "@/types/database";
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
import { Edit, Trash2, Eye } from "lucide-react";

export default function DashboardTable() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50); // Adjust limit as needed

    if (data) setItems(data as Opportunity[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this? This cannot be undone.")
    )
      return;

    // Optimistic update (remove from UI immediately)
    setItems(items.filter((i) => i.id !== id));

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting item");
      fetchItems(); // Revert if error
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[300px] truncate">
                {item.title}
                <div className="text-xs text-gray-500">{item.organization}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {item.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {item.is_active ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </TableCell>
              <TableCell>{item.deadline || "N/A"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/admin/opportunities/${item.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

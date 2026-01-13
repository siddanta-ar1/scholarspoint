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
import { Edit, Plus, Trash2, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      setPosts(data || []);
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article forever?")) return;
    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">
          Blog <span className="text-sky-600">Articles</span>
        </h1>
        <Link href="/admin/blogs/new">
          <Button className="gap-2 bg-sky-600">
            <Plus size={18} /> Write New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[24px] border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-bold max-w-[300px] truncate">
                  {post.title}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {post.author_name}
                </TableCell>
                <TableCell>
                  {post.is_published ? (
                    <Badge className="bg-green-50 text-green-700 border-none gap-1">
                      <Globe size={12} /> Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Lock size={12} /> Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Link href={`/admin/blogs/${post.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit size={14} />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

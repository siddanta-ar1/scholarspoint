"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BlogForm from "@/components/admin/BlogForm";
import { Loader2 } from "lucide-react";
import { Post } from "@/types/database";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!post)
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Post Not Found</h2>
        <p className="text-gray-500 mt-2">The requested blog post does not exist.</p>
      </div>
    );

  return <BlogForm initialData={post} />;
}

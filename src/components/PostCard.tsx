"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// This interface must wrap the post object
export interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    image_url?: string | null;
    excerpt: string;
    published_at: string;
    author_name: string;
    tags: string[];
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group">
      <Card className="rounded-[32px] overflow-hidden border-none shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-white">
        <div className="relative aspect-video">
          <Image
            src={post.image_url || "/placeholder.jpg"}
            alt={post.title} // Correctly added alt for SEO
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-8">{/* Your content here */}</CardContent>
      </Card>
    </Link>
  );
}

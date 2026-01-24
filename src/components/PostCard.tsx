"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Post } from "@/types/database";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Draft";

  return (
    <Link href={`/blogs/${post.slug}`} className="group block h-full">
      <Card className="h-full rounded-[24px] overflow-hidden border-none shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 bg-white">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image_url || "/placeholder.jpg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Tags overlay */}
          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  className="bg-white/90 text-sky-700 text-[10px] font-bold uppercase tracking-wide shadow-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6 space-y-3">
          <h3 className="font-bold text-lg leading-tight text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span className="font-medium">{post.author_name || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

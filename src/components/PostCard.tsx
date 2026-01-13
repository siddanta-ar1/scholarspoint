"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
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
    <article className="group h-full">
      <Link href={`/blogs/${post.slug}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[32px] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
          {/* Image Section - FIXED: Added mandatory alt tag */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title} // Fixed: alt property added
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-sky-50 flex items-center justify-center">
                <span className="text-sky-300 font-bold uppercase tracking-widest text-xs">
                  ScholarsPoint
                </span>
              </div>
            )}

            {/* Category Tag Overlay */}
            {post.tags?.[0] && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-sky-700 backdrop-blur-md border-none font-bold uppercase text-[10px] px-3 py-1">
                  {post.tags[0]}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-8 flex flex-col flex-1 space-y-4">
            <div className="flex items-center gap-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-sky-500" />
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-sky-500" />
                {post.author_name}
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed">
              {post.excerpt}
            </p>

            <div className="pt-4 mt-auto flex items-center text-sky-600 font-bold text-sm group-hover:gap-2 transition-all">
              Read Article <ArrowRight size={16} className="ml-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}

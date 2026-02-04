import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { Calendar, User, ArrowLeft, Clock, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | ScholarsPoint Blog`,
    description: post.excerpt,
    openGraph: { images: [post.image_url] },
  };
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.image_url,
    author: { "@type": "Person", name: post.author_name },
    datePublished: post.published_at,
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blogs"
        className="text-sky-600 font-bold flex items-center gap-2 mb-8 hover:opacity-70"
      >
        <ArrowLeft size={20} /> Back to Insights
      </Link>

      <article className="space-y-10">
        <header className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag: string) => (
              <Badge
                key={tag}
                className="bg-sky-50 text-sky-700 border-none px-3 font-bold uppercase text-[10px]"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 border-y py-4 border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                {post.author_name.charAt(0)}
              </div>
              {post.author_name}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />{" "}
              {new Date(post.published_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} /> 5 min read
            </div>
          </div>

          <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <section className="prose prose-lg dark:prose-invert max-w-none prose-sky prose-img:rounded-3xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </section>
      </article>
    </main>
  );
}

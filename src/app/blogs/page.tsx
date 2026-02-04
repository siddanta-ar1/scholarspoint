import { PostCard } from "@/components/PostCard";
import { supabase } from "@/lib/supabaseClient";
import { BookOpen } from "lucide-react";

export const revalidate = 0;

export default async function BlogListPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <main className="container mx-auto px-4 py-16 space-y-12 min-h-screen">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex p-4 bg-sky-50 text-sky-600 rounded-[24px] mb-2 shadow-sm">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-gray-900">
          The <span className="text-sky-600">ScholarsPoint</span> Blog
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium">
          Expert insights, success stories, and verified guides for your global
          education journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts?.map((post) => (
          // Fixed: post property is now correctly recognized by PostCard
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed">
          <p className="text-gray-500 font-bold">
            No articles found. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}

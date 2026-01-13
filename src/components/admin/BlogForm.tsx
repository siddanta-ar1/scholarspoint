"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import ImageUpload from "./ImageUpload";
import Link from "next/link";

export default function BlogForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    author_name: initialData?.author_name || "ScholarsPoint Team",
    is_published: initialData?.is_published ?? true,
  });
  const [errorState, setErrorState] = useState({ isOpen: false, message: "" });
  const [successState, setSuccessState] = useState({
    isOpen: false,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const payload = {
        ...formData,
        slug,
        updated_at: new Date().toISOString(),
      };

      const { error } = initialData?.id
        ? await supabase.from("posts").update(payload).eq("id", initialData.id)
        : await supabase.from("posts").insert([payload]);

      if (error) throw error;
      setSuccessState({
        isOpen: true,
        message: "Article published successfully.",
      });
    } catch (err: any) {
      setErrorState({ isOpen: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <ErrorModal
        isOpen={errorState.isOpen}
        message={errorState.message}
        onClose={() => setErrorState({ ...errorState, isOpen: false })}
      />
      <SuccessModal
        isOpen={successState.isOpen}
        message={successState.message}
        onClose={() => router.push("/admin")}
      />

      <div className="flex items-center justify-between mb-8">
        <Link
          href="/admin"
          className="flex items-center text-gray-500 hover:text-sky-600 font-bold gap-2"
        >
          <ArrowLeft size={20} /> Dashboard
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 h-12 px-8 rounded-xl shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}{" "}
          Save Article
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[32px] shadow-xl border-none">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="font-bold">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">Summary</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">Content (Markdown)</label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={15}
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[32px] shadow-xl border-none h-fit">
          <CardContent className="p-8 space-y-6">
            <label className="font-bold block">Featured Image</label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";

export default function BlogForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState({ isOpen: false, message: "" });
  const [successState, setSuccessState] = useState({
    isOpen: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    author_name: initialData?.author_name || "",
    tags: initialData?.tags?.join(", ") || "",
    is_published: initialData?.is_published ?? false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        updated_at: new Date().toISOString(),
      };

      let error;
      if (initialData?.id) {
        const res = await supabase
          .from("posts")
          .update(payload)
          .eq("id", initialData.id);
        error = res.error;
      } else {
        const res = await supabase.from("posts").insert(payload);
        error = res.error;
      }

      if (error) throw error;
      setSuccessState({
        isOpen: true,
        message: "Blog post saved and synchronized.",
      });
    } catch (err: any) {
      setErrorState({ isOpen: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ErrorModal
        isOpen={errorState.isOpen}
        message={errorState.message}
        onClose={() => setErrorState({ ...errorState, isOpen: false })}
      />
      <SuccessModal
        isOpen={successState.isOpen}
        message={successState.message}
        onClose={() => {
          setSuccessState({ ...successState, isOpen: false });
          router.push("/admin");
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto space-y-6 pb-20"
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="text-sky-600" />{" "}
            {initialData ? "Edit Blog" : "Create New Blog Post"}
          </h1>
          <Button
            type="submit"
            disabled={loading}
            className="ml-auto bg-sky-600 hover:bg-sky-700"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            Save Post
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Excerpt (Short Summary)</Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Full Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media & Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Featured Image</Label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) =>
                      setFormData({ ...formData, image_url: url })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Author Name</Label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) =>
                      setFormData({ ...formData, author_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tags (Comma separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="Scholarships, UK, Guide"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft, Loader2, FileText, Image as ImageIcon, Tag } from "lucide-react";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import ImageUpload from "./ImageUpload";
import Link from "next/link";
import { Post } from "@/types/database";

// Generate unique slug with random suffix
const generateSlug = (title: string) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 7)
  );
};

export default function BlogForm({ initialData }: { initialData?: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    author_name: initialData?.author_name || "ScholarsPoint Team",
    tags: initialData?.tags?.join(", ") || "",
    is_published: initialData?.is_published ?? true,
  });
  const [errorState, setErrorState] = useState({ isOpen: false, message: "" });
  const [successState, setSuccessState] = useState({
    isOpen: false,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: formData.image_url,
        author_name: formData.author_name,
        tags: tagsArray,
        is_published: formData.is_published,
        slug: initialData?.slug || generateSlug(formData.title),
        updated_at: new Date().toISOString(),
        // Set published_at only when publishing for the first time
        ...(formData.is_published && !initialData?.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      };

      const { error } = initialData?.id
        ? await supabase.from("posts").update(payload).eq("id", initialData.id)
        : await supabase.from("posts").insert([payload]);

      if (error) throw error;
      setSuccessState({
        isOpen: true,
        message: initialData
          ? "Article updated successfully."
          : "Article published successfully.",
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
        onClose={() => {
          setSuccessState({ ...successState, isOpen: false });
          router.push("/admin");
          router.refresh();
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {initialData ? "Edit Article" : "New Article"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Write and publish blog content
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 h-11 px-6 rounded-xl shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {initialData ? "Update" : "Publish"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText size={18} /> Article Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="h-12 text-lg"
                placeholder="Enter article title"
              />
            </div>
            <div className="space-y-2">
              <Label>Summary / Excerpt</Label>
              <Textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="A brief summary shown in article cards (2-3 sentences)"
              />
            </div>
            <div className="space-y-2">
              <Label>Content (Markdown supported)</Label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={18}
                className="font-mono text-sm"
                placeholder="Write your article content here. Markdown formatting is supported."
              />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card className="rounded-2xl shadow-sm border-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon size={18} /> Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />
            </CardContent>
          </Card>

          {/* Meta */}
          <Card className="rounded-2xl shadow-sm border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag size={14} /> Tags (comma separated)
                </Label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., Scholarships, USA, Tips"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <Label className="font-medium">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this article visible to the public
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

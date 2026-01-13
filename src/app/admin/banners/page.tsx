"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Trash2, Save, Plus, ArrowLeft, Layout } from "lucide-react";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import Link from "next/link";

type Banner = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
};

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [errorState, setErrorState] = useState({ isOpen: false, message: "" });
  const [successState, setSuccessState] = useState({
    isOpen: false,
    message: "",
  });

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBanners(data as Banner[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const updateBannerState = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
  };

  const handleSave = async (banner: Banner) => {
    setSavingId(banner.id);
    const payload = { ...banner };
    const isNew = banner.id.startsWith("new-");

    // Remove ID for insertion if new
    if (isNew) delete (payload as any).id;

    try {
      const { error } = isNew
        ? await supabase.from("banners").insert([payload])
        : await supabase.from("banners").update(payload).eq("id", banner.id);

      if (error) throw error;
      setSuccessState({
        isOpen: true,
        message: "Banner slide synchronized successfully.",
      });
      fetchBanners();
    } catch (err: any) {
      setErrorState({ isOpen: true, message: err.message });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner slide permanently?")) return;
    await supabase.from("banners").delete().eq("id", id);
    setBanners(banners.filter((b) => b.id !== id));
  };

  const addNew = () => {
    const newId = `new-${Date.now()}`;
    setBanners([
      {
        id: newId,
        title: "",
        description: "",
        image_url: "",
        link_url: "",
        background_color: "#0284c7",
        text_color: "#ffffff",
        is_active: true,
      },
      ...banners,
    ]);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" />
      </div>
    );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <ErrorModal
        isOpen={errorState.isOpen}
        message={errorState.message}
        onClose={() => setErrorState({ ...errorState, isOpen: false })}
      />
      <SuccessModal
        isOpen={successState.isOpen}
        message={successState.message}
        onClose={() => setSuccessState({ ...successState, isOpen: false })}
      />

      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Layout className="text-sky-600" /> Hero{" "}
            <span className="text-sky-600">Banners</span>
          </h1>
          <p className="text-muted-foreground">
            Customize the main slider on your homepage.
          </p>
        </div>
        <Button
          onClick={addNew}
          className="gap-2 bg-sky-600 hover:bg-sky-700 shadow-lg"
        >
          <Plus size={18} /> Add New Slide
        </Button>
      </div>

      <div className="grid gap-8">
        {banners.map((banner) => (
          <Card
            key={banner.id}
            className="overflow-hidden border-none shadow-xl bg-white dark:bg-neutral-900 rounded-[32px]"
          >
            <CardHeader className="border-b bg-gray-50/50 dark:bg-black/20 px-8 py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-500 flex justify-between items-center">
                Slide Editor{" "}
                {banner.id.startsWith("new") && (
                  <span className="text-sky-600 text-[10px] bg-sky-100 px-2 py-0.5 rounded-full">
                    Unsaved Draft
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid gap-10 md:grid-cols-2">
              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label className="font-bold">Headline</Label>
                  <Input
                    value={banner.title}
                    onChange={(e) =>
                      updateBannerState(banner.id, { title: e.target.value })
                    }
                    placeholder="Main Title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Description</Label>
                  <Textarea
                    value={banner.description}
                    onChange={(e: any) =>
                      updateBannerState(banner.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief summary..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="font-bold">BG Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        className="h-10 w-12 rounded cursor-pointer"
                        value={banner.background_color}
                        onChange={(e) =>
                          updateBannerState(banner.id, {
                            background_color: e.target.value,
                          })
                        }
                      />
                      <Input
                        value={banner.background_color}
                        readOnly
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold">Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        className="h-10 w-12 rounded cursor-pointer"
                        value={banner.text_color}
                        onChange={(e) =>
                          updateBannerState(banner.id, {
                            text_color: e.target.value,
                          })
                        }
                      />
                      <Input
                        value={banner.text_color}
                        readOnly
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Action Link</Label>
                  <Input
                    value={banner.link_url}
                    onChange={(e) =>
                      updateBannerState(banner.id, { link_url: e.target.value })
                    }
                    placeholder="/scholarships/..."
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleSave(banner)}
                    disabled={savingId === banner.id}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 h-12 rounded-xl font-bold"
                  >
                    {savingId === banner.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save size={18} className="mr-2" />
                    )}{" "}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(banner.id)}
                    className="h-12 w-12 rounded-xl text-red-500 hover:bg-red-50 border-red-100"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-bold text-sky-600">Visual Preview</Label>
                <div
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-inner border-4 border-white"
                  style={{
                    backgroundColor: banner.background_color,
                    color: banner.text_color,
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl font-black mb-2">
                      {banner.title || "Preview Title"}
                    </h3>
                    <p className="text-sm opacity-90 max-w-[250px]">
                      {banner.description ||
                        "The banner description will appear here..."}
                    </p>
                    <div className="mt-4 px-4 py-2 rounded-full bg-white text-black text-xs font-bold shadow-lg">
                      Action Button
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Label className="font-bold mb-2 block">
                    Upload Poster Image
                  </Label>
                  <ImageUpload
                    value={banner.image_url}
                    onChange={(url) =>
                      updateBannerState(banner.id, { image_url: url })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Textarea } from "@/components/ui/textarea"; // Standardize with Opportunity form

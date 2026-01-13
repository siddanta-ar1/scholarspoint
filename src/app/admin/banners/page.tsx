"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/admin/ImageUpload";
import { Loader2, Trash2, Save, Plus } from "lucide-react";

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

  const fetchBanners = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("created_at");
    if (data) setBanners(data as Banner[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSave = async (banner: Banner) => {
    const payload = {
      title: banner.title,
      description: banner.description,
      image_url: banner.image_url,
      link_url: banner.link_url,
      background_color: banner.background_color,
      text_color: banner.text_color,
      is_active: true,
    };

    if (banner.id.includes("new-")) {
      // Create
      const { error } = await supabase.from("banners").insert(payload);
      if (!error) fetchBanners();
    } else {
      // Update
      await supabase.from("banners").update(payload).eq("id", banner.id);
      alert("Banner Updated");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    fetchBanners();
  };

  const addNew = () => {
    setBanners([
      ...banners,
      {
        id: `new-${Date.now()}`,
        title: "New Banner",
        description: "",
        image_url: "",
        link_url: "",
        background_color: "#0284c7",
        text_color: "#ffffff",
        is_active: true,
      },
    ]);
  };

  if (loading)
    return (
      <div className="p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Banners</h1>
        <Button onClick={addNew} className="gap-2">
          <Plus size={16} /> Add Slide
        </Button>
      </div>

      <div className="space-y-6">
        {banners.map((banner, index) => (
          <Card
            key={banner.id}
            className="overflow-hidden border-2"
            style={{ borderColor: banner.background_color }}
          >
            <CardContent className="p-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Headline Text</Label>
                  <Input
                    value={banner.title}
                    onChange={(e) => {
                      const newBanners = [...banners];
                      newBanners[index].title = e.target.value;
                      setBanners(newBanners);
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Subtext / Description</Label>
                  <Input
                    value={banner.description}
                    onChange={(e) => {
                      const newBanners = [...banners];
                      newBanners[index].description = e.target.value;
                      setBanners(newBanners);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        className="h-10 w-10 cursor-pointer rounded border"
                        value={banner.background_color}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[index].background_color = e.target.value;
                          setBanners(newBanners);
                        }}
                      />
                      <Input value={banner.background_color} readOnly />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        className="h-10 w-10 cursor-pointer rounded border"
                        value={banner.text_color}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[index].text_color = e.target.value;
                          setBanners(newBanners);
                        }}
                      />
                      <Input value={banner.text_color} readOnly />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Link URL</Label>
                  <Input
                    placeholder="/scholarships/..."
                    value={banner.link_url}
                    onChange={(e) => {
                      const newBanners = [...banners];
                      newBanners[index].link_url = e.target.value;
                      setBanners(newBanners);
                    }}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleSave(banner)}
                    className="flex-1 gap-2"
                  >
                    <Save size={16} /> Save Slide
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner Image (Optional)</Label>
                <ImageUpload
                  value={banner.image_url}
                  onChange={(url) => {
                    const newBanners = [...banners];
                    newBanners[index].image_url = url;
                    setBanners(newBanners);
                  }}
                />
                <div
                  className="mt-4 p-4 rounded-xl text-center shadow-sm"
                  style={{
                    backgroundColor: banner.background_color,
                    color: banner.text_color,
                  }}
                >
                  <h3 className="font-bold text-lg">
                    {banner.title || "Preview Title"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {banner.description || "Preview description text..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

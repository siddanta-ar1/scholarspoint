"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";

export default function BannerSlider() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      setBanners(data || []);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  if (loading)
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-2xl">
        <Loader2 className="animate-spin text-sky-600" />
      </div>
    );
  if (banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-900 h-[400px] md:h-[500px]">
      {/* For simplicity, we show the first active banner. You can add Swiper.js later for sliding. */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 flex transition-opacity duration-1000",
            index === 0 ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div
            className="flex-1 p-10 md:p-20 flex flex-col justify-center z-10 space-y-6"
            style={{ backgroundColor: banner.background_color }}
          >
            <h2
              className="text-4xl md:text-6xl font-black leading-tight"
              style={{ color: banner.text_color }}
            >
              {banner.title}
            </h2>
            <p
              className="text-lg md:text-xl opacity-90 max-w-lg"
              style={{ color: banner.text_color }}
            >
              {banner.description}
            </p>
            <Link href={banner.link_url || "#"}>
              <Button
                size="lg"
                className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90"
              >
                Apply Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {banner.image_url && (
            <div className="hidden md:block relative w-1/2 h-full">
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${banner.background_color}, transparent)`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

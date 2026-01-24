"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Banner } from "@/types/database";

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      setBanners((data as Banner[]) || []);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-3xl">
        <Loader2 className="animate-spin text-sky-600" size={32} />
      </div>
    );
  }

  if (banners.length === 0) return null;

  const currentBanner = banners[activeIndex];

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-neutral-900 h-[400px] md:h-[500px] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 flex transition-all duration-700 ease-in-out",
            index === activeIndex
              ? "opacity-100 translate-x-0"
              : index < activeIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
          )}
          aria-hidden={index !== activeIndex}
        >
          {/* Content */}
          <div
            className="flex-1 p-10 md:p-16 lg:p-20 flex flex-col justify-center z-10 space-y-6"
            style={{ backgroundColor: banner.background_color }}
          >
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight"
              style={{ color: banner.text_color }}
            >
              {banner.title}
            </h2>
            {banner.description && (
              <p
                className="text-base md:text-lg lg:text-xl opacity-90 max-w-lg line-clamp-3"
                style={{ color: banner.text_color }}
              >
                {banner.description}
              </p>
            )}
            {banner.link_url && (
              <Link href={banner.link_url}>
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12 bg-white text-black hover:bg-white/90 font-bold shadow-lg transition-transform hover:scale-105"
                >
                  {banner.btn_text || "Learn More"}{" "}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Image */}
          {banner.image_url && (
            <div className="hidden md:block relative w-1/2 h-full">
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, ${banner.background_color}, transparent)`,
                }}
              />
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === activeIndex
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Pause/Play Button */}
      {banners.length > 1 && (
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-6 right-6 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      )}

      {/* Progress Bar */}
      {banners.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            className="h-full bg-white/60 transition-all"
            style={{
              animation: "progress 5s linear infinite",
              width: "100%",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </section>
  );
}

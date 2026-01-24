"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Stats for social proof
  // const stats = [
  //   { value: "1000+", label: "Opportunities" },
  //   { value: "50+", label: "Countries" },
  //   { value: "100K+", label: "Students Helped" },
  // ];

  return (
    <section className="relative overflow-hidden">
      {/* Background - Video with fallback image */}
      <div className="absolute inset-0">
        {/* Fallback gradient/image shown immediately */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900">
          {/* Optional: Add a static image as placeholder */}
          <Image
            src="/hero-bg.jpg"
            alt=""
            fill
            className={`object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-0" : "opacity-30"
              }`}
            priority
          />
        </div>

        {/* Video loads in background */}
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-60" : "opacity-0"
            }`}
          src="/video.mp4"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] flex flex-col justify-center py-12 sm:py-16">
          {/* Main content */}
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Updated Daily
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Discover{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                Global Scholarships
              </span>
              <br className="hidden sm:block" />{" "}
              <span className="sm:hidden">&amp; </span>
              <span className="hidden sm:inline">& </span>
              Opportunities 🎓
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl leading-relaxed">
              Your trusted platform for fully funded scholarships, internships, fellowships,
              and visa guidance for students worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/scholarships" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold px-6 sm:px-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl shadow-xl shadow-sky-500/25 transition-all hover:scale-[1.02]"
                >
                  Browse Scholarships
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link href="/internships" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-bold px-6 sm:px-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl"
                >
                  Find Internships
                </Button>
              </Link>
            </div>

            {/* Quick Stats - Mobile optimized */}
            {/* <div className="flex gap-6 sm:gap-10 pt-4 sm:pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      {/* Video controls - only shown when video is loaded */}
      {videoLoaded && (
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}

      {/* Bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}

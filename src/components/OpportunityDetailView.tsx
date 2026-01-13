"use client";

import { useState } from "react";
import { Opportunity } from "@/types/database";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Globe,
  Share2,
  CheckCircle2,
  Clock,
  Building,
  DollarSign,
  GraduationCap,
  Zap,
  Award,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function OpportunityDetailView({ data }: { data: Opportunity }) {
  const details: any = data.details || {};
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: data.title,
      text: `Check out: ${data.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* 1. Hero Poster Section */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-[40px] overflow-hidden mb-12 group shadow-2xl">
        <Image
          src={data.image_url || "/placeholder.jpg"}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
          <Badge className="mb-4 bg-sky-500 hover:bg-sky-600 text-white border-none capitalize text-sm px-4 py-1.5 rounded-full shadow-lg">
            {data.type.replace("_", " ")}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-shadow-lg">
            {data.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-200">
            <div className="flex items-center gap-2">
              <Building size={18} className="text-sky-400" />{" "}
              {data.organization}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-sky-400" />{" "}
              {data.country || "Online"}
            </div>
            {data.deadline && (
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-sky-400" /> Deadline:{" "}
                {data.deadline}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4 md:px-0">
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {data.type === "online_course" ? (
              <>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold">
                      PACING
                    </p>
                    <p className="font-bold capitalize">
                      {details.pacing?.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold">
                      CERTIFICATE
                    </p>
                    <p className="font-bold">
                      {details.certificate ? "Verified" : "Not Included"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {details.funding_type && (
                  <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex items-center gap-3">
                    <DollarSign size={20} className="text-sky-600" />
                    <p className="font-semibold capitalize">
                      {details.funding_type.replace("_", " ")}
                    </p>
                  </div>
                )}
                {details.degree && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center gap-3">
                    <GraduationCap size={20} className="text-purple-600" />
                    <p className="font-semibold">{details.degree}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100">
              Overview
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-300 text-lg">
              {data.description}
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="sticky top-24 shadow-2xl border-none overflow-hidden bg-white dark:bg-gray-900 rounded-[32px]">
            <div className="h-3 w-full bg-gradient-to-r from-sky-400 to-blue-600" />
            <CardContent className="p-8 space-y-8">
              <div className="text-center">
                <h3 className="font-black text-2xl mb-2 text-gray-900 dark:text-gray-50">
                  Apply Now
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Verify all details on the official site
                </p>
              </div>
              <Button
                className="w-full h-14 text-lg font-bold gap-2 bg-sky-600 hover:bg-sky-700 shadow-lg rounded-2xl"
                asChild
              >
                <Link href={data.application_url || "#"} target="_blank">
                  Official Link <Globe size={20} />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl gap-2 text-gray-600"
                onClick={handleShare}
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}{" "}
                {copied ? "Link Copied!" : "Share Opportunity"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </article>
  );
}

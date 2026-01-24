"use client";

import { useState } from "react";
import { Opportunity } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Globe,
  Share2,
  Clock,
  Building,
  DollarSign,
  GraduationCap,
  Zap,
  Award,
  Check,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { isExpired, formatDeadline, getDeadlineStatus } from "@/lib/opportunityHelpers";

export default function OpportunityDetailView({ data }: { data: Opportunity }) {
  const details: any = data.details || {};
  const [copied, setCopied] = useState(false);
  const expired = isExpired(data.deadline);
  const deadlineStatus = getDeadlineStatus(data.deadline);

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

  // Get similar opportunities path
  const getSimilarPath = () => {
    const pathMap: Record<string, string> = {
      scholarship: "/scholarships",
      internship: "/internships",
      fellowship: "/fellowships",
      competition: "/competitions",
      conference: "/conferences",
      workshop: "/workshops",
      exchange_program: "/exchange_programs",
      online_course: "/online_courses",
      job: "/jobs",
    };
    return pathMap[data.type] || "/";
  };

  return (
    <article className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 px-4">
      {/* Expired Banner */}
      {expired && (
        <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-lg mb-1">
                This Opportunity Has Expired
              </h3>
              <p className="text-red-600 text-sm mb-4">
                The deadline for this opportunity was {formatDeadline(data.deadline)}.
                Don't worry – we have many other similar opportunities for you!
              </p>
              <Link href={getSimilarPath()}>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  Explore Similar {data.type.replace("_", " ")}s
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Poster Section */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-[40px] overflow-hidden mb-12 group shadow-2xl">
        <Image
          src={data.image_url || "/placeholder.jpg"}
          alt={data.title}
          fill
          className={`object-cover transition-transform duration-700 ${!expired && "group-hover:scale-105"
            } ${expired && "grayscale"}`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-sky-500 hover:bg-sky-600 text-white border-none capitalize text-sm px-4 py-1.5 rounded-full shadow-lg">
              {data.type.replace("_", " ")}
            </Badge>
            {expired && (
              <Badge className="bg-red-500 text-white border-none text-sm px-4 py-1.5 rounded-full">
                Expired
              </Badge>
            )}
            {data.is_featured && !expired && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none text-sm px-4 py-1.5 rounded-full">
                ⭐ Featured
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-shadow-lg">
            {data.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-200">
            <div className="flex items-center gap-2">
              <Building size={18} className="text-sky-400" /> {data.organization}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-sky-400" /> {data.country || "Online"}
            </div>
            {data.deadline && (
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-sky-400" />
                Deadline: {formatDeadline(data.deadline)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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
                      {details.pacing?.replace("_", " ") || "Self-paced"}
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
                    <p className="font-semibold capitalize">{details.degree}</p>
                  </div>
                )}
                {details.stipend && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                    <DollarSign size={20} className="text-green-600" />
                    <p className="font-semibold">{details.stipend}</p>
                  </div>
                )}
                {details.duration && (
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-3">
                    <Clock size={20} className="text-orange-600" />
                    <p className="font-semibold">{details.duration}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100">
              Overview
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-300 text-lg">
              {data.description}
            </p>
          </div>

          {/* Full Content */}
          {data.content && (
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100">
                Details
              </h3>
              <div className="whitespace-pre-wrap leading-relaxed text-gray-600 dark:text-gray-300">
                {data.content}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="sticky top-24 shadow-2xl border-none overflow-hidden bg-white dark:bg-gray-900 rounded-[32px]">
            <div className={`h-3 w-full ${expired ? "bg-gray-400" : "bg-gradient-to-r from-sky-400 to-blue-600"}`} />
            <CardContent className="p-8 space-y-8">
              <div className="text-center">
                <h3 className="font-black text-2xl mb-2 text-gray-900 dark:text-gray-50">
                  {expired ? "Expired" : "Apply Now"}
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {expired
                    ? "This opportunity is no longer accepting applications"
                    : "Verify all details on the official site"}
                </p>
              </div>

              {/* Deadline Status */}
              {deadlineStatus && !expired && (
                <div className={`p-4 rounded-xl ${deadlineStatus.bgColor} text-center`}>
                  <p className={`font-bold ${deadlineStatus.color}`}>
                    {deadlineStatus.label}
                  </p>
                </div>
              )}

              {expired ? (
                <Link href={getSimilarPath()}>
                  <Button className="w-full h-14 text-lg font-bold gap-2 bg-gray-600 hover:bg-gray-700 shadow-lg rounded-2xl">
                    Explore Similar Opportunities
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full h-14 text-lg font-bold gap-2 bg-sky-600 hover:bg-sky-700 shadow-lg rounded-2xl"
                  asChild
                >
                  <Link href={data.application_url || "#"} target="_blank">
                    Official Link <ExternalLink size={20} />
                  </Link>
                </Button>
              )}

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

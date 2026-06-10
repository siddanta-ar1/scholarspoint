"use client";

import React, { useState } from "react";
import { Opportunity } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Briefcase,
  Users,
  BookOpen,
  Tag,
  Trophy,
  Monitor,
  Languages,
} from "lucide-react";
import { isExpired, formatDeadline, getDeadlineStatus } from "@/lib/opportunityHelpers";

function StatCard({ bg, iconBg, iconColor, icon, label, value, capitalize }: {
  bg: string; iconBg: string; iconColor: string; icon: React.ReactNode;
  label: string; value: string; capitalize?: boolean;
}) {
  return (
    <div className={`${bg} p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-transparent flex items-center gap-3 sm:gap-4`}>
      <div className={`p-2 sm:p-3 ${iconBg} rounded-xl ${iconColor} flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-bold truncate">{label}</p>
        <p className={`font-bold truncate ${capitalize ? "capitalize" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

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
    <article className="max-w-5xl mx-auto pb-24 lg:pb-20 animate-in fade-in duration-500 px-4">
      {/* Expired Banner */}
      {expired && (
        <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
          <div className="flex items-start gap-3 sm:gap-4">
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
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[400px] rounded-2xl sm:rounded-[32px] md:rounded-[40px] overflow-hidden mb-6 sm:mb-10 md:mb-12 group shadow-2xl">
        <Image
          src={data.image_url || "/placeholder.png"}
          alt={data.title}
          fill
          className={`object-cover transition-transform duration-700 ${!expired && "group-hover:scale-105"
            } ${expired && "grayscale"}`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-10 text-white w-full">
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
          <h1 className="text-xl sm:text-3xl md:text-5xl font-black leading-tight mb-2 sm:mb-4">
            {data.title}
          </h1>
          <div className="hidden sm:flex flex-wrap gap-4 md:gap-6 text-xs sm:text-sm font-medium text-gray-200">
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {data.type === "online_course" && (
              <>
                <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Zap size={20} />} label="PACING" value={(details.pacing?.replace("_", " ") || "Self-paced")} />
                <StatCard bg="bg-amber-50" iconBg="bg-amber-100" iconColor="text-amber-600" icon={<Award size={20} />} label="CERTIFICATE" value={details.certificate ? "Verified" : "Not Included"} />
                {details.duration && <StatCard bg="bg-orange-50" iconBg="bg-orange-100" iconColor="text-orange-600" icon={<Clock size={20} />} label="DURATION" value={details.duration} />}
                {details.platform && <StatCard bg="bg-purple-50" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<Monitor size={20} />} label="PLATFORM" value={details.platform} />}
                {details.language && <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Languages size={20} />} label="LANGUAGE" value={details.language} />}
                {details.difficulty && <StatCard bg="bg-green-50" iconBg="bg-green-100" iconColor="text-green-600" icon={<Zap size={20} />} label="DIFFICULTY" value={details.difficulty} capitalize />}
              </>
            )}
            {data.type === "scholarship" && (
              <>
                {details.funding_type && <StatCard bg="bg-sky-50" iconBg="bg-sky-100" iconColor="text-sky-600" icon={<DollarSign size={20} />} label="FUNDING" value={details.funding_type.replace(/_/g, " ")} capitalize />}
                {details.degree_level && <StatCard bg="bg-purple-50" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<GraduationCap size={20} />} label="DEGREE" value={details.degree_level} capitalize />}
                {details.gpa_requirement && <StatCard bg="bg-green-50" iconBg="bg-green-100" iconColor="text-green-600" icon={<Award size={20} />} label="MIN GPA" value={details.gpa_requirement} />}
                {details.field_of_study && <StatCard bg="bg-amber-50" iconBg="bg-amber-100" iconColor="text-amber-600" icon={<BookOpen size={20} />} label="FIELD OF STUDY" value={details.field_of_study} />}
              </>
            )}
            {data.type === "internship" && (
              <>
                {details.stipend && <StatCard bg="bg-green-50" iconBg="bg-green-100" iconColor="text-green-600" icon={<DollarSign size={20} />} label="STIPEND" value={details.stipend} />}
                {details.duration && <StatCard bg="bg-orange-50" iconBg="bg-orange-100" iconColor="text-orange-600" icon={<Clock size={20} />} label="DURATION" value={details.duration} />}
                {details.work_type && <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Monitor size={20} />} label="WORK TYPE" value={details.work_type} capitalize />}
                {details.department && <StatCard bg="bg-purple-50" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<Briefcase size={20} />} label="DEPARTMENT" value={details.department} />}
              </>
            )}
            {data.type === "fellowship" && (
              <>
                {details.fellowship_value && <StatCard bg="bg-sky-50" iconBg="bg-sky-100" iconColor="text-sky-600" icon={<DollarSign size={20} />} label="FELLOWSHIP VALUE" value={details.fellowship_value} />}
                {details.duration && <StatCard bg="bg-orange-50" iconBg="bg-orange-100" iconColor="text-orange-600" icon={<Clock size={20} />} label="DURATION" value={details.duration} />}
                {details.focus_area && <StatCard bg="bg-purple-50" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<BookOpen size={20} />} label="FOCUS AREA" value={details.focus_area} />}
                {details.eligibility && <StatCard bg="bg-green-50" iconBg="bg-green-100" iconColor="text-green-600" icon={<Award size={20} />} label="ELIGIBILITY" value={details.eligibility} />}
              </>
            )}
            {data.type === "competition" && (
              <>
                {(details.prizes) && <StatCard bg="bg-amber-50" iconBg="bg-amber-100" iconColor="text-amber-600" icon={<Trophy size={20} />} label="PRIZES" value={Array.isArray(details.prizes) ? details.prizes.join(", ") : details.prizes} />}
                {details.entry_fee && <StatCard bg="bg-sky-50" iconBg="bg-sky-100" iconColor="text-sky-600" icon={<DollarSign size={20} />} label="ENTRY FEE" value={details.entry_fee} />}
                {details.team_size && <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Users size={20} />} label="TEAM SIZE" value={details.team_size} />}
                {details.category && <StatCard bg="bg-purple-50" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<Tag size={20} />} label="CATEGORY" value={details.category} />}
              </>
            )}
            {(data.type === "conference" || data.type === "workshop") && (
              <>
                {details.registration_fee && <StatCard bg="bg-sky-50" iconBg="bg-sky-100" iconColor="text-sky-600" icon={<DollarSign size={20} />} label="REGISTRATION FEE" value={details.registration_fee} />}
                {details.format && <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Monitor size={20} />} label="FORMAT" value={details.format} capitalize />}
                {details.topics && <StatCard bg="bg-purple-50" iconBg="bg-purple-100" iconColor="text-purple-600" icon={<BookOpen size={20} />} label="TOPICS" value={details.topics} />}
                {details.target_audience && <StatCard bg="bg-green-50" iconBg="bg-green-100" iconColor="text-green-600" icon={<Users size={20} />} label="TARGET AUDIENCE" value={details.target_audience} />}
              </>
            )}
            {data.type === "exchange_program" && (
              <>
                {details.duration && <StatCard bg="bg-orange-50" iconBg="bg-orange-100" iconColor="text-orange-600" icon={<Clock size={20} />} label="DURATION" value={details.duration} />}
                {details.funding_coverage && <StatCard bg="bg-sky-50" iconBg="bg-sky-100" iconColor="text-sky-600" icon={<DollarSign size={20} />} label="FUNDING COVERAGE" value={details.funding_coverage} />}
                {details.language_requirement && <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Languages size={20} />} label="LANGUAGE" value={details.language_requirement} />}
                {details.age_limit && <StatCard bg="bg-amber-50" iconBg="bg-amber-100" iconColor="text-amber-600" icon={<Users size={20} />} label="AGE LIMIT" value={details.age_limit} />}
              </>
            )}
            {data.type === "job" && (
              <>
                {details.salary_range && <StatCard bg="bg-green-50" iconBg="bg-green-100" iconColor="text-green-600" icon={<DollarSign size={20} />} label="SALARY" value={details.salary_range} />}
                {details.employment_type && <StatCard bg="bg-sky-50" iconBg="bg-sky-100" iconColor="text-sky-600" icon={<Briefcase size={20} />} label="EMPLOYMENT" value={details.employment_type.replace(/-/g, " ")} capitalize />}
                {details.experience_required && <StatCard bg="bg-amber-50" iconBg="bg-amber-100" iconColor="text-amber-600" icon={<Award size={20} />} label="EXPERIENCE" value={details.experience_required} />}
                {details.work_type && <StatCard bg="bg-blue-50" iconBg="bg-blue-100" iconColor="text-blue-600" icon={<Monitor size={20} />} label="WORK TYPE" value={details.work_type} capitalize />}
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none prose-sky prose-img:rounded-3xl">
            <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100 not-prose">
              Overview
            </h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.description || ""}
            </ReactMarkdown>
          </div>

          {/* Full Content */}
          {data.content && (
            <div className="prose dark:prose-invert max-w-none prose-sky prose-img:rounded-3xl mt-12">
              <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100 not-prose">
                Details
              </h3>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Expert Insights - only shown when unique content exists */}
          {(data.who_should_apply || data.scholars_point_tips) && (
            <div className="bg-sky-50 dark:bg-sky-950/30 p-8 rounded-3xl border border-sky-100 dark:border-sky-900 mt-12 mb-8">
              <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Zap className="text-amber-500" size={28} />
                ScholarsPoint Expert Insights
              </h3>
              
              <div className="space-y-6">
                {data.who_should_apply && (
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-2">
                      <Check className="text-green-500" size={20} /> Who Should Apply
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {data.who_should_apply}
                    </p>
                  </div>
                )}

                {data.scholars_point_tips && (
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-amber-500" size={20} /> ScholarsPoint Application Tips
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {data.scholars_point_tips}
                    </p>
                  </div>
                )}

                {data.visa_difficulty && (
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-2">
                      <Globe className="text-blue-500" size={20} /> Visa Difficulty Rating
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                      <span className="inline-flex items-center justify-center px-4 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold rounded-full text-sm w-fit">
                        {data.visa_difficulty}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Check visa requirements early for {data.country || 'this program'}. Book embassy appointments immediately after acceptance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar — hidden on mobile, shown lg+ */}
        <aside className="hidden lg:block space-y-6">
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
      {/* Mobile sticky apply bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {deadlineStatus && !expired && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${deadlineStatus.bgColor} ${deadlineStatus.color}`}>
              {deadlineStatus.label}
            </span>
          )}
          {expired ? (
            <Link href={getSimilarPath()} className="flex-1">
              <Button className="w-full h-11 font-bold bg-gray-600 hover:bg-gray-700 rounded-xl">
                Explore Similar Opportunities
              </Button>
            </Link>
          ) : (
            <Button className="flex-1 h-11 font-bold bg-sky-600 hover:bg-sky-700 rounded-xl gap-2" asChild>
              <Link href={data.application_url || "#"} target="_blank">
                Apply Now <ExternalLink size={16} />
              </Link>
            </Button>
          )}
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl flex-shrink-0" onClick={handleShare}>
            {copied ? <Check size={16} /> : <Share2 size={16} />}
          </Button>
        </div>
      </div>
    </article>
  );
}

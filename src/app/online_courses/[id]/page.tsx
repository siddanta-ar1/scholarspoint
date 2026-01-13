"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  BookOpen,
  University,
  Zap,
  Award,
  Globe,
  ArrowLeft,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OnlineCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      // Updated query to use the unified table
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setCourse(data);
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={40} />
      </div>
    );

  if (!course || !course.is_active)
    return (
      <div className="text-center py-32 space-y-4">
        <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter">
          Course Unavailable
        </h2>
        <Button asChild variant="outline" className="rounded-xl font-bold">
          <Link href="/online_courses">Browse Available Courses</Link>
        </Button>
      </div>
    );

  const details = course.details || {};

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      <Link
        href="/online_courses"
        className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-70"
      >
        <ArrowLeft size={20} /> Back to Courses
      </Link>

      {/* Hero Header Section */}
      <section className="relative w-full h-[450px] rounded-[40px] overflow-hidden shadow-2xl group">
        <Image
          src={course.image_url || "/course-placeholder.jpg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
          <Badge className="mb-4 bg-sky-500 text-white border-none uppercase text-xs px-3 py-1 font-bold">
            Verified Program
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tighter">
            {course.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-200 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <University className="text-sky-400" size={18} />{" "}
              {course.organization}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-sky-400" size={18} />{" "}
              {details.pacing?.replace("_", " ")}
            </div>
            <div className="flex items-center gap-2">
              <Award className="text-sky-400" size={18} />{" "}
              {details.certificate ? "Certificate Included" : "Audit Only"}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-black mb-6 text-gray-900 flex items-center gap-3 tracking-tighter uppercase">
              <BookOpen className="text-sky-600" /> Syllabus Overview
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
              {course.description}
            </p>
          </section>

          {details.subjects && (
            <section className="space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-widest text-gray-400">
                Core Modules
              </h3>
              <div className="flex flex-wrap gap-2">
                {details.subjects.map((sub: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-sky-50 text-sky-700 border-none px-4 py-2 rounded-xl font-bold"
                  >
                    {sub}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 bg-white border border-sky-100 rounded-[32px] p-8 shadow-2xl">
            <div className="text-center mb-8">
              <p className="text-xs font-black text-sky-600 uppercase tracking-[0.2em] mb-2">
                Enrollment Open
              </p>
              <h3 className="text-3xl font-black text-gray-900 capitalize tracking-tighter">
                {details.cost_type} Access
              </h3>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full h-16 text-lg font-bold bg-sky-600 hover:bg-sky-700 shadow-xl transition-all hover:-translate-y-1 rounded-2xl"
            >
              <a href={course.application_url} target="_blank">
                Enroll Today <Globe className="ml-2" size={18} />
              </a>
            </Button>

            <div className="mt-10 space-y-5">
              {[
                "Global Recognition",
                "Lifetime Access",
                "Verified Credentials",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-tighter"
                >
                  <CheckCircle2 className="text-green-500" size={18} /> {text}
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-8 text-gray-400 gap-2 hover:text-sky-600 transition-colors font-bold uppercase text-xs tracking-widest"
            >
              <Share2 size={16} /> Share Opportunity
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

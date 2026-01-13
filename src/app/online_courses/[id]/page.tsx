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
  BarChart,
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
      const { data, error } = await supabase
        .from("online_courses")
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
        <Loader2 className="animate-spin text-sky-600" />
      </div>
    );
  if (!course || !course.is_active)
    return (
      <div className="text-center py-20 font-bold text-red-600">
        Course Not Available
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      {/* 1. Header Hero */}
      <section className="relative w-full h-[400px] rounded-[40px] overflow-hidden shadow-2xl group">
        <Image
          src={course.image_url || "/course-placeholder.jpg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
          <Badge className="mb-4 bg-sky-500 text-white border-none uppercase text-xs px-3 py-1">
            Verified Course
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            {course.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-200">
            <div className="flex items-center gap-2">
              <University className="text-sky-400" size={18} />{" "}
              {course.institution}
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-sky-400" size={18} />{" "}
              {course.pacing?.replace("_", " ")}
            </div>
            <div className="flex items-center gap-2">
              <Award className="text-sky-400" size={18} />{" "}
              {course.certificate_available
                ? "Certificate Included"
                : "No Certificate"}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Detailed Content */}
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <BookOpen className="text-sky-600" /> Course Overview
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </p>
          </section>

          {course.subjects && (
            <section className="space-y-4">
              <h3 className="text-xl font-bold">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {course.subjects.map((sub: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-sky-50 text-sky-700 hover:bg-sky-100 border-none px-4 py-1.5 rounded-lg font-semibold"
                  >
                    {sub}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 2. Sidebar CTA */}
        <aside className="space-y-6">
          <div className="sticky top-24 bg-white border border-sky-100 rounded-[32px] p-8 shadow-xl">
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-sky-600 uppercase tracking-widest mb-1">
                Enrollment Status
              </p>
              <h3 className="text-2xl font-black text-gray-900 capitalize">
                {course.cost_type} Course
              </h3>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full h-14 text-lg bg-sky-600 hover:bg-sky-700 shadow-lg transition-transform hover:-translate-y-1 rounded-2xl"
            >
              <a href={course.enrollment_url} target="_blank">
                Start Learning Now <Globe className="ml-2" size={18} />
              </a>
            </Button>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={18} /> Industry
                Recognized
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={18} /> Self-Paced
                Learning
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={18} /> Direct
                University Link
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-6 text-gray-400 gap-2 hover:text-sky-600 transition-colors"
            >
              <Share2 size={16} /> Share Course
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Zap, Award, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function OnlineCoursesPage() {
  // Fetch from the UNIFIED table with the correct type
  const { data: courses } = await supabase
    .from("opportunities")
    .select("*")
    .eq("type", "online_course")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="container mx-auto px-4 py-16 space-y-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Link>
      </div>
      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl">
          <BookOpen size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900">
          Upskill with <span className="text-blue-600">Online Courses</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Verified certifications from Google, Harvard, and Microsoft. Learn at
          your own pace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses?.map((course) => {
          const details = course.details || {};
          return (
            <Link
              href={`/online_courses/${course.id}`}
              key={course.id}
              className="group"
            >
              <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all rounded-[32px] overflow-hidden bg-white">
                <div className="relative h-56 w-full">
                  <Image
                    src={course.image_url || "/course-placeholder.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 text-blue-700 backdrop-blur-md border-none font-bold uppercase text-[10px]">
                      {details.cost_type || "Verified"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    {course.organization}
                  </p>
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                    <div className="flex items-center gap-1.5">
                      <Zap size={14} />{" "}
                      {details.pacing?.replace("_", " ") || "Self Paced"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award size={14} />{" "}
                      {details.certificate ? "Certificate" : "Course"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

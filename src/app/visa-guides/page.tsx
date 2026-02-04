import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, PlaneTakeoff, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function VisaGuidesPage() {
  const { data: guides } = await supabase
    .from("visa_guides")
    .select("*")
    .order("country");

  return (
    <main className="container mx-auto px-4 py-16 space-y-12">
      <div className="bg-sky-600 rounded-[32px] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Student <span className="text-sky-300 underline">Visa Guides</span>
          </h1>
          <p className="text-lg opacity-90">
            Step-by-step documentation and processing guides for the world's top
            study destinations.
          </p>
        </div>
        <PlaneTakeoff className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-[-15deg]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {guides?.map((guide) => (
          <Link href={`/visa-guides/${guide.id}`} key={guide.id}>
            <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-3xl">
              <div className="h-48 relative">
                <Image
                  src={guide.image_url || "/visa-bg.jpg"}
                  alt={guide.country}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {guide.country}
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">
                  <ShieldCheck size={14} /> Official Guide
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {guide.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

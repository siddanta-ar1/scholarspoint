'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { 
  Loader2, 
 
  Clock, 
  Calendar, 
  Award, 
  GraduationCap,
  FileText,
  CheckCircle,
  Sparkles,
  BookOpen,
  Building,
  Globe,
  Users,
  ArrowLeft
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

// --- 1. Comprehensive TypeScript Interfaces for Dynamic Data ---
interface Content {
  benefits?: string[];
  eligibility?: string | Record<string, string | string[]>;
  degree_levels?: string[];
  application_process?: string[];
  eligible_countries?: string[];
  scholarship_duration?: Record<string, string>;
  fields_of_study?: string[];
  requirements?: string[];
  scholarship_types?: Record<string, { benefits: string[], eligible_for: string }>;
  financial_coverage?: string;
  advice?: Record<string, string | string[]>;
  application_links?: Record<string, string>;
}

interface Scholarship {
  id: string;
  title: string;
  description: string;
  organization: string;
  deadline: string | null;
  application_url: string;
  country: string;
  field_of_study: string | null;
  student_level: string;
  image_url?: string;
  is_active: boolean;
  content: Content;
}

// --- 2. Helper Components for a Cleaner, Better Design ---
const SectionCard = ({ title, icon, children }: { title: string, icon: ReactNode, children: ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
      {icon} {title}
    </h2>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value }: { icon: ReactNode, label: string, value: string | null }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-teal-600 mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-slate-800">{label}</p>
      <p className="text-slate-600">{value || 'Not Specified'}</p>
    </div>
  </div>
);

const StyledListItem = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3">
    <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0"/>
    <span className="text-slate-700">{children}</span>
  </li>
);

// --- Main Component ---
export default function ScholarshipDetailPage() {
  const { id } = useParams()
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholarship = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('Scholarship not found');
        setLoading(false);
        return;
      }

      // --- 3. Safely Parse the 'content' JSON String ---
      let parsedContent: Content = {};
      try {
        if (data.content && typeof data.content === 'string') {
          parsedContent = JSON.parse(data.content);
        }
      } catch (e) {
        console.error("Failed to parse content JSON:", e);
      }
      
      const processedData: Scholarship = { ...data, content: parsedContent };
      setScholarship(processedData);
      setLoading(false);
    }
    fetchScholarship();
  }, [id]);
  
  const isDeadlinePassed = () => {
    if (!scholarship || !scholarship.deadline) return !scholarship?.is_active;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(scholarship.deadline) < today || !scholarship.is_active;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Scholarship Not Found</h1>
        <p className="text-lg text-slate-700 mb-6">The link may be broken or the scholarship may have been removed.</p>
        <Button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white" asChild>
          <Link href="/scholarships">View Active Scholarships</Link>
        </Button>
      </div>
    );
  }

  if (isDeadlinePassed()) {
     return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">This Scholarship Has Expired</h1>
        <p className="text-lg text-slate-700 mb-6">The application deadline for {scholarship.title} has passed.</p>
        <Button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white" asChild>
          <Link href="/scholarships">View Active Scholarships</Link>
        </Button>
      </div>
    );
  }

  // Combine fields of study from both sources for complete data
  const allFieldsOfStudy = [
    ...(scholarship.field_of_study ? scholarship.field_of_study.split(',') : []),
    ...(scholarship.content.fields_of_study || [])
  ].filter(field => field.trim() !== '');

  return (
    <main className="bg-slate-50 py-10">
      <nav className="flex items-center justify-between mb-4">
                  <Link href="/scholarships" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft size={20} /> Back
                  </Link>
                
                </nav>
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {scholarship.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image src={scholarship.image_url} alt={scholarship.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-2">
          <Badge variant="outline" className="border-teal-300 text-teal-700">{scholarship.country}</Badge>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">{scholarship.title}</h1>
          <p className="text-slate-500 text-lg flex items-center gap-2"><Building size={18}/> {scholarship.organization}</p>
        </div>
        
        <SectionCard title="Key Details" icon={<Award className="text-teal-700" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InfoItem icon={<Calendar />} label="Application Deadline" value={scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
            <InfoItem icon={<GraduationCap />} label="Degree Levels" value={scholarship.content.degree_levels?.join(', ') || scholarship.student_level} />
            <InfoItem icon={<Globe />} label="Location" value={scholarship.country} />
            <InfoItem icon={<Clock />} label="Duration" value={Object.values(scholarship.content.scholarship_duration || {}).join(' / ') || 'Varies'} />
            <InfoItem icon={<Sparkles />} label="Financial Coverage" value={scholarship.content.financial_coverage || 'Varies'} />
          </div>
        </SectionCard>
        
        <SectionCard title="Description" icon={<FileText className="text-teal-700" />}>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{scholarship.description}</p>
        </SectionCard>
        
        {allFieldsOfStudy.length > 0 && (
            <SectionCard title="Fields of Study" icon={<BookOpen className="text-teal-700" />}>
                <div className="flex flex-wrap gap-2">
                    {allFieldsOfStudy.map((field, i) => (
                        <Badge key={i} className="bg-teal-100 text-teal-800 hover:bg-teal-200">{field.trim()}</Badge>
                    ))}
                </div>
            </SectionCard>
        )}
        
        {/* --- 4. Dynamic Rendering for All 'content' Variations --- */}
        
        {scholarship.content.benefits && (
          <SectionCard title="Benefits" icon={<Sparkles className="text-teal-700" />}>
            <ul className="space-y-3">{scholarship.content.benefits.map((b, i) => <StyledListItem key={i}>{b}</StyledListItem>)}</ul>
          </SectionCard>
        )}

        {scholarship.content.eligibility && (
          <SectionCard title="Eligibility Criteria" icon={<Users className="text-teal-700" />}>
            {typeof scholarship.content.eligibility === 'string' ? (
              <p className="text-slate-700 leading-relaxed">{scholarship.content.eligibility}</p>
            ) : (
              <ul className="space-y-3">
                {Object.entries(scholarship.content.eligibility).map(([key, value]) => (
                  <li key={key} className="text-slate-700">
                    <strong className="font-semibold text-slate-800">{key.replace(/_/g, ' ')}:</strong>{' '}
                    {Array.isArray(value) ? value.join(', ') : value}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        )}

        {scholarship.content.requirements && (
          <SectionCard title="Required Documents" icon={<FileText className="text-teal-700" />}>
            <ul className="space-y-3">{scholarship.content.requirements.map((r, i) => <StyledListItem key={i}>{r}</StyledListItem>)}</ul>
          </SectionCard>
        )}
        
        {scholarship.content.scholarship_types && (
          <SectionCard title="Scholarship Types" icon={<Award className="text-teal-700" />}>
            <div className="space-y-6">
              {Object.entries(scholarship.content.scholarship_types).map(([name, details]) => (
                <div key={name} className="border border-slate-200 p-4 rounded-md">
                  <h3 className="font-bold text-lg text-teal-800">{name}</h3>
                  <p className="text-sm text-slate-500 mb-3">Eligible For: {details.eligible_for}</p>
                  <ul className="space-y-2">{details.benefits.map((b, i) => <StyledListItem key={i}>{b}</StyledListItem>)}</ul>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {scholarship.content.application_process && (
          <SectionCard title="Application Process" icon={<Clock className="text-teal-700" />}>
            <ul className="space-y-3">{scholarship.content.application_process.map((p, i) => <StyledListItem key={i}>{p}</StyledListItem>)}</ul>
          </SectionCard>
        )}

        <div className="text-center pt-6">
          <Button asChild size="lg" className="w-full sm:w-auto font-bold text-lg bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-transform hover:scale-105">
            <a href={scholarship.application_url} target="_blank" rel="noopener noreferrer">Apply Now</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
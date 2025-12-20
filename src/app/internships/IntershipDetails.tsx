'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Loader2, 
  MapPin, 
  Clock, 
  Calendar, 
  DollarSign, 
  GraduationCap,
  FileText,
  CheckCircle,
  Sparkles,
  Building,
  ArrowLeft
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Metadata {
  benefits?: string[]
  features?: string[]
  research_fields?: string[]
  required_documents?: string[]
  application_process?: string
  note?: string
  coverage?: string
  job_level?: string
}

interface Internship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  deadline: string | null
  field_of_study: string
  student_level: string
  country: string
  description: string
  image_url?: string
  requirements: string[]
  application_url: string
  is_active: boolean
  metadata: Metadata
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-slate-800">{label}</p>
      <p className="text-slate-600">{value}</p>
    </div>
  </div>
);

export default function InternshipDetail() {
  const { id } = useParams()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [deadlinePassed, setDeadlinePassed] = useState(false)

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Internship not found.')
        setLoading(false)
        return
      }

      let parsedMetadata = {};
      try {
        if (data.metadata && typeof data.metadata === 'string') {
          parsedMetadata = JSON.parse(data.metadata);
        } else if (data.metadata) {
          parsedMetadata = data.metadata;
        }
      } catch (e) {
        console.error("Failed to parse metadata:", e);
      }

      const processedData = { ...data, metadata: parsedMetadata };
      setInternship(processedData);
      
      let isExpired = !data.is_active;
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadlineDate < today) isExpired = true;
      }
      setDeadlinePassed(isExpired);
      setLoading(false)
    }
    if (id) fetchInternship()
  }, [id])

  // --- 1. PROFESSIONAL STRUCTURED DATA (JSON-LD) ---
  const jsonLd = internship ? {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": internship.title,
    "description": internship.description,
    "hiringOrganization": {
      "@type": "Organization",
      "name": internship.company,
      "logo": internship.image_url || ""
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": internship.location,
        "addressCountry": internship.country
      }
    },
    "datePosted": new Date().toISOString().split('T')[0], // Falls back to today
    "validThrough": internship.deadline,
    "employmentType": "INTERN",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": internship.stipend,
        "unitText": "MONTH"
      }
    }
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    )
  }

  if (!internship || deadlinePassed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          {internship ? "This Internship Has Expired" : "Internship Not Found"}
        </h1>
        <p className="text-lg text-slate-700 mb-6">
          {internship 
            ? `The deadline for ${internship.title} at ${internship.company} has passed.`
            : 'The internship you are looking for does not exist.'
          }
        </p>
        <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link href="/internships">View Active Internships</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="bg-slate-50 py-10">
        <nav className="flex items-center justify-between mb-4">
                  <Link href="/internships" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft size={20} /> Back
                  </Link>
                
                </nav>
      {/* 2. INJECT JSON-LD FOR GOOGLE SITELINKS */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {internship.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={internship.image_url}
              alt={internship.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-2">
          <Badge variant="outline" className="border-blue-300 text-blue-700">{internship.country}</Badge>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">{internship.title}</h1>
          <p className="text-slate-500 text-lg flex items-center gap-2"><Building size={18}/> {internship.company}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Key Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <InfoItem icon={<Clock size={20} />} label="Duration" value={internship.duration} />
            <InfoItem icon={<DollarSign size={20} />} label="Stipend / Benefits" value={internship.stipend} />
            <InfoItem icon={<Calendar size={20} />} label="Application Deadline" value={internship.deadline ? new Date(internship.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
            <InfoItem icon={<MapPin size={20} />} label="Location" value={internship.location} />
            <InfoItem icon={<GraduationCap size={20} />} label="Student Level" value={internship.student_level.split(',').map(s => s.trim()).join(', ')} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{internship.description}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Fields of Study</h2>
            <div className="flex flex-wrap gap-2">
              {internship.field_of_study.split(',').map((field, i) => (
                <Badge key={i} className="bg-blue-100 text-blue-800 hover:bg-blue-200">{field.trim()}</Badge>
              ))}
            </div>
        </div>

        {internship.requirements && internship.requirements.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">✅ Requirements</h2>
            <ul className="space-y-3">
              {internship.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0"/>
                  <span className="text-slate-700">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {internship.metadata.benefits && internship.metadata.benefits.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">✨ Benefits & Perks</h2>
            <ul className="space-y-3">
              {internship.metadata.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Sparkles className="text-yellow-500 w-5 h-5 mt-1 flex-shrink-0"/>
                  <span className="text-slate-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {internship.metadata.features && internship.metadata.features.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🚀 Program Features</h2>
            <ul className="space-y-3">
              {internship.metadata.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                   <Sparkles className="text-purple-500 w-5 h-5 mt-1 flex-shrink-0"/>
                  <span className="text-slate-700">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {internship.metadata.research_fields && internship.metadata.research_fields.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🔬 Research Fields</h2>
            <div className="flex flex-wrap gap-2">
                {internship.metadata.research_fields.map((field, i) => (
                  <Badge key={i} className="bg-slate-100 text-slate-800 hover:bg-slate-200">{field.trim()}</Badge>
                ))}
            </div>
          </div>
        )}

        {internship.metadata.required_documents && internship.metadata.required_documents.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">📄 Required Documents</h2>
            <ul className="space-y-3">
              {internship.metadata.required_documents.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FileText className="text-blue-500 w-5 h-5 mt-1 flex-shrink-0"/>
                  <span className="text-slate-700">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {internship.metadata.application_process && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Application Process</h2>
            <p className="text-slate-700 leading-relaxed">{internship.metadata.application_process}</p>
          </div>
        )}
        
        {internship.metadata.note && (
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{internship.metadata.note}</p>
                </div>
              </div>
          </div>
        )}

        <div className="text-center pt-6">
          <Button asChild size="lg" className="w-full sm:w-auto font-bold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform hover:scale-105">
            <a href={internship.application_url} target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}
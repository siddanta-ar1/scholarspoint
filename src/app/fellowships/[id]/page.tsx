'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Loader2, 
  DollarSign, 
  Clock, 
  Calendar, 
  GraduationCap, 
  CheckCircle2,
  MapPin,
  BookOpen,
  ClipboardList,
  Globe
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Fellowship = {
  id: string
  title: string
  organization: string
  country: string
  amount: string
  duration: string
  deadline: string | null
  student_level: string
  field_of_study: string
  description: string
  eligibility: string
  application_url: string
  is_active: boolean
  image_url?: string
  requirements: string[] | null // Allow null
  focus_areas: string[] | null // Allow null
  documents: string[] | null // Allow null
  countries: string[] | null // Allow null
  selection_criteria: string[] | null // Allow null
  metadata: {
    benefits?: string[]
  }
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-primary-dark mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-gray-700 capitalize">{value}</p>
    </div>
  </div>
);

export default function FellowshipDetail() {
  const { id } = useParams()
  const [fellowship, setFellowship] = useState<Fellowship | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchFellowship = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('fellowships')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to fetch fellowship details.')
        setLoading(false)
        return
      }
      
      if (data) {
        setFellowship(data);

        let expired = !data.is_active;
        if (data.deadline) {
          const deadlineDate = new Date(data.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          if (deadlineDate < today) {
            expired = true;
          }
        }
        setIsExpired(expired);
      }
      
      setLoading(false);
    }

    fetchFellowship()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-background">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  if (!fellowship) {
    return (
      <div className="text-center py-10 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Fellowship Not Found</h2>
        <p className="text-gray-600 mt-2">The fellowship you are looking for does not exist or has been removed.</p>
         <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/fellowships">Browse Fellowships</Link>
        </Button>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center bg-background min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">This Fellowship Has Expired</h1>
        <p className="text-lg text-gray-700 mb-6">
          The application deadline for <span className="font-semibold">{fellowship.title}</span> has passed.
        </p>
        <p className="text-gray-600">
          Please check out our other opportunities.
        </p>
        <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/fellowships">View Active Fellowships</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10 bg-background text-gray-800">
      {/* --- Header Section --- */}
      <section className="space-y-4">
        {fellowship.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={fellowship.image_url}
              alt={fellowship.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">{fellowship.title}</h1>
          <p className="text-muted-foreground text-lg mt-2">{fellowship.organization}</p>
        </div>
      </section>

      {/* --- Key Details Section --- */}
      <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">Key Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InfoItem icon={<DollarSign size={20} />} label="Amount" value={fellowship.amount} />
          <InfoItem icon={<Clock size={20} />} label="Duration" value={fellowship.duration} />
          <InfoItem icon={<Calendar size={20} />} label="Deadline" value={fellowship.deadline ? new Date(fellowship.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Varies'} />
          <InfoItem icon={<GraduationCap size={20} />} label="Level" value={fellowship.student_level} />
          <InfoItem icon={<MapPin size={20} />} label="Location" value={fellowship.country} />
          <InfoItem icon={<BookOpen size={20} />} label="Field of Study" value={fellowship.field_of_study} />
        </div>
      </section>

      {/* --- Detailed Information Sections --- */}
      <div className="space-y-8">
        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-primary-dark" /> Description
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {fellowship.description}
          </div>
        </section>

        {fellowship.metadata?.benefits && fellowship.metadata.benefits.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={24} className="text-primary-dark" /> Key Benefits
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fellowship.metadata.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                    <span className="capitalize">{benefit.replace(/_/g, ' ')}</span>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {fellowship.focus_areas && fellowship.focus_areas.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <BookOpen size={24} className="text-primary-dark" /> Focus Areas
            </h2>
            <div className="flex flex-wrap gap-2">
                {fellowship.focus_areas.map((area, idx) => <Badge key={idx} variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">{area}</Badge>)}
            </div>
          </section>
        )}
        
        {/* FIX APPLIED HERE */}
        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-primary-dark" /> Eligibility & Requirements
          </h2>
          {fellowship.eligibility && (
            <p className="text-gray-700 leading-relaxed mb-4">{fellowship.eligibility}</p>
          )}
          {fellowship.requirements && fellowship.requirements.length > 0 && (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {fellowship.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
            </ul>
          )}
        </section>

        {fellowship.selection_criteria && fellowship.selection_criteria.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <ClipboardList size={24} className="text-primary-dark" /> Selection Criteria
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {fellowship.selection_criteria.map((criterion, idx) => <li key={idx}>{criterion}</li>)}
            </ul>
          </section>
        )}
        
        {fellowship.countries && fellowship.countries.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Globe size={24} className="text-primary-dark" /> Eligible Countries
            </h2>
            <p className="text-gray-700">
              This fellowship is open to citizens of <strong>{fellowship.countries.length} countries</strong> globally.
              A few examples include: <span className="font-medium">{fellowship.countries.slice(0, 5).join(', ')}</span>, and many others.
              <span className="block text-sm text-gray-500 mt-2">
                Please refer to the official application link for the full list of eligible countries.
              </span>
            </p>
          </section>
        )}

        {fellowship.documents && fellowship.documents.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <ClipboardList size={24} className="text-primary-dark" /> Required Documents
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                {fellowship.documents.map((doc, idx) => <li key={idx}>{doc}</li>)}
            </ul>
          </section>
        )}
      </div>

      {/* --- Apply Button Section --- */}
      <section className="text-center pt-6 border-t border-border">
          <Button asChild size="lg" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
            <a href={fellowship.application_url} target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </Button>
      </section>
    </main>
  )
}
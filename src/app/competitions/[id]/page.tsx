'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Script from 'next/script'
import {
  Loader2,
  Trophy,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  Target,
  FileText,
  Globe,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Competition = {
  id: string
  title: string
  organization: string
  country: string
  location: string
  competition_dates: string
  deadline: string | null
  funding_type: string
  participant_level: string
  description: string
  eligibility: string
  application_url: string
  is_active: boolean
  image_url?: string
  prizes: string[]
  benefits: string[]
  focus_areas: string[]
  documents_required: string[]
}

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 text-sky-700 mt-1">{icon}</div>
    <div>
      <p className="font-bold text-gray-900 text-sm uppercase tracking-tight">{label}</p>
      <p className="text-gray-700 capitalize">{value}</p>
    </div>
  </div>
)

export default function CompetitionDetail() {
  const { id } = useParams()
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!id) return
      setLoading(true)

      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to fetch competition details.')
        setLoading(false)
        return
      }

      setCompetition(data)

      let expired = !data.is_active
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (deadlineDate < today) expired = true
      }
      setIsExpired(expired)
      setLoading(false)
    }

    fetchCompetition()
  }, [id])

  // Structured Data for Google (Event & Organization)
  const jsonLd = competition ? {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "name": competition.title,
    "description": competition.description,
    "startDate": competition.competition_dates.split(' - ')[0] || "",
    "location": {
      "@type": "Place",
      "name": competition.location,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": competition.country
      }
    },
    "image": competition.image_url,
    "offers": {
      "@type": "Offer",
      "url": competition.application_url,
      "availability": isExpired ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "validThrough": competition.deadline
    },
    "organizer": {
      "@type": "Organization",
      "name": competition.organization,
      "url": "https://scholarspoint.net"
    }
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-sky-600" />
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-red-600">Competition Not Found</h2>
        <Button asChild className="mt-6 bg-sky-600">
          <Link href="/competitions">Browse Competitions</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {jsonLd && (
        <Script
          id="competition-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-10">
        <nav className="mb-6">
          <Link href="/competitions" className="text-sky-600 font-medium flex items-center gap-2 hover:underline">
            <ArrowLeft size={18} /> Back to Competitions
          </Link>
        </nav>

        {isExpired && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8">
            <p className="text-red-700 font-bold">Registration Closed</p>
            <p className="text-red-600 text-sm">The deadline for this competition has passed.</p>
          </div>
        )}

        {/* --- Header Section --- */}
        <header className="space-y-6">
          {competition.image_url && (
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src={competition.image_url}
                alt={`${competition.title} by ${competition.organization}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {competition.title}
            </h1>
            <p className="text-sky-700 text-xl font-semibold flex items-center gap-2">
              <Globe size={20} /> {competition.organization}
            </p>
          </div>
        </header>

        {/* --- Key Details Section --- */}
        <section className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InfoItem
              icon={<Globe size={20} />}
              label="Location"
              value={`${competition.location}, ${competition.country}`}
            />
            <InfoItem
              icon={<Calendar size={20} />}
              label="Application Deadline"
              value={competition.deadline ? new Date(competition.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Flexible'}
            />
             <InfoItem
              icon={<Clock size={20} />}
              label="Event Dates"
              value={competition.competition_dates}
            />
          </div>
          <div className="space-y-6">
            <InfoItem
              icon={<Users size={20} />}
              label="Who can apply?"
              value={competition.participant_level.replace(/_/g, ' ')}
            />
            <InfoItem
              icon={<CheckCircle2 size={20} />}
              label="Funding Support"
              value={competition.funding_type.replace(/_/g, ' ')}
            />
          </div>
        </section>

        {/* --- Content Sections --- */}
        <div className="space-y-12">
          <article className="prose prose-sky prose-lg max-w-none">
            <h2 className="flex items-center gap-3 text-gray-900">
              <ClipboardList size={28} className="text-sky-600" /> Competition Overview
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {competition.description}
            </div>
          </article>

          {competition.prizes && competition.prizes.length > 0 && (
            <section className="bg-sky-50/50 p-8 rounded-2xl border border-sky-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <Trophy size={28} className="text-sky-600" /> Prizes & Recognition
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competition.prizes.map((prize, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm">
                    <Trophy className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                    <span>{prize}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {competition.benefits && competition.benefits.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <CheckCircle2 size={28} className="text-sky-600" /> Participant Benefits
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competition.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 p-2">
                    <div className="w-2 h-2 rounded-full bg-sky-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target size={28} className="text-sky-600" /> Focus Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {competition.focus_areas.map((area, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-sky-100 text-sky-700 border-none px-4 py-1">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText size={28} className="text-sky-600" /> Requirements
              </h3>
              <ul className="space-y-2">
                {competition.documents_required.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 italic">
                    <FileText className="w-4 h-4 text-gray-400" /> {doc}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="p-8 bg-gray-50 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
              <Users size={28} className="text-sky-600" /> Eligibility Criteria
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed border-l-4 border-sky-200 pl-6">
              {competition.eligibility}
            </div>
          </section>
        </div>

        {/* --- CTA Section --- */}
        <footer className="sticky bottom-6 z-10 text-center bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-gray-200 shadow-2xl">
          {!isExpired ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium">Application closes soon</p>
                <p className="font-bold text-gray-900">Don't miss this opportunity!</p>
              </div>
              <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-12 rounded-full">
                <a href={competition.application_url} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-red-600 font-bold">This competition is no longer accepting applications.</p>
          )}
        </footer>
      </main>
    </>
  )
}
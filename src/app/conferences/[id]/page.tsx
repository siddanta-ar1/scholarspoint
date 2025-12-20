'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Script from 'next/script' // For Schema injection
import {
  Loader2,
  Clock,
  Calendar,
  CheckCircle2,
  MapPin,
  Users,
  Presentation,
  Ticket,
  Bell,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Conference = {
  id: string
  title: string
  scholarship_name: string
  description: string
  country: string
  location: string
  duration: string
  conference_dates: string
  funding_type: string
  benefits: string[]
  deadline: string | null
  application_url: string
  theme: string
  target_audience: string[]
  eligibility_criteria: string
  results_notification_date: string
  image_url?: string
  is_active: boolean
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
  <div className="flex items-start gap-3 group">
    <div className="flex-shrink-0 text-sky-700 mt-1 transition-transform group-hover:scale-110">{icon}</div>
    <div>
      <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">{label}</p>
      <p className="text-gray-700">{value}</p>
    </div>
  </div>
)

export default function ConferenceDetail() {
  const { id } = useParams()
  const [conference, setConference] = useState<Conference | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchConference = async () => {
      if (!id) return
      setLoading(true)

      const { data, error } = await supabase
        .from('conferences')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to fetch conference details.')
        setLoading(false)
        return
      }

      setConference(data)

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

    fetchConference()
  }, [id])

  // Structured Data (Schema.org) for SEO Sitelinks and Rich Results
  const jsonLd = conference ? {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "name": conference.scholarship_name,
    "superEvent": {
      "@type": "Event",
      "name": conference.title
    },
    "description": conference.description,
    "image": conference.image_url,
    "startDate": conference.conference_dates.split(' - ')[0] || "",
    "location": {
      "@type": "Place",
      "name": conference.location,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": conference.country
      }
    },
    "offers": {
      "@type": "Offer",
      "url": conference.application_url,
      "price": "0",
      "priceCurrency": "USD",
      "availability": isExpired ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "validThrough": conference.deadline
    }
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-12 h-12 text-sky-600" />
      </div>
    )
  }

  if (!conference) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Conference Not Found</h2>
        <Button asChild className="mt-6 bg-sky-600">
          <Link href="/conferences">Explore Opportunities</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {jsonLd && (
        <Script
          id="conference-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-12">
        {/* Navigation */}
        <nav className="mb-4">
          <Link href="/conferences" className="text-sky-600 font-semibold flex items-center gap-2 hover:underline transition-all">
            <ArrowLeft size={18} /> Back to all Conferences
          </Link>
        </nav>

        {/* --- Header Section --- */}
        <header className="space-y-6">
          {conference.image_url && (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={conference.image_url}
                alt={`${conference.scholarship_name} - ScholarsPoint`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="space-y-3">
            <p className="text-sky-700 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-sky-700"></span>
              {conference.title}
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              {conference.scholarship_name}
            </h1>
          </div>
        </header>

        {/* --- Key Details Section --- */}
        <section className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 ring-1 ring-gray-50">
          <h2 className="text-2xl font-black mb-8 text-gray-900 border-b pb-4">
            Essential Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <InfoItem
              icon={<MapPin size={22} />}
              label="Venue & Country"
              value={`${conference.location}, ${conference.country}`}
            />
            <InfoItem
              icon={<Calendar size={22} />}
              label="Important Dates"
              value={conference.conference_dates}
            />
            <InfoItem
              icon={<Clock size={22} />}
              label="Program Duration"
              value={conference.duration}
            />
            <InfoItem
              icon={<CheckCircle2 size={22} />}
              label="Financial Support"
              value={conference.funding_type.replace(/_/g, ' ')}
            />
            <div className={`p-4 rounded-xl border ${isExpired ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
               <InfoItem
                icon={<Calendar size={22} className={isExpired ? 'text-red-600' : 'text-green-600'} />}
                label="Application Deadline"
                value={conference.deadline ? new Date(conference.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Varies'}
              />
            </div>
            <InfoItem
              icon={<Bell size={22} />}
              label="Notification Date"
              value={conference.results_notification_date}
            />
          </div>
        </section>

        {/* --- Detailed Content --- */}
        <div className="space-y-12">
          <article className="prose prose-sky prose-lg max-w-none">
            <h2 className="flex items-center gap-3 text-gray-900 font-black">
              <ClipboardList size={32} className="text-sky-600" /> 
              Overview
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {conference.description}
            </div>
          </article>

          {conference.benefits && conference.benefits.length > 0 && (
            <section className="p-8 bg-sky-900 text-white rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Ticket size={28} className="text-sky-300" /> Scholarship Coverage
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {conference.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <CheckCircle2 className="text-sky-400 w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <Presentation size={28} className="text-sky-600" /> Focus & Themes
              </h2>
              <p className="text-gray-700 italic mb-6">"{conference.theme}"</p>
              <div className="flex flex-wrap gap-2">
                {conference.target_audience.map((audience, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white text-sky-700 border border-sky-100 shadow-sm px-4 py-1">
                    {audience}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <Users size={28} className="text-sky-600" /> Eligibility
              </h2>
              <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {conference.eligibility_criteria}
              </div>
            </div>
          </section>
        </div>

        {/* --- Sticky Application Footer --- */}
        <footer className="sticky bottom-6 z-20 mx-auto max-w-2xl">
          <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-full border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between">
            <div className="hidden md:block pl-4">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Scholarship Status</p>
              <p className={`text-sm font-black ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                {isExpired ? 'Closed' : 'Accepting Applications'}
              </p>
            </div>
            {isExpired ? (
              <Button disabled className="w-full md:w-auto bg-gray-400 rounded-full px-12">Expired</Button>
            ) : (
              <Button asChild size="lg" className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-full px-12 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-200">
                <a href={conference.application_url} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            )}
          </div>
        </footer>
      </main>
    </>
  )
}
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
  Clock,
  Calendar,
  CheckCircle2,
  Target,
  FileText,
  Globe,
  Plane,
  Layers,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type ExchangeProgram = {
  id: string
  title: string
  organization: string
  country: string
  location: string
  program_dates: string
  duration: string
  deadline: string | null
  funding_type: string
  description: string
  eligibility_criteria: string
  application_url: string
  is_active: boolean
  image_url?: string
  program_components: string[]
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
  <div className="flex items-start gap-3 group">
    <div className="flex-shrink-0 text-sky-700 mt-1 transition-colors group-hover:text-sky-500">
      {icon}
    </div>
    <div>
      <p className="font-bold text-gray-900 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-gray-700 leading-tight">{value}</p>
    </div>
  </div>
)

export default function ExchangeProgramDetail() {
  const { id } = useParams()
  const [exchangeProgram, setExchangeProgram] = useState<ExchangeProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return
      setLoading(true)

      const { data, error } = await supabase
        .from('exchange_programs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to fetch program details.')
        setLoading(false)
        return
      }

      setExchangeProgram(data)

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

    fetchProgram()
  }, [id])

  // Structured Data for Sitelinks & SEO
  const jsonLd = exchangeProgram ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": exchangeProgram.title,
    "description": exchangeProgram.description,
    "image": exchangeProgram.image_url,
    "startDate": exchangeProgram.program_dates.split(' - ')[0] || "",
    "location": {
      "@type": "Place",
      "name": exchangeProgram.location,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": exchangeProgram.country
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": exchangeProgram.organization,
      "url": "https://scholarspoint.net"
    },
    "offers": {
      "@type": "Offer",
      "url": exchangeProgram.application_url,
      "availability": isExpired ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "validThrough": exchangeProgram.deadline
    }
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-12 h-12 text-sky-600" />
      </div>
    )
  }

  if (!exchangeProgram) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Program Not Found</h2>
        <Button asChild className="mt-6 bg-sky-600">
          <Link href="/exchange-programs">Browse All Programs</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {jsonLd && (
        <Script
          id="exchange-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
        <nav className="flex items-center justify-between mb-4">
          <Link href="/exchange-programs" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
            <ArrowLeft size={20} /> Back
          </Link>
        
        </nav>

        {/* --- Header Section --- */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
             <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-widest border border-sky-100">
               Global Exchange Opportunity
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
               {exchangeProgram.title}
             </h1>
             <p className="text-xl text-gray-600 font-medium">
               Hosted by <span className="text-sky-700">{exchangeProgram.organization}</span>
             </p>
          </div>
          {exchangeProgram.image_url && (
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl ring-8 ring-gray-50">
              <Image
                src={exchangeProgram.image_url}
                alt={`${exchangeProgram.title} in ${exchangeProgram.country}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* --- Core Details Grid --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <InfoItem icon={<Globe size={20} />} label="Country" value={exchangeProgram.country} />
          <InfoItem icon={<Clock size={20} />} label="Duration" value={exchangeProgram.duration} />
          <InfoItem icon={<Calendar size={20} />} label="Deadline" value={exchangeProgram.deadline ? new Date(exchangeProgram.deadline).toLocaleDateString() : 'Rolling'} />
          <InfoItem icon={<CheckCircle2 size={20} />} label="Funding" value={exchangeProgram.funding_type.replace(/_/g, ' ')} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <article>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <ClipboardList className="text-sky-600" /> About the Program
              </h2>
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap prose prose-sky">
                {exchangeProgram.description}
              </div>
            </article>

            {exchangeProgram.program_components?.length > 0 && (
              <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Layers className="text-sky-600" /> Key Components
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exchangeProgram.program_components.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-sky-500" /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Target className="text-sky-600" /> Focus Areas
              </h2>
              <div className="flex flex-wrap gap-3">
                {exchangeProgram.focus_areas.map((area, idx) => (
                  <Badge key={idx} variant="secondary" className="px-6 py-2 rounded-full bg-sky-100 text-sky-800 border-none hover:bg-sky-200 transition-colors">
                    {area}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar Column */}
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-6">
              <div className="bg-sky-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Plane className="text-sky-300" /> Program Benefits
                </h3>
                <ul className="space-y-4">
                  {exchangeProgram.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sky-50 text-sm">
                      <CheckCircle2 size={18} className="text-sky-400 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest text-sky-300 font-bold mb-4">Application Link</p>
                  {isExpired ? (
                    <Button disabled className="w-full bg-red-500/20 text-red-200 border border-red-500/50">Expired</Button>
                  ) : (
                    <Button asChild size="lg" className="w-full bg-white text-sky-900 hover:bg-sky-50 font-black rounded-xl">
                      <a href={exchangeProgram.application_url} target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {exchangeProgram.documents_required?.length > 0 && (
                <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-sky-600" /> Required Docs
                  </h3>
                  <ul className="space-y-2">
                    {exchangeProgram.documents_required.map((doc, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
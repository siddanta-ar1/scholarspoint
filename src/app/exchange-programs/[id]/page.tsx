'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
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
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Define the type for a single Exchange Program
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

// Helper component for displaying key details with icons
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
    <div className="flex-shrink-0 text-primary-dark mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-gray-700 capitalize">{value}</p>
    </div>
  </div>
)

export default function ExchangeProgramDetail() {
  const { id } = useParams()
  const [exchangeProgram, setExchangeProgram] =
    useState<ExchangeProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return

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
        if (deadlineDate < today) {
          expired = true
        }
      }
      setIsExpired(expired)
      setLoading(false)
    }

    fetchProgram()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-background">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  if (!exchangeProgram) {
    return (
      <div className="text-center py-10 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">
          Exchange Program Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The program you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/exchange-programs">Browse Exchange Programs</Link>
        </Button>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center bg-background min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          This Program Has Expired
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The application deadline for{' '}
          <span className="font-semibold">{exchangeProgram.title}</span> has
          passed.
        </p>
        <p className="text-gray-600">
          Please check out our other opportunities.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/exchange-programs">View Active Programs</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10 bg-background text-gray-800">
      {/* --- Header Section --- */}
      <section className="space-y-4">
        {exchangeProgram.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={exchangeProgram.image_url}
              alt={exchangeProgram.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">
            {exchangeProgram.title}
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            {exchangeProgram.organization}
          </p>
        </div>
      </section>

      {/* --- Key Details Section --- */}
      <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">
          Program Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InfoItem
            icon={<Globe size={20} />}
            label="Location"
            value={`${exchangeProgram.location}, ${exchangeProgram.country}`}
          />
          <InfoItem
            icon={<Calendar size={20} />}
            label="Program Dates"
            value={exchangeProgram.program_dates}
          />
          <InfoItem
            icon={<Clock size={20} />}
            label="Duration"
            value={exchangeProgram.duration}
          />
          <InfoItem
            icon={<Calendar size={20} />}
            label="Application Deadline"
            value={
              exchangeProgram.deadline
                ? new Date(exchangeProgram.deadline).toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' },
                  )
                : 'Varies'
            }
          />
          <InfoItem
            icon={<CheckCircle2 size={20} />}
            label="Funding"
            value={exchangeProgram.funding_type.replace(/_/g, ' ')}
          />
        </div>
      </section>

      {/* --- Detailed Information Sections --- */}
      <div className="space-y-8">
        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-primary-dark" /> About the
            Program
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {exchangeProgram.description}
          </div>
        </section>

        {exchangeProgram.program_components &&
          exchangeProgram.program_components.length > 0 && (
            <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <Layers size={24} className="text-primary-dark" /> Program
                Components
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {exchangeProgram.program_components.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

        {exchangeProgram.benefits && exchangeProgram.benefits.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Plane size={24} className="text-primary-dark" /> Key Benefits
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exchangeProgram.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {exchangeProgram.focus_areas &&
          exchangeProgram.focus_areas.length > 0 && (
            <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <Target size={24} className="text-primary-dark" /> Focus Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {exchangeProgram.focus_areas.map((area, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </section>
          )}

        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-primary-dark" />{' '}
            Eligibility Criteria
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {exchangeProgram.eligibility_criteria}
          </div>
        </section>

        {exchangeProgram.documents_required &&
          exchangeProgram.documents_required.length > 0 && (
            <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <FileText size={24} className="text-primary-dark" /> Required
                Documents
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {exchangeProgram.documents_required.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </section>
          )}
      </div>

      {/* --- Apply Button Section --- */}
      <section className="text-center pt-6 border-t border-border">
        <Button
          asChild
          size="lg"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <a
            href={exchangeProgram.application_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        </Button>
      </section>
    </main>
  )
}
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
  MapPin,
  Users,
  Presentation,
  Ticket,
  Bell,
  ClipboardList,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Define the type for a single Conference
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
        if (deadlineDate < today) {
          expired = true
        }
      }
      setIsExpired(expired)
      setLoading(false)
    }

    fetchConference()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-background">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  if (!conference) {
    return (
      <div className="text-center py-10 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Conference Not Found</h2>
        <p className="text-gray-600 mt-2">
          The conference you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/conferences">Browse Conferences</Link>
        </Button>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center bg-background min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          This Opportunity Has Expired
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The application deadline for the{' '}
          <span className="font-semibold">{conference.scholarship_name}</span>{' '}
          has passed.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/conferences">View Active Opportunities</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10 bg-background text-gray-800">
      {/* --- Header Section --- */}
      <section className="space-y-4">
        {conference.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={conference.image_url}
              alt={conference.scholarship_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}
        <div>
          <p className="text-primary font-semibold mb-1 capitalize">
            Scholarship for the {conference.title}
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">
            {conference.scholarship_name}
          </h1>
        </div>
      </section>

      {/* --- Key Details Section --- */}
      <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">
          Event & Application Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InfoItem
            icon={<MapPin size={20} />}
            label="Location"
            value={`${conference.location}, ${conference.country}`}
          />
          <InfoItem
            icon={<Calendar size={20} />}
            label="Conference Dates"
            value={conference.conference_dates}
          />
          <InfoItem
            icon={<Clock size={20} />}
            label="Duration"
            value={conference.duration}
          />
          <InfoItem
            icon={<CheckCircle2 size={20} />}
            label="Funding"
            value={conference.funding_type.replace(/_/g, ' ')}
          />
          <InfoItem
            icon={<Calendar size={20} />}
            label="Application Deadline"
            value={
              conference.deadline
                ? new Date(conference.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Varies'
            }
          />
          <InfoItem
            icon={<Bell size={20} />}
            label="Results Notification"
            value={conference.results_notification_date}
          />
        </div>
      </section>

      {/* --- Detailed Information Sections --- */}
      <div className="space-y-8">
        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-primary-dark" />{' '}
            Description
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {conference.description}
          </div>
        </section>

        {conference.benefits && conference.benefits.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Ticket size={24} className="text-primary-dark" /> Scholarship
              Benefits
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {conference.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <Presentation size={24} className="text-primary-dark" /> Theme &
            Target Audience
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
            <p>
              <strong>Theme:</strong> {conference.theme}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {conference.target_audience.map((audience, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                {audience}
              </Badge>
            ))}
          </div>
        </section>

        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <Users size={24} className="text-primary-dark" /> Eligibility
            Criteria
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {conference.eligibility_criteria}
          </div>
        </section>
      </div>

      {/* --- Apply Button Section --- */}
      <section className="text-center pt-6 border-t border-border">
        <Button
          asChild
          size="lg"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <a
            href={conference.application_url}
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
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
  Target,
  FileText,
  Briefcase,
  Shapes,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Define the type for a single Training Program
type Training = {
  id: string
  title: string
  description: string
  organization: string
  country: string
  location: string
  training_type: string
  duration: string
  funding_type: string
  benefits: string[]
  deadline: string | null
  application_url: string
  focus_areas: string[]
  eligibility_criteria: string
  documents_required: string[]
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
      <p className="text-gray-700 capitalize">{value}</p>
    </div>
  </div>
)

export default function TrainingDetail() {
  const { id } = useParams()
  const [training, setTraining] = useState<Training | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const fetchTraining = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to fetch training details.')
        setLoading(false)
        return
      }

      setTraining(data)

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

    fetchTraining()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-background">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  if (!training) {
    return (
      <div className="text-center py-10 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">
          Training Program Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The program you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/trainings">Browse Training Programs</Link>
        </Button>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center bg-background min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          This Training Program Has Expired
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The application deadline for{' '}
          <span className="font-semibold">{training.title}</span> has passed.
        </p>
        <p className="text-gray-600">
          Please check out our other opportunities.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/trainings">View Active Training Programs</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10 bg-background text-gray-800">
      <nav className="flex items-center justify-between mb-4">
                  <Link href="/trainings" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft size={20} /> Back
                  </Link>
                
                </nav>
      {/* --- Header Section --- */}
      <section className="space-y-4">
        {training.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={training.image_url}
              alt={training.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">
            {training.title}
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            {training.organization}
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
            icon={<MapPin size={20} />}
            label="Location"
            value={`${training.location}, ${training.country}`}
          />
          <InfoItem
            icon={<Shapes size={20} />}
            label="Program Type"
            value={training.training_type.replace(/_/g, ' ')}
          />
          <InfoItem
            icon={<Clock size={20} />}
            label="Duration"
            value={training.duration}
          />
          <InfoItem
            icon={<Calendar size={20} />}
            label="Deadline"
            value={
              training.deadline
                ? new Date(training.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Varies'
            }
          />
          <InfoItem
            icon={<CheckCircle2 size={20} />}
            label="Funding"
            value={training.funding_type.replace(/_/g, ' ')}
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
            {training.description}
          </div>
        </section>

        {training.benefits && training.benefits.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Briefcase size={24} className="text-primary-dark" /> Key Benefits
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {training.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {training.focus_areas && training.focus_areas.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Target size={24} className="text-primary-dark" /> Focus Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {training.focus_areas.map((area, idx) => (
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

        {training.eligibility_criteria && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <ClipboardList size={24} className="text-primary-dark" />{' '}
              Eligibility Criteria
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {training.eligibility_criteria}
            </div>
          </section>
        )}

        {training.documents_required &&
          training.documents_required.length > 0 && (
            <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <FileText size={24} className="text-primary-dark" /> Required
                Documents
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {training.documents_required.map((doc, idx) => (
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
            href={training.application_url}
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
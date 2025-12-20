'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Loader2,
  CheckCircle2,
  BookOpen,
  University,
  BarChart,
  Zap,
  BadgeDollarSign,
  Award,
  ClipboardList,
  ArrowLeft,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Define the type for a single Online Course
type OnlineCourse = {
  id: string
  title: string
  description: string
  institution: string
  subjects: string[]
  pacing: string
  difficulty_level: string
  cost_type: string
  certificate_available: boolean
  eligibility_criteria: string
  language_requirement: string
  benefits: string[]
  enrollment_url: string
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

export default function OnlineCourseDetail() {
  const { id } = useParams()
  const [onlineCourse, setOnlineCourse] = useState<OnlineCourse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('online_courses')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Failed to fetch course details.')
        setLoading(false)
        return
      }

      setOnlineCourse(data)
      setLoading(false)
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-background">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    )
  }

  if (!onlineCourse) {
    return (
      <div className="text-center py-10 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Course Not Found</h2>
        <p className="text-gray-600 mt-2">
          The course you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/online-courses">Browse Online Courses</Link>
        </Button>
      </div>
    )
  }
  
  if (!onlineCourse.is_active) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center bg-background min-h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          This Course is No Longer Available
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The course <span className="font-semibold">{onlineCourse.title}</span> is not currently active.
        </p>
        <p className="text-gray-600">
          Please check out our other available courses.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/online-courses">View Available Courses</Link>
        </Button>
      </div>
    )
  }


  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10 bg-background text-gray-800">
      <nav className="flex items-center justify-between mb-4">
                  <Link href="/online-courses" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft size={20} /> Back
                  </Link>
                
                </nav>
      {/* --- Header Section --- */}
      <section className="space-y-4">
        {onlineCourse.image_url && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={onlineCourse.image_url}
              alt={onlineCourse.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-primary leading-tight">
            {onlineCourse.title}
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            {onlineCourse.institution}
          </p>
        </div>
      </section>

      {/* --- Key Details Section --- */}
      <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
        <h2 className="text-2xl font-bold mb-5 text-gray-900">
          Course Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <InfoItem
            icon={<University size={20} />}
            label="Institution"
            value={onlineCourse.institution}
          />
          <InfoItem
            icon={<BadgeDollarSign size={20} />}
            label="Cost"
            value={onlineCourse.cost_type}
          />
          <InfoItem
            icon={<Zap size={20} />}
            label="Pacing"
            value={onlineCourse.pacing.replace(/_/g, ' ')}
          />
          <InfoItem
            icon={<BarChart size={20} />}
            label="Difficulty"
            value={onlineCourse.difficulty_level}
          />
          <InfoItem
            icon={<Award size={20} />}
            label="Certificate"
            value={
              onlineCourse.certificate_available
                ? 'Available'
                : 'Not Available'
            }
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
            {onlineCourse.description}
          </div>
        </section>

        {onlineCourse.benefits && onlineCourse.benefits.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <CheckCircle2 size={24} className="text-primary-dark" /> Key
              Benefits
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {onlineCourse.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {onlineCourse.subjects && onlineCourse.subjects.length > 0 && (
          <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
              <BookOpen size={24} className="text-primary-dark" /> Subjects
              Covered
            </h2>
            <div className="flex flex-wrap gap-2">
              {onlineCourse.subjects.map((subject, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </section>
        )}

        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2">
            <ClipboardList size={24} className="text-primary-dark" />{' '}
            Eligibility & Requirements
          </h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            <p>{onlineCourse.eligibility_criteria}</p>
            <p><strong>Language Requirement:</strong> {onlineCourse.language_requirement}</p>
          </div>
        </section>
      </div>

      {/* --- Enroll Button Section --- */}
      <section className="text-center pt-6 border-t border-border">
        <Button
          asChild
          size="lg"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <a
            href={onlineCourse.enrollment_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enroll Now
          </a>
        </Button>
      </section>
    </main>
  )
}
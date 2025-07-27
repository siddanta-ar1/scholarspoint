'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Scholarship = {
  id: string
  title: string
  description: string
  organization: string
  amount: string
  deadline: string
  eligibility: string
  requirements: string[]
  application_url: string
  country: string
  field_of_study: string
  student_level: string
  image_url?: string
  is_active: boolean
}

export default function ScholarshipDetailPage() {
  const { id } = useParams()
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [loading, setLoading] = useState(true)
  const [deadlinePassed, setDeadlinePassed] = useState(false)

  useEffect(() => {
    const fetchScholarship = async () => {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Scholarship not found')
        setScholarship(null)
        setLoading(false)
        return
      }

      setScholarship(data)
      
      // Check if deadline has passed
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline)
        const today = new Date()
        if (deadlineDate < today) {
          setDeadlinePassed(true)
        }
      }
      
      // Check if scholarship is inactive
      if (data.is_active === false) {
        setDeadlinePassed(true)
      }

      setLoading(false)
    }

    if (id) fetchScholarship()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!scholarship) {
    return (
      <p className="text-center py-10 text-red-500 font-medium">
        Scholarship not found.
      </p>
    )
  }

  if (deadlinePassed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">This Scholarship Has Expired</h1>
        <p className="text-lg text-gray-700 mb-6">
          The deadline for {scholarship.title} by {scholarship.organization} has passed.
        </p>
        <p className="text-gray-600">
          Check out our current scholarship opportunities for new applications.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/scholarships">View Active Scholarships</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Image */}
      {scholarship.image_url && (
        <div className="relative w-full h-100 rounded-lg overflow-hidden shadow-md">
          <Image
            src={scholarship.image_url}
            alt={scholarship.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Title */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">{scholarship.title}</h1>
        <p className="text-muted-foreground">
          {scholarship.organization} · {scholarship.country}
        </p>
      </section>

      {/* Info Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Deadline:</span>{' '}
          <span className="text-red-600">{scholarship.deadline}</span>
        </p>
        <p>
          <span className="font-semibold">Amount:</span> {scholarship.amount}
        </p>
        <p>
          <span className="font-semibold">Eligibility:</span> {scholarship.eligibility}
        </p>
        <p>
          <span className="font-semibold">Student Level:</span> {scholarship.student_level}
        </p>
        <p>
          <span className="font-semibold">Field of Study:</span> {scholarship.field_of_study}
        </p>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Description</h2>
        <p className="text-gray-700 leading-relaxed">{scholarship.description}</p>
      </section>

      {/* Requirements */}
      {scholarship.requirements && scholarship.requirements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-1 text-gray-800">Requirements</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {scholarship.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Apply Button */}
      <section className="flex flex-wrap gap-4 pt-2">
        <Button asChild size="lg">
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            Apply Now
          </a>
        </Button>
      </section>
    </main>
  )
}
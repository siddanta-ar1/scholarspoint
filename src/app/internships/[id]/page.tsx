'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Internship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  deadline: string
  field_of_study: string
  description: string
  image_url?: string
  requirements?: string[]
  application_url: string
  is_active: boolean
}

export default function InternshipDetail() {
  const { id } = useParams()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [deadlinePassed, setDeadlinePassed] = useState(false)

  useEffect(() => {
    const fetchInternship = async () => {
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

      setInternship(data)
      
      // Check if deadline has passed
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline)
        const today = new Date()
        if (deadlineDate < today) {
          setDeadlinePassed(true)
        }
      }
      
      // Check if internship is inactive
      if (data.is_active === false) {
        setDeadlinePassed(true)
      }

      setLoading(false)
    }

    if (id) fetchInternship()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-primary w-6 h-6" />
      </div>
    )
  }

  if (!internship) {
    return (
      <p className="text-center py-10 text-red-500 font-medium">
        Internship not found.
      </p>
    )
  }

  if (deadlinePassed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">This Internship Has Expired</h1>
        <p className="text-lg text-gray-700 mb-6">
          The deadline for {internship.title} at {internship.company} has passed.
        </p>
        <p className="text-gray-600">
          Check out our current internship opportunities for new applications.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/internships">View Active Internships</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Internship Image */}
      {internship.image_url && (
        <div className="relative w-full h-100 rounded-lg overflow-hidden shadow-md">
          <Image
            src={internship.image_url}
            alt={internship.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">{internship.title}</h1>
        <p className="text-muted-foreground">{internship.company} · {internship.location}</p>
      </section>

      {/* Info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><span className="font-medium">Duration:</span> {internship.duration}</p>
        <p><span className="font-medium">Stipend:</span> {internship.stipend}</p>
        <p><span className="font-medium">Deadline:</span> <span className="text-red-600">{internship.deadline}</span></p>
        <p><span className="font-medium">Field of Study:</span> {internship.field_of_study}</p>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Description</h2>
        <p className="text-gray-700 leading-relaxed">{internship.description}</p>
      </section>

      {/* Requirements */}
      {internship.requirements && internship.requirements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-1 text-gray-800">Requirements</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {internship.requirements.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Button */}
      <section className="flex flex-wrap gap-4 pt-2">
        <Button asChild size="lg">
          <a
            href={internship.application_url}
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
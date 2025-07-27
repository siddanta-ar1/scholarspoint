'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Fellowship = {
  id: string
  title: string
  organization: string
  amount: string
  duration: string
  deadline: string
  field_of_study: string
  eligibility: string
  description: string
  image_url?: string
  requirements?: string[]
  application_url: string
  is_active: boolean
}

export default function FellowshipDetail() {
  const { id } = useParams()
  const [fellowship, setFellowship] = useState<Fellowship | null>(null)
  const [loading, setLoading] = useState(true)
  const [deadlinePassed, setDeadlinePassed] = useState(false)

  useEffect(() => {
    const fetchFellowship = async () => {
      const { data, error } = await supabase
        .from('fellowships')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Fellowship not found.')
        setLoading(false)
        return
      }

      setFellowship(data)
      
      // Check if deadline has passed
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline)
        const today = new Date()
        if (deadlineDate < today) {
          setDeadlinePassed(true)
        }
      }
      
      // Check if fellowship is inactive
      if (data.is_active === false) {
        setDeadlinePassed(true)
      }

      setLoading(false)
    }

    if (id) fetchFellowship()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    )
  }

  if (!fellowship) {
    return (
      <p className="text-center py-10 text-red-600 font-semibold">Fellowship not found.</p>
    )
  }

  if (deadlinePassed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">This Fellowship Has Expired</h1>
        <p className="text-lg text-gray-700 mb-6">
          The deadline for {fellowship.title} by {fellowship.organization} has passed.
        </p>
        <p className="text-gray-600">
          Check out our current fellowship opportunities for new applications.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/fellowships">View Active Fellowships</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Fellowship Image */}
      {fellowship.image_url && (
        <div className="relative w-full h-90 rounded-lg overflow-hidden shadow-md">
          <Image
            src={fellowship.image_url}
            alt={fellowship.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Fellowship Title & Organization */}
      <section>
        <h1 className="text-3xl font-extrabold text-primary mb-2">{fellowship.title}</h1>
        <p className="text-muted-foreground text-lg">{fellowship.organization}</p>
      </section>

      {/* Fellowship Info Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        <p><span className="font-semibold">Amount:</span> {fellowship.amount}</p>
        <p><span className="font-semibold">Duration:</span> {fellowship.duration}</p>
        <p><span className="font-semibold">Deadline:</span> <span className="text-red-600">{fellowship.deadline}</span></p>
        <p><span className="font-semibold">Field of Study:</span> {fellowship.field_of_study}</p>
        <p className="sm:col-span-2"><span className="font-semibold">Eligibility:</span> {fellowship.eligibility}</p>
      </section>

      {/* Description */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Description</h2>
        <p className="text-gray-700 leading-relaxed">{fellowship.description}</p>
      </section>

      {/* Requirements */}
      {fellowship.requirements && fellowship.requirements.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Requirements</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {fellowship.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Apply Button */}
      <section className="flex flex-wrap gap-4 pt-4">
        <Button asChild size="lg">
          <a href={fellowship.application_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center">
            Apply Now
          </a>
        </Button>
      </section>
    </main>
  )
}

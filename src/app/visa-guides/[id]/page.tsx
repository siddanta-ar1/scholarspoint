'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type VisaGuide = {
  id: string
  title: string
  country: string
  visa_type: string
  description: string
  requirements: string[]
  process_steps: string[]
  processing_time: string
  fees: string
  useful_links: string[]
  created_at: string
  updated_at: string
}

export default function VisaGuideDetail() {
  const { id } = useParams()
  const [guide, setGuide] = useState<VisaGuide | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase
        .from('visa_guides')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Visa guide not found.')
      } else {
        setGuide(data)
      }
      setLoading(false)
    }

    if (id) fetchGuide()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    )
  }

  if (!guide) {
    return (
      <p className="text-center py-10 text-red-600 font-semibold">Visa guide not found.</p>
    )
  }

  const baseCardClasses =
    "p-6 rounded-lg shadow-md border border-black bg-white dark:bg-gray-900 dark:border-gray-700"

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header card */}
      <header className={`${baseCardClasses} bg-blue-50 dark:bg-blue-900`}>
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
          {guide.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          {guide.country} · <span className="capitalize">{guide.visa_type}</span>
        </p>
      </header>

      {/* Overview card */}
      <section className={baseCardClasses}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Overview</h2>
        <div className="space-y-3 text-gray-800 dark:text-gray-300">
          <p>
            <strong>Description:</strong> {guide.description}
          </p>
          <p>
            <strong>Processing Time:</strong>{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">{guide.processing_time}</span>
          </p>
          <p>
            <strong>Fees:</strong> {guide.fees}
          </p>
        </div>
      </section>

      {/* Requirements card */}
      <section className={baseCardClasses}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Requirements</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-300">
          {guide.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </section>

      {/* Process steps card */}
      <section className={baseCardClasses}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Process Steps</h2>
        <ol className="list-decimal ml-6 space-y-2 text-gray-800 dark:text-gray-300">
          {guide.process_steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Useful links card */}
      {guide.useful_links.length > 0 && (
        <section className={baseCardClasses}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Useful Links</h2>
          <ul className="list-disc ml-6 space-y-2">
            {guide.useful_links.map((link, i) => (
              <li key={i}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

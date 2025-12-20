'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

/* ----------------------------- Types ----------------------------- */

type ContentSection = { heading: string; content: string }
type Content = { sections: ContentSection[] }

type Requirements = {
  documents?: string[]
  eligibility_criteria?: string[]
}

type ProcessStep = {
  step_number?: number
  title?: string
  description?: string
}

type UsefulLink = { title?: string; url?: string }

export type VisaGuide = {
  id: string
  title: string
  country: string
  visa_type?: string | null
  description?: string | null
  content?: Content | null
  requirements?: Requirements | string[] | null
  process_steps?: ProcessStep[] | string[] | null
  processing_time?: string | null
  fees?: string | null
  useful_links?: UsefulLink[] | string[] | null
  author?: string | null
  published_date?: string | null
  image_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

/* ------------------------- Utils / Typeguards ------------------------- */

function parseJSON<T = unknown>(val: unknown): T | null {
  if (val == null) return null
  if (typeof val === 'object') return val as T
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T
    } catch {
      return null
    }
  }
  return null
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

function isProcessStepArray(v: unknown): v is ProcessStep[] {
  return (
    Array.isArray(v) &&
    v.every(
      (x) =>
        typeof x === 'object' &&
        x !== null &&
        ('title' in x || 'description' in x || 'step_number' in x)
    )
  )
}

function isUsefulLinkObjectArray(v: unknown): v is UsefulLink[] {
  return (
    Array.isArray(v) &&
    v.every((x) => typeof x === 'object' && x !== null && ('url' in x || 'title' in x))
  )
}

/* --------------------------- Component --------------------------- */

export default function VisaGuideDetail(): React.ReactElement | null {
  const params = useParams() as { id?: string }
  const id = params?.id
  const [guide, setGuide] = useState<VisaGuide | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let isMounted = true
    const fetchGuide = async () => {
      setLoading(true)
      try {
        // Avoid using a type-parameter on from(...) to prevent "Expected 2 type arguments" in some setups.
        const res = await supabase.from('visa_guides').select('*').eq('id', id).single()
        const data = res.data as VisaGuide | null
        const error = res.error

        if (error || !data) {
          toast.error('Visa guide not found.')
          if (isMounted) setGuide(null)
          return
        }

        const normalized: VisaGuide = {
          ...data,
          content: parseJSON<Content>(data?.content),
          requirements: parseJSON<Requirements | string[]>(data?.requirements),
          process_steps: parseJSON<ProcessStep[] | string[]>(data?.process_steps),
          useful_links: parseJSON<UsefulLink[] | string[]>(data?.useful_links),
        }

        if (isMounted) setGuide(normalized)
      } catch (error) {
        // use the error variable to avoid eslint unused var
        // log for debugging and show friendly toast
       
        console.error(error)
        toast.error('Failed to load visa guide.')
        if (isMounted) setGuide(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchGuide()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin w-10 h-10 text-sky-600" />
      </div>
    )
  }

  if (!guide) {
    return <p className="text-center py-12 text-red-600 font-semibold">Visa guide not found.</p>
  }

  /* -------------------------- Render Helpers -------------------------- */

  const renderRequirements = (req: Requirements | string[] | null | undefined): React.ReactNode => {
    if (!req) {
      return <p className="text-gray-600 dark:text-gray-300">No requirements provided.</p>
    }

    if (isStringArray(req)) {
      return (
        <ul className="list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-300">
          {req.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      )
    }

    const docs = req.documents ?? []
    const elig = req.eligibility_criteria ?? []

    return (
      <div className="space-y-4 text-gray-800 dark:text-gray-300">
        <nav className="flex items-center justify-between mb-4">
                  <Link href="/visa-guides" className="text-sky-600 font-bold flex items-center gap-2 hover:opacity-80">
                    <ArrowLeft size={20} /> Back
                  </Link>
                
                </nav>
        {docs.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Documents</h3>
            <ul className="list-disc ml-6 space-y-1">
              {docs.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {elig.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Eligibility criteria</h3>
            <ul className="list-disc ml-6 space-y-1">
              {elig.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const renderProcessSteps = (steps: ProcessStep[] | string[] | null | undefined): React.ReactNode => {
    if (!steps) {
      return <p className="text-gray-600 dark:text-gray-300">No process steps provided.</p>
    }

    if (isStringArray(steps)) {
      return (
        <ol className="list-decimal ml-6 space-y-2 text-gray-800 dark:text-gray-300">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )
    }

    if (isProcessStepArray(steps)) {
      return (
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70">
              <div className="flex items-center gap-4">
                <div className="flex-none">
                  <div className="w-10 h-10 grid place-items-center rounded-full bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-200 font-semibold">
                    {s.step_number ?? i + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{s.title ?? `Step ${i + 1}`}</h4>
                  {s.description && <p className="mt-2 text-gray-700 dark:text-gray-300">{s.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return <p className="text-gray-600 dark:text-gray-300">Invalid process steps format.</p>
  }

  const renderUsefulLinks = (links: UsefulLink[] | string[] | null | undefined): React.ReactNode | null => {
    if (!links) return null

    if (isStringArray(links)) {
      return (
        <ul className="list-disc ml-6 space-y-2">
          {links.map((l, i) => (
            <li key={i}>
              <a href={l} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-300 hover:underline break-all">
                {l}
              </a>
            </li>
          ))}
        </ul>
      )
    }

    if (isUsefulLinkObjectArray(links)) {
      return (
        <ul className="list-disc ml-6 space-y-2">
          {links.map((l, i) => (
            <li key={i}>
              <a
                href={l.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-300 hover:underline break-all"
              >
                {l.title ?? l.url ?? 'Link'}
              </a>
            </li>
          ))}
        </ul>
      )
    }

    return null
  }

  /* ----------------------------- Layout ----------------------------- */

  const card = 'p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
  const headingClass = 'text-xl font-semibold text-gray-900 dark:text-gray-100'

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header className={`flex flex-col md:flex-row gap-6 items-start ${card}`}>
        <div className="w-full md:w-44 flex-shrink-0">
          {guide.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={guide.image_url}
              alt={guide.title}
              className="w-full h-32 md:h-36 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-full h-32 md:h-36 rounded-lg bg-sky-50 dark:bg-sky-900 grid place-items-center text-sky-700 dark:text-sky-200">
              <span className="font-bold">No image</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-sky-700 dark:text-sky-300">
            {guide.title}
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            <strong className="text-gray-800 dark:text-gray-100">{guide.country}</strong>
            {guide.visa_type ? (
              <span className="ml-2 text-sky-600 dark:text-sky-300 capitalize">· {guide.visa_type}</span>
            ) : null}
          </p>

          {guide.description ? (
            <p className="mt-4 text-gray-800 dark:text-gray-300">{guide.description}</p>
          ) : null}

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {guide.author && <span>By <strong className="text-gray-800 dark:text-gray-200">{guide.author}</strong></span>}
            {guide.published_date && (
              <span>· {new Date(guide.published_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>
      </header>

      {/* First row: Guide + Overview (two-column on md) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${card} md:col-span-2`}>
          <h2 className={headingClass}>Guide</h2>
          <div className="mt-4 space-y-6 text-gray-800 dark:text-gray-300">
            {guide.content?.sections && guide.content.sections.length > 0 ? (
              guide.content.sections.map((s, i) => (
                <section key={i} className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold">{s.heading}</h3>
                  <p className="whitespace-pre-line">{s.content}</p>
                </section>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No guide content provided.</p>
            )}
          </div>
        </div>

        <aside className={card}>
          <h2 className={headingClass}>Overview</h2>
          <div className="mt-4 space-y-3 text-gray-800 dark:text-gray-300">
            {guide.description && (
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Description:</strong> {guide.description}
              </p>
            )}

            <p>
              <strong className="text-gray-900 dark:text-gray-100">Processing Time:</strong>{' '}
              <span className="text-sky-600 dark:text-sky-300 font-medium">{guide.processing_time ?? '—'}</span>
            </p>

            <p>
              <strong className="text-gray-900 dark:text-gray-100">Fees:</strong> {guide.fees ?? '—'}
            </p>
          </div>
        </aside>
      </div>

      {/* Requirements */}
      <section className={card}>
        <h2 className={headingClass}>Requirements</h2>
        <div className="mt-4">{renderRequirements(parseJSON<Requirements | string[] | null>(guide.requirements))}</div>
      </section>

      {/* Process Steps */}
      <section className={card}>
        <h2 className={headingClass}>Process Steps</h2>
        <div className="mt-4">{renderProcessSteps(parseJSON<ProcessStep[] | string[] | null>(guide.process_steps))}</div>
      </section>

      {/* Useful Links */}
      {guide.useful_links ? (
        <section className={card}>
          <h2 className={headingClass}>Useful Links</h2>
          <div className="mt-4">{renderUsefulLinks(parseJSON<UsefulLink[] | string[] | null>(guide.useful_links))}</div>
        </section>
      ) : null}
    </main>
  )
}
 
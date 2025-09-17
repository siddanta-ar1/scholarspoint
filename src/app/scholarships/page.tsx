'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'

/* ----------------------------- Types ----------------------------- */
type StudentLevel = 'undergraduate' | 'graduate' | 'phd' | 'all' | ''

type Scholarship = {
  id: string
  title: string
  organization: string
  country: string
  deadline: string
  student_level: string
  field_of_study: string
  image_url?: string | null
  is_active?: boolean | null
}

/* ------------------------- Helper utilities ------------------------ */
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/* ------------------------- Main Component ------------------------- */
export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [filtered, setFiltered] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // controlled inputs
  const [countryInput, setCountryInput] = useState<string>('')
  const [fieldInput, setFieldInput] = useState<string>('')
  const [level, setLevel] = useState<StudentLevel>('')

  // debounced inputs
  const debouncedCountry = useDebouncedValue(countryInput, 250)
  const debouncedField = useDebouncedValue(fieldInput, 250)

  // suggestion dropdown state
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false)
  const countryRef = useRef<HTMLDivElement | null>(null)
  const fieldRef = useRef<HTMLDivElement | null>(null)

  // derived unique lists for suggestions
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>()
    scholarships.forEach((s) => {
      if (s.country) set.add(s.country.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [scholarships])

  const uniqueFields = useMemo(() => {
    const set = new Set<string>()
    scholarships.forEach((s) => {
      if (s.field_of_study) set.add(s.field_of_study.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [scholarships])

  /* ---------------------- data fetching ---------------------- */
  useEffect(() => {
    let mounted = true
    const fetchScholarships = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .eq('is_active', true)
          .order('deadline', { ascending: true })

        if (!error && data && mounted) {
          setScholarships(data)
          setFiltered(data)
        } else if (error) {
          console.error('Supabase fetch error', error)
          if (mounted) {
            setScholarships([])
            setFiltered([])
          }
        }
      } catch (err) {
        console.error('fetch error', err)
        if (mounted) {
          setScholarships([])
          setFiltered([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchScholarships()
    return () => {
      mounted = false
    }
  }, [])

  /* ---------------- click outside handlers for dropdowns ---------------- */
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      if (countryRef.current && !countryRef.current.contains(target)) setShowCountrySuggestions(false)
      if (fieldRef.current && !fieldRef.current.contains(target)) setShowFieldSuggestions(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  /* ---------------- filtering logic (uses debounced inputs) ---------------- */
  useEffect(() => {
    const c = debouncedCountry.trim().toLowerCase()
    const f = debouncedField.trim().toLowerCase()

    const result = scholarships.filter((s) => {
      const matchesCountry = c ? s.country.toLowerCase().includes(c) : true
      const matchesLevel = level && level !== 'all' ? s.student_level === level : true
      const matchesField = f ? s.field_of_study.toLowerCase().includes(f) : true
      return matchesCountry && matchesLevel && matchesField
    })

    setFiltered(result)
  }, [debouncedCountry, debouncedField, level, scholarships])

  const clearFilters = () => {
    setCountryInput('')
    setFieldInput('')
    setLevel('')
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-sky-700">Scholarship Opportunities</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Explore fully-funded, merit-based, and international scholarships tailored to your field and level.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-4 items-start">
        {/* Country Input with suggestions */}
        <div ref={countryRef} className="relative w-full sm:w-[calc(33.333%-0.75rem)]">
          <Input
            aria-label="Filter by country"
            placeholder="🌍 Filter by country"
            value={countryInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCountryInput(e.target.value)
              setShowCountrySuggestions(true)
            }}
            onFocus={() => setShowCountrySuggestions(true)}
            className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700
              focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md
              transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
          />

          {showCountrySuggestions && uniqueCountries.length > 0 && (
            <ul className="absolute z-40 mt-2 w-full max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
              {uniqueCountries
                .filter((c) => c.toLowerCase().includes(countryInput.toLowerCase()))
                .slice(0, 10)
                .map((c) => (
                  <li
                    key={c}
                    onMouseDown={(ev) => {
                      ev.preventDefault()
                      setCountryInput(c)
                      setShowCountrySuggestions(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    {c}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Student Level Select */}
        <div className="w-full sm:w-[calc(33.333%-0.75rem)]">
          <Select value={level} onValueChange={(v: string) => setLevel(v as StudentLevel)}>
            <SelectTrigger
              className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700
                focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md
                transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
            >
              <SelectValue placeholder="🎓 Student Level" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="graduate">Graduate</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="all">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Field of Study with suggestions */}
        <div ref={fieldRef} className="relative w-full sm:w-[calc(33.333%-0.75rem)]">
          <Input
            aria-label="Filter by field of study"
            placeholder="📚 Filter by field of study"
            value={fieldInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFieldInput(e.target.value)
              setShowFieldSuggestions(true)
            }}
            onFocus={() => setShowFieldSuggestions(true)}
            className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700
              focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md
              transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
          />

          {showFieldSuggestions && uniqueFields.length > 0 && (
            <ul className="absolute z-40 mt-2 w-full max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
              {uniqueFields
                .filter((f) => f.toLowerCase().includes(fieldInput.toLowerCase()))
                .slice(0, 10)
                .map((f) => (
                  <li
                    key={f}
                    onMouseDown={(ev) => {
                      ev.preventDefault()
                      setFieldInput(f)
                      setShowFieldSuggestions(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    {f}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Clear filters */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </section>

      {/* Results */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-sky-600 w-6 h-6" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No scholarships found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {filtered.map((scholarship) => (
              <Link href={`/scholarships/${scholarship.id}`} key={scholarship.id} className="no-underline">
                <Card className="h-full flex flex-col max-w-[400px] mx-auto group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md 
                  hover:shadow-xl hover:border-sky-300 transition duration-300 ease-in-out transform hover:scale-[1.02] 
                  bg-white dark:bg-neutral-900 cursor-pointer">
                  {scholarship.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={scholarship.image_url}
                        alt={scholarship.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 grid place-items-center bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-200">
                      <span className="font-semibold">No image</span>
                    </div>
                  )}

                  <CardContent className="flex flex-col flex-grow p-5 space-y-2">
                    <h2 className="text-xl font-semibold line-clamp-2 text-sky-700 group-hover:text-sky-600 transition-colors duration-200">
                      {scholarship.title}
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{scholarship.organization}</p>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>
                        <span className="font-medium">📍 Country:</span> {scholarship.country}
                      </p>
                      <p>
                        <span className="font-medium">⏳ Deadline:</span>{' '}
                        <span className="text-red-600 dark:text-red-400">{scholarship.deadline}</span>
                      </p>
                      <p>
                        <span className="font-medium">🎓 Level:</span> {scholarship.student_level}
                      </p>
                      <p>
                        <span className="font-medium">📚 Field:</span> {scholarship.field_of_study}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

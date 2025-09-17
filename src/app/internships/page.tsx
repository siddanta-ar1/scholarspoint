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

type Internship = {
  id: string
  title: string
  company: string
  country?: string | null
  deadline: string
  student_level: string
  field_of_study?: string | null
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
export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [filtered, setFiltered] = useState<Internship[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // controlled inputs
  const [countryInput, setCountryInput] = useState<string>('')
  const [fieldInput, setFieldInput] = useState<string>('')
  const [level, setLevel] = useState<StudentLevel>('')

  // debounced values
  const debouncedCountry = useDebouncedValue(countryInput, 250)
  const debouncedField = useDebouncedValue(fieldInput, 250)

  // suggestions UI
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false)
  const countryRef = useRef<HTMLDivElement | null>(null)
  const fieldRef = useRef<HTMLDivElement | null>(null)

  // derive unique suggestions
  const uniqueCountriesOrCompanies = useMemo(() => {
    const set = new Set<string>()
    internships.forEach((it) => {
      if (it.country?.trim()) set.add(it.country.trim())
      if (it.company?.trim()) set.add(it.company.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [internships])

  const uniqueFields = useMemo(() => {
    const set = new Set<string>()
    internships.forEach((it) => {
      if (it.field_of_study?.trim()) set.add(it.field_of_study.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [internships])

  /* ---------------------- data fetching ---------------------- */
  useEffect(() => {
    let mounted = true
    const fetchInternships = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('is_active', true)
          .order('deadline', { ascending: true })

        if (!error && data && mounted) {
          setInternships(data)
          setFiltered(data)
        } else if (error) {
          console.error('Supabase fetch error', error)
          if (mounted) {
            setInternships([])
            setFiltered([])
          }
        }
      } catch (err) {
        console.error('fetch error', err)
        if (mounted) {
          setInternships([])
          setFiltered([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchInternships()
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

    const result = internships.filter((item) => {
      const matchesCountryOrCompany = c
        ? ((item.country ?? '').toLowerCase().includes(c) || item.company.toLowerCase().includes(c))
        : true

      const matchesLevel = level && level !== 'all' ? item.student_level === level : true

      const matchesField = f ? (item.field_of_study ?? '').toLowerCase().includes(f) : true

      return matchesCountryOrCompany && matchesLevel && matchesField
    })

    setFiltered(result)
  }, [debouncedCountry, debouncedField, level, internships])

  const clearFilters = () => {
    setCountryInput('')
    setFieldInput('')
    setLevel('')
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-700">Internship Opportunities</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Find remote, on-site, and global internships tailored to your field of study.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-4 items-start">
        {/* Country or Company Input with suggestions */}
        <div ref={countryRef} className="relative w-full sm:w-[calc(33.333%-0.75rem)]">
          <Input
            aria-label="Filter by country or company"
            placeholder="🌍 Filter by country or company"
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

          {showCountrySuggestions && uniqueCountriesOrCompanies.length > 0 && (
            <ul className="absolute z-40 mt-2 w-full max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
              {uniqueCountriesOrCompanies
                .filter((s) => s.toLowerCase().includes(countryInput.toLowerCase()))
                .slice(0, 12)
                .map((s) => (
                  <li
                    key={s}
                    onMouseDown={(ev) => {
                      ev.preventDefault()
                      setCountryInput(s)
                      setShowCountrySuggestions(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    {s}
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

        {/* Field of Study Input with suggestions */}
        <div ref={fieldRef} className="relative w-full sm:w-[calc(33.333%-0.75rem)]">
          <Input
            aria-label="Field of study"
            placeholder="📚 Field of study"
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
                .filter((s) => s.toLowerCase().includes(fieldInput.toLowerCase()))
                .slice(0, 12)
                .map((s) => (
                  <li
                    key={s}
                    onMouseDown={(ev) => {
                      ev.preventDefault()
                      setFieldInput(s)
                      setShowFieldSuggestions(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    {s}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Clear button */}
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

      {/* Listings */}
      <section>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-sky-600" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No internships found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {filtered.map((internship) => (
              <Link href={`/internships/${internship.id}`} key={internship.id} className="no-underline">
                <Card
                  className="h-full flex flex-col max-w-[400px] mx-auto group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md 
                  hover:shadow-xl hover:border-sky-300 transition duration-300 ease-in-out transform hover:scale-[1.02] 
                  bg-white dark:bg-neutral-900 cursor-pointer"
                >
                  {internship.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={internship.image_url}
                        alt={internship.title}
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
                      {internship.title}
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{internship.company}</p>
                    <p className="text-sm text-red-600 font-medium dark:text-red-400">
                      Deadline: {internship.deadline}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">Level: {internship.student_level}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">Country: {internship.country || 'N/A'}</p>
                    {internship.field_of_study && (
                      <p className="text-sm text-gray-700 dark:text-gray-400">Field: {internship.field_of_study}</p>
                    )}
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

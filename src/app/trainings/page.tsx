'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
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
type TrainingType =
  | 'doctoral_program'
  | 'internship'
  | 'workshop'
  | 'summer_school'
  | 'vocational_training'

type Training = {
  id: string
  title: string
  organization: string
  deadline: string
  country: string
  training_type: TrainingType
  image_url?: string | null
  is_active?: boolean
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
export default function TrainingListPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [filtered, setFiltered] = useState<Training[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Controlled inputs
  const [countryInput, setCountryInput] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [type, setType] = useState<TrainingType | ''>('')

  // Debounced values
  const debouncedCountry = useDebouncedValue(countryInput, 250)
  const debouncedSearch = useDebouncedValue(searchInput, 250)

  // Suggestion dropdown state
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const countryRef = useRef<HTMLDivElement | null>(null)

  // Derived unique lists for suggestions
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>()
    trainings.forEach((t) => {
      if (t.country) set.add(t.country.trim())
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [trainings])

  // Fetch trainings
  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('trainings')
          .select('*')
          .eq('is_active', true)
          .order('deadline', { ascending: true })

        if (error) {
          console.error(error)
        } else if (data) {
          setTrainings(data)
          setFiltered(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTrainings()
  }, [])

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (countryRef.current && !countryRef.current.contains(target))
        setShowCountrySuggestions(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Filtering logic
  useEffect(() => {
    const country = debouncedCountry.trim().toLowerCase()
    const search = debouncedSearch.trim().toLowerCase()

    const result = trainings.filter((item) => {
      const matchesCountry = country
        ? (item.country ?? '').toLowerCase().includes(country)
        : true
      const matchesType = type ? item.training_type === type : true
      const matchesSearch = search
        ? (item.title ?? '').toLowerCase().includes(search) ||
          (item.organization ?? '').toLowerCase().includes(search)
        : true
      return matchesCountry && matchesType && matchesSearch
    })

    setFiltered(result)
  }, [debouncedCountry, debouncedSearch, type, trainings])

  const clearFilters = () => {
    setCountryInput('')
    setSearchInput('')
    setType('')
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700">
          Training Programs
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Gain hands-on experience and professional skills with these leading
          training opportunities worldwide.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-4 items-start">
        {/* Search Input */}
        <div className="relative w-full sm:w-[calc(33.333%-0.75rem)]">
          <Input
            aria-label="Search by title or organization"
            placeholder="🔍 Search title or organization"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
          />
        </div>

        {/* Country with suggestion dropdown */}
        <div
          ref={countryRef}
          className="relative w-full sm:w-[calc(33.333%-0.75rem)]"
        >
          <Input
            aria-label="Filter by country"
            placeholder="🌍 Filter by country"
            value={countryInput}
            onChange={(e) => {
              setCountryInput(e.target.value)
              setShowCountrySuggestions(true)
            }}
            onFocus={() => setShowCountrySuggestions(true)}
            className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
          />
          {showCountrySuggestions && uniqueCountries.length > 0 && (
            <ul className="absolute z-40 mt-2 w-full max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
              {uniqueCountries
                .filter((c) =>
                  c.toLowerCase().includes(countryInput.toLowerCase()),
                )
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

        {/* Training Type Select */}
        <div className="w-full sm:w-[calc(33.333%-0.75rem)]">
          <Select value={type} onValueChange={(v: string) => setType(v as TrainingType | '')}>
            <SelectTrigger className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base">
              <SelectValue placeholder="🎓 Program Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="doctoral_program">Doctoral Program</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="summer_school">Summer School</SelectItem>
              <SelectItem value="vocational_training">Vocational Training</SelectItem>
            </SelectContent>
          </Select>
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
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8 text-sky-600" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No training programs found for the selected filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((item) => (
              <Link
                href={`/trainings/${item.id}`}
                key={item.id}
                className="no-underline"
              >
                <Card className="h-full flex flex-col max-w-[400px] mx-auto group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md hover:shadow-xl hover:border-sky-300 transition duration-300 ease-in-out transform hover:scale-[1.02] bg-white dark:bg-neutral-900 cursor-pointer">
                  {item.image_url ? (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 grid place-items-center bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-200">
                      <span className="font-semibold">No image</span>
                    </div>
                  )}

                  <CardContent className="flex flex-col flex-grow p-5 space-y-2">
                    <h2 className="font-semibold text-lg md:text-xl text-sky-700 group-hover:text-sky-600 transition-colors duration-200 line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {item.organization}
                    </p>
                    <p className="text-sm text-red-600 font-semibold">
                      ⏳ Deadline: {new Date(item.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-400 capitalize">
                      🎓 {item.training_type.replace(/_/g, ' ')}
                    </p>
                    {item.country && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        📍 Country: {item.country}
                      </p>
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
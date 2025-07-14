'use client'

import { useEffect, useState } from 'react'
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
import { Loader2 } from 'lucide-react'

type Scholarship = {
  id: string
  title: string
  organization: string
  country: string
  deadline: string
  student_level: string
  field_of_study: string
  image_url?: string
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [filtered, setFiltered] = useState<Scholarship[]>([])
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState('')
  const [field, setField] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('is_active', true)
        .order('deadline', { ascending: true })

      if (!error && data) {
        setScholarships(data)
        setFiltered(data)
      }
      setLoading(false)
    }

    fetchScholarships()
  }, [])

  useEffect(() => {
    const filteredData = scholarships.filter((s) => {
      return (
        (country ? s.country.toLowerCase().includes(country.toLowerCase()) : true) &&
        (level && level !== 'all' ? s.student_level === level : true) &&
        (field ? s.field_of_study.toLowerCase().includes(field.toLowerCase()) : true)
      )
    })

    setFiltered(filteredData)
  }, [country, level, field, scholarships])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-primary">Scholarship Opportunities</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Explore fully-funded, merit-based, and international scholarships tailored to your field and level.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-4 justify-between">
        <Input
          placeholder="Filter by country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full md:max-w-sm"
        />
        <Select onValueChange={setLevel}>
          <SelectTrigger className="w-full md:max-w-sm">
            <SelectValue placeholder="Student Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="undergraduate">Undergraduate</SelectItem>
            <SelectItem value="graduate">Graduate</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
            <SelectItem value="all">All Levels</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by field of study"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </section>

      {/* Results */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-primary w-6 h-6" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No scholarships found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((scholarship) => (
              <Link href={`/scholarships/${scholarship.id}`} key={scholarship.id}>
                <Card
                  className="max-w-[400px] mx-auto group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md 
                  hover:shadow-xl hover:border-primary/40 transition duration-300 ease-in-out transform hover:scale-[1.02] 
                  bg-white dark:bg-neutral-900 cursor-pointer"
                >
                  {scholarship.image_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={scholarship.image_url}
                        alt={scholarship.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-5 space-y-2">
                    <h2 className="text-xl font-semibold line-clamp-2 text-primary group-hover:text-blue-600 transition-colors duration-200">
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

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

type Fellowship = {
  id: string
  title: string
  organization: string
  amount: string
  deadline: string
  field_of_study: string
  student_level: 'undergraduate' | 'graduate' | 'phd' | 'all'
  country?: string
  image_url?: string
}

export default function FellowshipListPage() {
  const [fellowships, setFellowships] = useState<Fellowship[]>([])
  const [filtered, setFiltered] = useState<Fellowship[]>([])
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState('')
  const [field, setField] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFellowships = async () => {
      const { data, error } = await supabase
        .from('fellowships')
        .select('*')
        .eq('is_active', true)
        .order('deadline', { ascending: true })

      if (data) {
        setFellowships(data)
        setFiltered(data)
      } else {
        console.error(error)
      }
      setLoading(false)
    }

    fetchFellowships()
  }, [])

  useEffect(() => {
    const filteredData = fellowships.filter((item) => {
      return (
        (country ? (item.country?.toLowerCase() || '').includes(country.toLowerCase()) : true) &&
        (level && level !== 'all' ? item.student_level === level : true) &&
        (field ? item.field_of_study.toLowerCase().includes(field.toLowerCase()) : true)
      )
    })

    setFiltered(filteredData)
  }, [country, level, field, fellowships])

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Fellowship Opportunities</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Discover prestigious fellowships that can advance your career and research worldwide.
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
          placeholder="Field of study"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </section>

      {/* Results */}
      <section>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No fellowships found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((fellowship) => (
              <Link href={`/fellowships/${fellowship.id}`} key={fellowship.id}>
                <Card
                  className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md 
                  hover:shadow-xl hover:border-primary/40 transition duration-300 ease-in-out transform hover:scale-[1.02] 
                  bg-white dark:bg-neutral-900"
                >
                  {fellowship.image_url && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={fellowship.image_url}
                        alt={fellowship.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-5 space-y-2">
                    <h2 className="font-semibold text-lg md:text-xl text-primary group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {fellowship.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{fellowship.organization}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      💰 <span className="font-semibold">Amount:</span> <span className="text-green-600">{fellowship.amount}</span>
                    </p>
                    <p className="text-sm text-red-600 font-semibold">
                      ⏳ Deadline: {fellowship.deadline}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-400 capitalize">
                      📚 Field: {fellowship.field_of_study} · 🎓 {fellowship.student_level}
                    </p>
                    {fellowship.country && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">📍 Country: {fellowship.country}</p>
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

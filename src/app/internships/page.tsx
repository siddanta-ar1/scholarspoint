'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
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

type Internship = {
  id: string
  title: string
  company: string
  country?: string
  deadline: string
  student_level: string
  field_of_study?: string
  image_url?: string
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [filtered, setFiltered] = useState<Internship[]>([])
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState('')
  const [field, setField] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInternships = async () => {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .order('deadline', { ascending: true })

      if (!error && data) {
        setInternships(data)
        setFiltered(data)
      }

      setLoading(false)
    }

    fetchInternships()
  }, [])

  useEffect(() => {
    const filteredData = internships.filter((item) => {
      return (
        (country ? (item.country?.toLowerCase() || '').includes(country.toLowerCase()) || item.company.toLowerCase().includes(country.toLowerCase()) : true) &&
        (level && level !== 'all' ? item.student_level === level : true) &&
        (field ? (item.field_of_study?.toLowerCase() || '').includes(field.toLowerCase()) : true)
      )
    })

    setFiltered(filteredData)
  }, [country, level, field, internships])

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Internship Opportunities</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find remote, on-site, and global internships tailored to your field of study.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-4 justify-between">
        <Input
          placeholder="Filter by country or company"
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

      {/* Listings */}
      <section>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No internships found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((internship) => (
              <Link href={`/internships/${internship.id}`} key={internship.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-xl border border-black bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                  {internship.image_url && (
                    <Image
                      src={internship.image_url}
                      alt={internship.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-5 space-y-2">
                    <h2 className="text-xl font-semibold line-clamp-2 text-gray-900 dark:text-white">
                      {internship.title}
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{internship.company}</p>
                    <p className="text-sm text-red-600 font-medium dark:text-red-400">Deadline: {internship.deadline}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level: {internship.student_level}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Country: {internship.country}</p>
                    {internship.field_of_study && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Field: {internship.field_of_study}</p>
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

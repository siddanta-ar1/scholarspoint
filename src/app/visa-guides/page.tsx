'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

type VisaGuide = {
  id: string
  title: string
  country: string
  visa_type: string
  image_url?: string
}

export default function VisaGuidesPage() {
  const [guides, setGuides] = useState<VisaGuide[]>([])
  const [filtered, setFiltered] = useState<VisaGuide[]>([])
  const [countryFilter, setCountryFilter] = useState('')
  const [visaTypeFilter, setVisaTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGuides() {
      const { data, error } = await supabase.from('visa_guides').select('*')

      if (error) {
        console.error('Error fetching visa guides:', error)
      } else if (data) {
        setGuides(data)
        setFiltered(data)
      }

      setLoading(false)
    }

    fetchGuides()
  }, [])

  useEffect(() => {
    const filteredData = guides.filter((guide) => {
      const matchesCountry = countryFilter
        ? guide.country?.toLowerCase().includes(countryFilter.toLowerCase())
        : true

      const matchesVisaType = visaTypeFilter
        ? guide.visa_type?.toLowerCase().includes(visaTypeFilter.toLowerCase())
        : true

      return matchesCountry && matchesVisaType
    })

    setFiltered(filteredData)
  }, [countryFilter, visaTypeFilter, guides])

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-primary">Visa Guides</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Explore detailed visa guides categorized by country and visa type.
        </p>
      </header>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
        <Input
          placeholder="Filter by country"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />
        <Input
          placeholder="Filter by visa type"
          value={visaTypeFilter}
          onChange={(e) => setVisaTypeFilter(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </section>

      {/* Visa Guide Listings */}
      <section>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((guide) => (
              <Link href={`/visa-guides/${guide.id}`} key={guide.id}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
                  {guide.image_url && (
                    <Image
                      src={guide.image_url}
                      alt={guide.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-5 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {guide.country} ·{' '}
                      <span className="capitalize">{guide.visa_type}</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No visa guides found for selected filters.</p>
        )}
      </section>
    </main>
  )
}

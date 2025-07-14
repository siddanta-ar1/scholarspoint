'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
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
    const fetchGuides = async () => {
      const { data, error } = await supabase.from('visa_guides').select('*')
      if (!error && data) {
        setGuides(data)
        setFiltered(data)
      } else {
        console.error('Error fetching visa guides:', error)
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-10">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-primary">Visa Guides</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Explore detailed visa guides categorized by country and visa type.
        </p>
      </header>

      {/* Filters */}
      <section className="flex flex-wrap gap-4 justify-start">
  <div className="relative w-full sm:w-[calc(50%-0.5rem)]">
    <Input
      placeholder="🌍 Filter by country"
      value={countryFilter}
      onChange={(e) => setCountryFilter(e.target.value)}
      className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none 
        focus:ring-2 focus:ring-primary focus:border-primary hover:shadow-md transition-all duration-200 
        bg-white dark:bg-neutral-900 text-sm md:text-base"
    />
  </div>
  <div className="relative w-full sm:w-[calc(50%-0.5rem)]">
    <Input
      placeholder="🛂 Filter by visa type"
      value={visaTypeFilter}
      onChange={(e) => setVisaTypeFilter(e.target.value)}
      className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none 
        focus:ring-2 focus:ring-primary focus:border-primary hover:shadow-md transition-all duration-200 
        bg-white dark:bg-neutral-900 text-sm md:text-base"
    />
  </div>
</section>


      {/* Listings */}
      <section>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No visa guides found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {filtered.map((guide) => (
              <Link href={`/visa-guides/${guide.id}`} key={guide.id}>
                <Card
                  className="h-full flex flex-col max-w-[400px] mx-auto group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md 
                    hover:shadow-xl hover:border-primary/40 transition duration-300 ease-in-out transform hover:scale-[1.02] 
                    bg-white dark:bg-neutral-900 cursor-pointer"
                >
                  {guide.image_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={guide.image_url}
                        alt={guide.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="flex flex-col flex-grow p-5 space-y-2">
                    <h2 className="text-xl font-semibold line-clamp-2 text-primary group-hover:text-blue-600 transition-colors duration-200">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {guide.country} · 🛂 {guide.visa_type}
                    </p>
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

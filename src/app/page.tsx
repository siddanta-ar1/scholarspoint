// app/page.tsx
'use client'

import HeroSection from '@/components/HeroSection'
import Metadata from '@/components/Metadata'
import MobileSlideshow from '@/components/MobileSlideShow'
import OpportunityList from '@/components/OpportunityList'
import { fetchOpportunities } from '@/lib/fetchOpportunities'
import { useEffect, useState } from 'react'


export default function HomePage() {
  type Opportunity = {
  id: string
  title: string
  student_level: string
  image_url?: string
  organization?: string
  company?: string
}

type OpportunityData = {
  scholarships: Opportunity[]
  internships: Opportunity[]
  fellowships: Opportunity[]
}

const [data, setData] = useState<OpportunityData>({
  scholarships: [],
  internships: [],
  fellowships: [],
})


  useEffect(() => {
    fetchOpportunities().then(setData)
  }, [])

  return (
    <>
      <Metadata />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-20">
        <HeroSection />

        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Explore Scholarships, Internships & Fellowships
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <OpportunityList title="Scholarships" data={data.scholarships} type="scholarships" labelKey="organization" />
            <OpportunityList title="Internships" data={data.internships} type="internships" labelKey="company" />
            <OpportunityList title="Fellowships" data={data.fellowships} type="fellowships" labelKey="organization" />
          </div>
        </section>

        <MobileSlideshow />
      </main>
    </>
  )
}

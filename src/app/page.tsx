'use client'

import HeroSection from '@/components/HeroSection'
import Metadata from '@/components/Metadata'
import GlobalSearch from '@/components/GlobalSearch'
import OpportunityTabs from '@/components/OpportunityTabs'

export default function HomePage() {
  return (
    <>
      <Metadata />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-20">
        <HeroSection />
        <section className="-mt-10 mb-10">
          <GlobalSearch />
        </section>
        

        {/* This single component now handles everything! */}
        <OpportunityTabs />
        
      </main>
    </>
  )
}
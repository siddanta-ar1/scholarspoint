'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { BadgeCheck } from 'lucide-react'

type OpportunityPreview = {
  id: string
  title: string
  organization?: string
  company?: string
  student_level: string
  image_url?: string
}

const images = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1581362072978-14998d01fdaa?w=400&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN1Y2Nlc3N8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=400&auto=format&fit=crop&q=60',
]


export default function HomePage() {
  const [scholarships, setScholarships] = useState<OpportunityPreview[]>([])
  const [internships, setInternships] = useState<OpportunityPreview[]>([])
  const [fellowships, setFellowships] = useState<OpportunityPreview[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data: sch } = await supabase
        .from('scholarships')
        .select('id, title, organization, student_level, image_url')
        .eq('is_active', true)
        .limit(3)

      const { data: int } = await supabase
        .from('internships')
        .select('id, title, company, student_level, image_url')
        .eq('is_active', true)
        .limit(3)

      const { data: fel } = await supabase
        .from('fellowships')
        .select('id, title, organization, student_level, image_url')
        .eq('is_active', true)
        .limit(3)

      if (sch) setScholarships(sch)
      if (int) setInternships(int)
      if (fel) setFellowships(fel)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-20">
      {/* Hero Section */}
      <section className="relative rounded-lg overflow-hidden h-96 shadow-lg">
        <video
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
       <div className="relative z-10 flex flex-col justify-center items-center h-full px-4">
  <div className="bg-white/0 p-4 md:p-8 rounded-xl text-center shadow-lg max-w-3xl w-full">
    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
      Discover Your Next Opportunity with ScholarsPoint 🎓
    </h1>
    <p className="mt-4 text-base sm:text-lg text-white">
      Scholarships, Internships & Fellowships for Students Worldwide.
    </p>
    <Link
      href="/scholarships"
      className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow-md"
    >
      Browse Scholarships
    </Link>
  </div>
</div>

      </section>


      {/* Featured Opportunities */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Opportunities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <OpportunityList title="Scholarships" data={scholarships} type="scholarships" labelKey="organization" />
          <OpportunityList title="Internships" data={internships} type="internships" labelKey="company" />
          <OpportunityList title="Fellowships" data={fellowships} type="fellowships" labelKey="organization" />
        </div>
      </section>

      {/* Mobile Slideshow */}
      <section className="relative w-full h-64 md:hidden rounded-xl overflow-hidden shadow-lg">
        {images.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            sizes="100vw"
            className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            priority={index === 0}
          />
        ))}
      </section>
    </main>
  )
}

type Props = {
  title: string
  data: OpportunityPreview[]
  type: string
  labelKey: 'organization' | 'company'
}

function OpportunityList({ title, data, type, labelKey }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {title} <BadgeCheck className="text-blue-500" size={20} />
      </h3>
      <ul className="space-y-4">
        {data.map((item) => (
          <li
            key={item.id}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <Link href={`/${type}/${item.id}`} className="flex gap-4">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="w-24 h-24 object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Image
                </div>
              )}
              <div className="py-2 pr-3">
                <h4 className="font-semibold text-blue-700 line-clamp-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item[labelKey]}</p>
                <p className="text-xs capitalize text-gray-500 mt-1">{item.student_level}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/${type}`}
        className="mt-4 inline-block text-sm text-blue-600 font-medium hover:underline"
      >
        View all {title.toLowerCase()} &rarr;
      </Link>
    </div>
  )
}

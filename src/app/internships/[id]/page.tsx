// app/internships/[id]/page.tsx
import { supabase } from '@/lib/supabaseClient'
import { Metadata } from 'next'
import InternshipDetail from '../IntershipDetails'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: internship } = await supabase
    .from('internships')
    .select('title, company, description, image_url')
    .eq('id', id)
    .single()

  if (!internship) return { title: 'Internship Not Found' }

  const seoTitle = `${internship.title} at ${internship.company} | ScholarsPoint`
  const seoDesc = internship.description.substring(0, 160)

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      images: internship.image_url ? [internship.image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: internship.image_url ? [internship.image_url] : [],
    },
  }
}

export default function Page() {
  return <InternshipDetail />
}
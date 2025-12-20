// app/fellowships/[id]/page.tsx

import { supabase } from '@/lib/supabaseClient'
import { Metadata } from 'next'
import FellowshipDetail from '../FellowshipDetails'

type Props = {
  params: { id: string }
}

// 1. Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: fellowship } = await supabase
    .from('fellowships')
    .select('title, description, image_url, organization')
    .eq('id', params.id)
    .single()

  if (!fellowship) return { title: 'Fellowship Not Found' }

  return {
    title: `${fellowship.title} | ScholarsPoint`,
    description: fellowship.description.substring(0, 160),
    openGraph: {
      title: fellowship.title,
      description: fellowship.description.substring(0, 160),
      images: fellowship.image_url ? [fellowship.image_url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fellowship.title,
      description: fellowship.description.substring(0, 160),
      images: fellowship.image_url ? [fellowship.image_url] : [],
    },
  }
}

export default function Page({ params }: Props) {
  return <FellowshipDetail />
}
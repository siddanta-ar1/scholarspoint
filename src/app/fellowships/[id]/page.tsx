// app/fellowships/[id]/page.tsx

import { supabase } from '@/lib/supabaseClient'
import { Metadata } from 'next'
import FellowshipDetail from '../FellowshipDetails';

// 1. Update the Props type: params is now a Promise
type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 2. Await the params
  const { id } = await params;

  const { data: fellowship } = await supabase
    .from('fellowships')
    .select('title, description, image_url')
    .eq('id', id)
    .single()

  if (!fellowship) return { title: 'Fellowship Not Found' }

  return {
    title: `${fellowship.title} | ScholarsPoint`,
    description: fellowship.description.substring(0, 160),
    openGraph: {
      title: fellowship.title,
      description: fellowship.description.substring(0, 160),
      images: fellowship.image_url ? [fellowship.image_url] : [],
    },
  }
}

export default async function Page({ params }: Props) {
  // 3. Await params here as well before passing it or rendering
  const resolvedParams = await params;
  
  return <FellowshipDetail />
}
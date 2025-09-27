'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export type PostCardProps = {
  slug: string
  title: string
  image_url?: string | null
  excerpt?: string | null
  published_at?: string | null
  author_name?: string | null
}

export const PostCard = ({ slug, title, image_url, excerpt, published_at, author_name }: PostCardProps) => {
  return (
    <Link href={`/blog/${slug}`} className="no-underline h-full group">
      <Card className="h-full flex flex-col rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={image_url || '/placeholder-image.jpg'}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
        <CardContent className="flex flex-col flex-grow p-5 space-y-3">
          <h3 className="text-xl font-bold text-card-foreground line-clamp-2">
            {title}
          </h3>
          {excerpt && (
            <p className="text-muted-foreground line-clamp-3 flex-grow">{excerpt}</p>
          )}
          <div className="pt-2 text-sm text-muted-foreground flex items-center justify-between">
            <span>By {author_name || 'Admin'}</span>
            {published_at && <span>{new Date(published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import Image from 'next/image'
import { Loader2, Calendar, User, ClipboardList } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Post = {
  id: string
  slug: string
  title: string
  content: string
  image_url: string
  author_name: string
  tags: string[]
  published_at: string
}

export default function SinglePostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return
      setLoading(true)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) {
        toast.error('Post not found.')
        console.error(error)
      } else {
        setPost(data)
      }
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20 bg-background min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Post Not Found</h2>
        <p className="text-gray-600 mt-2">
          This article may have been moved or deleted.
        </p>
        <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/blogs">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10 bg-background text-gray-800">
      <article className="space-y-6">
        {/* --- Header Section --- */}
        <header className="space-y-4">
          {post.image_url && (
            <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {post.author_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    dateStyle: 'long',
                  })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* --- Content Section --- */}
        <section className="p-6 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 flex items-center gap-2 sr-only">
              <ClipboardList size={24} className="text-primary-dark" /> Article Content
            </h2>
            <div className="prose prose-slate lg:prose-lg max-w-none prose-a:text-primary prose-headings:text-primary-dark prose-strong:text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
                </ReactMarkdown>
            </div>
        </section>

      </article>
    </main>
  )
}
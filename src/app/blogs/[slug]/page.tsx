'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import Image from 'next/image'
import Script from 'next/script'
import { Loader2, Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react'
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
  const [readingProgress, setReadingProgress] = useState(0)

  // Scroll Progress Logic
  useEffect(() => {
    const updateProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

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
      } else {
        setPost(data)
      }
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  // Professional Schema for Google Rich Results
  const jsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image_url,
    "author": {
      "@type": "Person",
      "name": post.author_name,
      "url": `https://scholarspoint.net/about` 
    },
    "publisher": {
      "@type": "Organization",
      "name": "ScholarsPoint",
      "logo": { "@type": "ImageObject", "url": "https://scholarspoint.net/logo.png" }
    },
    "datePublished": post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://scholarspoint.net/blogs/${post.slug}`
    }
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-32 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Article not found</h2>
        <Button asChild variant="outline">
          <Link href="/blogs"><ArrowLeft className="mr-2 w-4 h-4"/> Return to Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {jsonLd && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-sky-600 z-50 transition-all duration-150" 
        style={{ width: `${readingProgress}%` }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <nav className="mb-8">
          <Link href="/blogs" className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </nav>

        <article className="space-y-10">
          {/* Header */}
          <header className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-sky-50 text-sky-700 hover:bg-sky-100 border-none px-3">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                    {post.author_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{post.author_name}</p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {post.image_url && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Content */}
          <section className="bg-white">
            <div className="prose prose-sky prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-strong:text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </section>

          {/* Author Signature & Share */}
          <footer className="mt-16 pt-8 border-t border-gray-100 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-sky-600 text-white flex items-center justify-center text-xl font-bold">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Published by {post.author_name}</h4>
                  <p className="text-sm text-gray-500">Passionate about sharing global opportunities at ScholarsPoint.</p>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </>
  )
}
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script' // For Schema injection
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, X, Search, Tag as TagIcon } from 'lucide-react'

/* ----------------------------- Types ----------------------------- */
type Post = {
  id: string
  slug: string
  title: string
  image_url?: string | null
  excerpt: string
  published_at: string
  author_name: string
  tags: string[]
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [searchInput, setSearchInput] = useState<string>('')
  const [tagInput, setTagInput] = useState<string>('')

  const debouncedSearch = useDebouncedValue(searchInput, 250)
  const debouncedTag = useDebouncedValue(tagInput, 250)

  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const tagRef = useRef<HTMLDivElement | null>(null)

  const uniqueTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => {
      p.tags?.forEach((tag) => set.add(tag.trim()))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [posts])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })

        if (error) console.error('Error:', error)
        else if (data) {
          setPosts(data)
          setFiltered(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const search = debouncedSearch.trim().toLowerCase()
    const tag = debouncedTag.trim().toLowerCase()

    const result = posts.filter((item) => {
      const matchesSearch = search
        ? (item.title ?? '').toLowerCase().includes(search) ||
          (item.author_name ?? '').toLowerCase().includes(search)
        : true
      const matchesTag = tag
        ? (item.tags ?? []).some((t) => t.toLowerCase().includes(tag))
        : true
      return matchesSearch && matchesTag
    })
    setFiltered(result)
  }, [debouncedSearch, debouncedTag, posts])

  // Structured Data for SEO (Sitelinks Searchbox & Blog Collection)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ScholarsPoint Blog",
    "description": "Expert insights on scholarships, fellowships, and global education.",
    "url": "https://scholarspoint.net/blogs",
    "blogPost": filtered.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://scholarspoint.net/blogs/${post.slug}`,
      "datePublished": post.published_at,
      "author": { "@type": "Person", "name": post.author_name }
    }))
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-sky-800 tracking-tight">
            The ScholarsPoint Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Your ultimate guide to international education, career growth, and global opportunities.
          </p>
        </header>

        {/* Filters - Improved Accessibility & Design */}
        <nav aria-label="Blog filters" className="bg-gray-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                aria-label="Search articles"
                placeholder="Search title or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-sky-500"
              />
            </div>

            <div ref={tagRef} className="relative flex-grow">
              <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                aria-label="Filter by tag"
                placeholder="Filter by category..."
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value)
                  setShowTagSuggestions(true)
                }}
                onFocus={() => setShowTagSuggestions(true)}
                className="pl-10 h-12 rounded-xl border-gray-200 focus:ring-sky-500"
              />
              {showTagSuggestions && uniqueTags.length > 0 && (
                <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-xl border bg-white shadow-2xl py-2">
                  {uniqueTags
                    .filter((t) => t.toLowerCase().includes(tagInput.toLowerCase()))
                    .map((t) => (
                      <li
                        key={t}
                        onMouseDown={() => {
                          setTagInput(t)
                          setShowTagSuggestions(false)
                        }}
                        className="px-4 py-2 hover:bg-sky-50 cursor-pointer text-gray-700"
                      >
                        {t}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {(searchInput || tagInput) && (
              <button
                onClick={() => { setSearchInput(''); setTagInput(''); }}
                className="h-12 px-6 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </nav>

        {/* Results Section */}
        <section aria-live="polite">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="animate-spin w-10 h-10 text-sky-600" />
              <p className="text-gray-500 font-medium">Fetching latest insights...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
              <p className="text-xl text-gray-500">No matches found for your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, index) => (
                <article key={post.id} className="group">
                  <Link href={`/blogs/${post.slug}`} className="block h-full">
                    <Card className="h-full flex flex-col overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
                      {/* Image Container with Aspect Ratio fix */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        {post.image_url ? (
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            priority={index < 3} // SEO: Faster LCP for top posts
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                            <span className="text-sky-600 font-bold uppercase tracking-widest text-xs">ScholarsPoint</span>
                          </div>
                        )}
                        {/* Tag Overlay */}
                        {post.tags?.[0] && (
                          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sky-700 shadow-sm">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>

                      <CardContent className="p-6 flex flex-col flex-grow space-y-3">
                        <header>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h2>
                        </header>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                        <footer className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-neutral-800">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-tighter">
                            By <span className="text-gray-900 dark:text-gray-200">{post.author_name}</span>
                          </div>
                          <time className="text-xs text-gray-400" dateTime={post.published_at}>
                            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                        </footer>
                      </CardContent>
                    </Card>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, X } from 'lucide-react'

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

/* ------------------------- Helper utilities ------------------------ */
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/* ------------------------- Main Component ------------------------- */
export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Controlled inputs
  const [searchInput, setSearchInput] = useState<string>('')
  const [tagInput, setTagInput] = useState<string>('')

  // Debounced values
  const debouncedSearch = useDebouncedValue(searchInput, 250)
  const debouncedTag = useDebouncedValue(tagInput, 250)

  // Suggestion dropdown state
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const tagRef = useRef<HTMLDivElement | null>(null)

  // Derived unique lists for suggestions
  const uniqueTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => {
      p.tags?.forEach((tag) => set.add(tag.trim()))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [posts])

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })

        if (error) {
          console.error('Error fetching posts:', error)
        } else if (data) {
          setPosts(data)
          setFiltered(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (tagRef.current && !tagRef.current.contains(target))
        setShowTagSuggestions(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Filtering logic
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

  const clearFilters = () => {
    setSearchInput('')
    setTagInput('')
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-700">
          The ScholarsPoint Blog
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Insights, guides, and stories to help you on your academic and
          professional journey.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-4 items-start">
        <Input
          aria-label="Search by title or author"
          placeholder="🔍 Search title or author"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full sm:w-[calc(50%-0.5rem)] rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
        />

        <div ref={tagRef} className="relative w-full sm:w-[calc(50%-0.5rem)]">
          <Input
            aria-label="Filter by tag"
            placeholder="🏷️ Filter by tag"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value)
              setShowTagSuggestions(true)
            }}
            onFocus={() => setShowTagSuggestions(true)}
            className="w-full rounded-xl px-4 py-2 shadow-sm border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 hover:shadow-md transition-all duration-200 bg-white dark:bg-neutral-900 text-sm md:text-base"
          />
          {showTagSuggestions && uniqueTags.length > 0 && (
            <ul className="absolute z-40 mt-2 w-full max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
              {uniqueTags
                .filter((t) =>
                  t.toLowerCase().includes(tagInput.toLowerCase()),
                )
                .slice(0, 10)
                .map((t) => (
                  <li
                    key={t}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setTagInput(t)
                      setShowTagSuggestions(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    {t}
                  </li>
                ))}
            </ul>
          )}
        </div>
        
        <div className="w-full text-right">
             <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
            >
                <X className="w-4 h-4" />
                Clear
            </button>
        </div>
      </section>

      {/* Results */}
      <section>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8 text-sky-600" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No posts found for the selected filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((post) => (
              <Link
                href={`/blogs/${post.slug}`}
                key={post.slug}
                className="no-underline"
              >
                <Card className="h-full flex flex-col max-w-[400px] mx-auto group rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-md hover:shadow-xl hover:border-sky-300 transition duration-300 ease-in-out transform hover:scale-[1.02] bg-white dark:bg-neutral-900 cursor-pointer">
                  {post.image_url ? (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 grid place-items-center bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-200">
                      <span className="font-semibold">No image</span>
                    </div>
                  )}
                  <CardContent className="flex flex-col flex-grow p-5 space-y-2">
                    <h2 className="font-semibold text-lg md:text-xl text-sky-700 group-hover:text-sky-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                    </p>
                     <div className='!mt-auto pt-2'>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           By {post.author_name} • {new Date(post.published_at).toLocaleDateString('en-US', {dateStyle: 'medium'})}
                        </p>
                     </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
'use client'

import { useEffect, useState, useRef } from 'react'
import { useApp } from '@/store/app-store'
import { api } from '@/lib/api'
import type { Post, Category, User } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Loader2, ArrowUpRight } from 'lucide-react'
import { formatShortDate } from '@/lib/helpers'

export function SearchDialog() {
  const { searchOpen, setSearchOpen, openPost } = useApp()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<(Post & { author: User; category: Category })[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQ('')
      setResults([])
    }
  }, [searchOpen])

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const { posts } = await api.posts.list({ q, limit: 8 })
        setResults(posts)
      } catch {
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search articles</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, topics, authors…"
            className="flex-1 bg-transparent py-5 text-lg outline-none placeholder:text-muted-foreground/60"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="max-h-[60vh] overflow-y-auto scroll-lumen">
          {q.trim() === '' ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type to search across all published articles.
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No articles found for “{q}”.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => { openPost(p.slug); setSearchOpen(false) }}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {p.coverImage && <img src={p.coverImage} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] uppercase tracking-wider text-primary">{p.category.name}</span>
                      <p className="font-display text-base font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">{p.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatShortDate(p.publishedAt || p.createdAt)} · {p.readMinutes} min</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

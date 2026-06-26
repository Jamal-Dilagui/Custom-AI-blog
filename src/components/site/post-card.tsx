'use client'

import Link from 'next/link'
import { formatShortDate } from '@/lib/helpers'
import { Clock, ArrowUpRight, TrendingUp } from 'lucide-react'
import type { Post, Category, User } from '@/lib/types'
import { useApp } from '@/store/app-store'
import { CategoryIcon } from '@/lib/category-icons'

interface PostCardProps {
  post: Post & { author: User; category: Category; _count?: { comments: number } }
  variant?: 'default' | 'featured' | 'minimal' | 'horizontal' | 'overlay'
  className?: string
}

export function PostCard({ post, variant = 'default', className = '' }: PostCardProps) {
  const { openPost, openCategory } = useApp()

  if (variant === 'featured') {
    return (
      <article
        className={`group relative overflow-hidden rounded-2xl bg-card cursor-pointer ${className}`}
        onClick={() => openPost(post.slug)}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-amber-100 to-orange-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur-md bg-white/15"
            >
              <CategoryIcon name={post.category.icon} className="h-3 w-3" />
              {post.category.name}
            </span>
            {post.trending && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" /> Trending
              </span>
            )}
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-semibold leading-tight tracking-tight">
            {post.title}
          </h2>
          <p className="mt-2 text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
            <span>{post.author.name}</span>
            <span>•</span>
            <span>{formatShortDate(post.publishedAt || post.createdAt)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readMinutes} min</span>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'overlay') {
    return (
      <article
        className={`group relative overflow-hidden rounded-xl cursor-pointer ${className}`}
        onClick={() => openPost(post.slug)}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.coverAlt || post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-amber-100 to-orange-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="text-[11px] uppercase tracking-wider text-white/70">{post.category.name}</span>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug line-clamp-3">{post.title}</h3>
        </div>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={`group flex gap-4 cursor-pointer ${className}`}
        onClick={() => openPost(post.slug)}
      >
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.coverAlt || post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : null}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-[11px] uppercase tracking-wider text-primary font-medium">{post.category.name}</span>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <span className="mt-1 text-xs text-muted-foreground">{formatShortDate(post.publishedAt || post.createdAt)}</span>
        </div>
      </article>
    )
  }

  if (variant === 'minimal') {
    return (
      <article className={`group cursor-pointer ${className}`} onClick={() => openPost(post.slug)}>
        <span className="text-[11px] uppercase tracking-wider text-primary font-medium">{post.category.name}</span>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatShortDate(post.publishedAt || post.createdAt)}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readMinutes} min</span>
        </div>
      </article>
    )
  }

  // default
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl bg-card border border-border/60 cursor-pointer transition-all hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 ${className}`}
      onClick={() => openPost(post.slug)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.coverAlt || post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-100 to-orange-100" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); openCategory(post.category.slug) }}
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground hover:bg-white"
        >
          <CategoryIcon name={post.category.icon} className="h-3 w-3" style={{ color: post.category.color || undefined }} />
          {post.category.name}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{formatShortDate(post.publishedAt || post.createdAt)}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readMinutes} min read</span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-semibold text-primary">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-xs font-medium">{post.author.name}</span>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </article>
  )
}

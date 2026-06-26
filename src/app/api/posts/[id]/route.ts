import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify, estimateReadTime, excerptFromContent } from '@/lib/helpers'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  const post = await db.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatar: true, bio: true } },
      category: true,
      comments: { where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (post.status !== 'PUBLISHED' && !user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ post })
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const existing = await db.post.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data: any = {}
  for (const key of ['title', 'excerpt', 'content', 'coverImage', 'coverAlt', 'status', 'tags', 'categoryId', 'metaTitle', 'metaDescription']) {
    if (key in body) data[key] = body[key]
  }
  if ('featured' in body) data.featured = !!body.featured
  if ('trending' in body) data.trending = !!body.trending
  if ('showAds' in body) data.showAds = body.showAds !== false

  if (body.slug && body.slug !== existing.slug) {
    let slug = slugify(body.slug)
    const conflict = await db.post.findUnique({ where: { slug } })
    if (conflict && conflict.id !== id) slug = `${slug}-${Date.now().toString(36)}`
    data.slug = slug
  }
  if (data.title && !data.slug) {
    data.slug = existing.slug
  }
  if (body.content && body.content !== existing.content) {
    data.readMinutes = estimateReadTime(body.content)
    if (!body.excerpt) data.excerpt = excerptFromContent(body.content)
  }
  if (data.status === 'PUBLISHED' && !existing.publishedAt) {
    data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date()
  }
  if (body.publishedAt) {
    data.publishedAt = new Date(body.publishedAt)
  }

  const post = await db.post.update({
    where: { id },
    data,
    include: { author: { select: { id: true, name: true, avatar: true } }, category: true },
  })
  return NextResponse.json({ post })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

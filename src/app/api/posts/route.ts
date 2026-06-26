import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify, estimateReadTime, excerptFromContent } from '@/lib/helpers'

// Public: list published posts. Admin: can filter by status.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // PUBLISHED | DRAFT | ALL
  const category = searchParams.get('category') // slug
  const tag = searchParams.get('tag')
  const featured = searchParams.get('featured')
  const trending = searchParams.get('trending')
  const search = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const authorId = searchParams.get('authorId')

  const user = await getCurrentUser()
  const isAdmin = !!user

  const where: any = {}
  if (!isAdmin || status !== 'ALL') {
    where.status = status && status !== 'ALL' ? status : 'PUBLISHED'
  } else if (status === 'ALL' && isAdmin) {
    // no status filter
  }
  if (category) {
    where.category = { slug: category }
  }
  if (tag) {
    where.tags = { contains: tag }
  }
  if (featured === 'true') where.featured = true
  if (trending === 'true') where.trending = true
  if (authorId) where.authorId = authorId
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
      { tags: { contains: search } },
    ]
  }

  const [total, posts] = await Promise.all([
    db.post.count({ where }),
    db.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: true,
        _count: { select: { comments: { where: { status: 'APPROVED' } } } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return NextResponse.json({ posts, total, page, limit, totalPages: Math.ceil(total / limit) })
}

// Admin: create post
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, excerpt, content, coverImage, coverAlt, status, featured, trending, tags, categoryId, metaTitle, metaDescription, showAds, publishedAt } = body

  if (!title || !content || !categoryId) {
    return NextResponse.json({ error: 'Title, content and category are required' }, { status: 400 })
  }

  let slug = slugify(body.slug || title)
  const existing = await db.post.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const finalExcerpt = excerpt || excerptFromContent(content)
  const readMinutes = estimateReadTime(content)

  const post = await db.post.create({
    data: {
      title,
      slug,
      excerpt: finalExcerpt,
      content,
      coverImage,
      coverAlt,
      status: status || 'DRAFT',
      featured: !!featured,
      trending: !!trending,
      tags: tags || null,
      categoryId,
      authorId: user.id,
      metaTitle,
      metaDescription,
      showAds: showAds !== false,
      publishedAt: status === 'PUBLISHED' ? (publishedAt ? new Date(publishedAt) : new Date()) : (publishedAt ? new Date(publishedAt) : null),
      readMinutes,
    },
    include: { author: { select: { id: true, name: true, avatar: true } }, category: true },
  })

  return NextResponse.json({ post }, { status: 201 })
}

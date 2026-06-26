import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [totalPosts, publishedPosts, draftPosts, totalViews, totalLikes, totalComments, pendingComments, totalSubscribers, categories] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { status: 'PUBLISHED' } }),
    db.post.count({ where: { status: 'DRAFT' } }),
    db.post.aggregate({ _sum: { views: true } }),
    db.post.aggregate({ _sum: { likes: true } }),
    db.comment.count(),
    db.comment.count({ where: { status: 'PENDING' } }),
    db.subscriber.count(),
    db.category.count(),
  ])

  // top posts by views
  const topPosts = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { views: 'desc' },
    take: 5,
    select: { id: true, title: true, slug: true, views: true, likes: true, category: { select: { name: true } } },
  })

  // posts per category
  const categoriesWithCounts = await db.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: 'asc' },
  })

  // recent posts
  const recentPosts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { id: true, title: true, slug: true, status: true, createdAt: true, category: { select: { name: true } } },
  })

  return NextResponse.json({
    totals: {
      posts: totalPosts,
      published: publishedPosts,
      drafts: draftPosts,
      views: totalViews._sum.views || 0,
      likes: totalLikes._sum.likes || 0,
      comments: totalComments,
      pendingComments,
      subscribers: totalSubscribers,
      categories,
    },
    topPosts,
    categoriesWithCounts: categoriesWithCounts.map((c) => ({ name: c.name, count: c._count.posts })),
    recentPosts,
  })
}

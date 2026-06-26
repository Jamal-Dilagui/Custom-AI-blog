import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// Public: create comment
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { postId, author, email, content } = body
  if (!postId || !author || !email || !content) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }
  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  const comment = await db.comment.create({
    data: { postId, author, email, content, status: 'PENDING' },
  })
  return NextResponse.json({ comment }, { status: 201 })
}

// Admin: list comments
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'ALL'
  const where: any = {}
  if (status !== 'ALL') where.status = status
  const comments = await db.comment.findMany({
    where,
    include: { post: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json({ comments })
}

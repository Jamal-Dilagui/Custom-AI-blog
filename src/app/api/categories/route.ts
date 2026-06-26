import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/helpers'

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
  })
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { name, description, color, icon } = body
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  let slug = slugify(body.slug || name)
  const existing = await db.category.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now().toString(36)}`
  const category = await db.category.create({
    data: { name, slug, description, color, icon },
  })
  return NextResponse.json({ category }, { status: 201 })
}

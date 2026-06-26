import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const media = await db.media.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  return NextResponse.json({ media })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { url, alt, caption, width, height, type } = body
  if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  const media = await db.media.create({ data: { url, alt, caption, width, height, type: type || 'image' } })
  return NextResponse.json({ media }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/helpers'

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const existing = await db.category.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const data: any = {}
  for (const k of ['name', 'description', 'color', 'icon']) if (k in body) data[k] = body[k]
  if (body.slug && body.slug !== existing.slug) {
    let slug = slugify(body.slug)
    const conflict = await db.category.findUnique({ where: { slug } })
    if (conflict && conflict.id !== id) slug = `${slug}-${Date.now().toString(36)}`
    data.slug = slug
  }
  if (body.name && !data.slug) {
    // keep slug unless explicitly changed
  }
  const category = await db.category.update({ where: { id }, data })
  return NextResponse.json({ category })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const count = await db.post.count({ where: { categoryId: id } })
  if (count > 0) {
    return NextResponse.json({ error: `Cannot delete: ${count} posts use this category` }, { status: 400 })
  }
  await db.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

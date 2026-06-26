import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  const subscriber = await db.subscriber.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {},
    create: { email: email.toLowerCase().trim(), name },
  })
  return NextResponse.json({ subscriber }, { status: 201 })
}

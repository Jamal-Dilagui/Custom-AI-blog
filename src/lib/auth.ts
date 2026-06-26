import { cookies } from 'next/headers'
import crypto from 'crypto'
import { db } from './db'

const SESSION_SECRET = process.env.SESSION_SECRET || 'lumen-journal-dev-secret-change-me'
const SESSION_COOKIE = 'lumen_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function sign(payload: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
}

export function createSessionToken(data: { userId: string; email: string }) {
  const payload = Buffer.from(
    JSON.stringify({ ...data, exp: Date.now() + SESSION_MAX_AGE * 1000 })
  ).toString('base64url')
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function verifySessionToken(token?: string): { userId: string; email: string } | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  if (sign(payload) !== signature) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!data.exp || Date.now() > data.exp) return null
    return { userId: data.userId, email: data.email }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, avatar: true, bio: true },
  })
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }
  return user
}

export function setSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  }
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  }
}

// Simple password hashing (good enough for demo; use bcrypt in production)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verify
}

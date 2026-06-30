import { PrismaClient } from '@prisma/client'

// Use a relative path fallback so the database works on Vercel, local dev, and any host.
// On Vercel, set DATABASE_URL="file:./db/custom.db" as an environment variable,
// or it will fall back to this relative path automatically.
const databaseUrl = process.env.DATABASE_URL || 'file:./db/custom.db'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

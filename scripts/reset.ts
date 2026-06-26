import { db } from '../src/lib/db'

async function main() {
  console.log('Clearing existing content...')
  await db.comment.deleteMany()
  await db.post.deleteMany()
  await db.category.deleteMany()
  await db.subscriber.deleteMany()
  await db.media.deleteMany()
  // delete old admin user (lumenjournal) but keep if christinebritton already exists
  await db.user.deleteMany({ where: { email: 'admin@lumenjournal.com' } })
  await db.siteSetting.deleteMany()
  console.log('Done. Database cleared.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await db.$disconnect() })

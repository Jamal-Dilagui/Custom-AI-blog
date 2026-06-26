import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth'

async function main() {
  // Site settings
  const setting = await db.siteSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Lumen Journal',
      tagline: 'Stories, ideas & thoughtful living',
      description:
        'A modern editorial magazine exploring wellness, culture, home, travel and the art of slow living. Thoughtful writing for curious minds.',
      logoText: 'Lumen',
      primaryColor: '#b45309',
      accentColor: '#9a3412',
      email: 'hello@lumenjournal.com',
      location: 'Portland, Oregon',
      twitter: 'lumenjournal',
      instagram: 'lumenjournal',
      pinterest: 'lumenjournal',
      aboutTitle: 'About Lumen Journal',
      aboutContent:
        'Lumen Journal is an independent publication devoted to the art of living well. We write about wellness, home, travel, food and culture with honesty, curiosity and care. Our small team of writers and contributors believe that a good life is built from small, intentional choices — the morning ritual, the well-set table, the book read slowly, the trip taken without a plan. We are ad-supported so our stories can remain free for everyone.',
      aboutImage: '/uploads/about.jpg',
      adsenseClient: 'ca-pub-0000000000000000',
      adsenseSlotHeader: '0000000000',
      adsenseSlotInArticle: '0000000001',
      adsenseSlotSidebar: '0000000002',
      adsenseSlotFooter: '0000000003',
      adsEnabled: true,
      newsletterTitle: 'The Sunday Lumen',
      newsletterText: 'A weekly letter with our best stories, reading lists and slow-living rituals. No spam, ever.',
      footerText: '© Lumen Journal. Made with care.',
    },
  })

  // Admin user
  const existing = await db.user.findUnique({ where: { email: 'admin@lumenjournal.com' } })
  if (!existing) {
    await db.user.create({
      data: {
        email: 'admin@lumenjournal.com',
        name: 'Christine Marlow',
        password: hashPassword('admin123'),
        role: 'ADMIN',
        bio: 'Founding editor of Lumen Journal. Writes about slow living, books and the small rituals that make a home.',
        avatar: '/uploads/author.jpg',
      },
    })
    console.log('Created admin: admin@lumenjournal.com / admin123')
  }

  // Categories
  const cats = [
    { name: 'Wellness', description: 'Mind, body and the gentle practice of feeling well.', color: '#7c5c3e', icon: 'Heart' },
    { name: 'Home & Living', description: 'Spaces, objects and the quiet craft of homemaking.', color: '#9a3412', icon: 'Home' },
    { name: 'Travel', description: 'Slow journeys, places remembered and maps less followed.', color: '#a16207', icon: 'Plane' },
    { name: 'Food', description: 'Seasonal recipes, kitchen notes and the table as ritual.', color: '#854d0e', icon: 'UtensilsCrossed' },
    { name: 'Culture', description: 'Books, film, ideas and the conversations worth having.', color: '#713f12', icon: 'BookOpen' },
    { name: 'Style', description: 'Considered wardrobes and the elegance of enough.', color: '#831843', icon: 'Sparkles' },
  ]
  const categoryMap: Record<string, { id: string }> = {}
  for (const c of cats) {
    const slug = c.name.toLowerCase().replace(/[^a-z]+/g, '-')
    const cat = await db.category.upsert({
      where: { slug },
      update: { description: c.description, color: c.color, icon: c.icon },
      create: { name: c.name, slug, description: c.description, color: c.color, icon: c.icon },
    })
    categoryMap[c.name] = { id: cat.id }
  }

  // Admin
  const admin = await db.user.findUnique({ where: { email: 'admin@lumenjournal.com' } })

  const posts = [
    {
      title: 'The Quiet Power of a Slow Morning',
      slug: 'the-quiet-power-of-a-slow-morning',
      category: 'Wellness',
      excerpt: 'How a deliberate, unhurried start changes the texture of an entire day — and four small rituals to begin.',
      coverImage: '/uploads/post-wellness.jpg',
      coverAlt: 'A cup of tea by a sunlit window',
      tags: 'morning ritual,mindfulness,slow living',
      featured: true,
      trending: true,
      content: `## There is a particular kind of light at six in the morning

It comes in low and gold through the kitchen window, and it asks nothing of you. For a long time I missed it. I would wake to an alarm, reach for the phone, and let the world pour in before I had even decided what kind of day I wanted to have.

Then, one winter, I broke the habit. Not with a grand plan — only by leaving the phone in another room and refusing to set an alarm for a week.

### What changed

The first thing I noticed was the noise. Not outside — inside. Without the constant incoming, I could hear my own thinking again. The second thing was time. Mornings, it turned out, were not short. I had been making them short by filling them with urgency.

> A slow morning is not a lazy morning. It is a deliberate one.

A few rituals emerged on their own, and I have kept them since.

### Four rituals worth keeping

1. **Hot water before anything else.** Before coffee, before food. It is a small kindness to the body.
2. **A page, not a feed.** One page of a real book. It sets the tone for attention.
3. **A walk without a destination.** Ten minutes is enough. The point is the air, not the steps.
4. **One intention.** Written by hand. Not a to-do list — a single sentence about how I want to meet the day.

None of this is revolutionary. That is the point. Slow mornings are not about adding more; they are about subtracting until the essential becomes visible again.

### A note on imperfection

Some mornings the phone wins. Some mornings I oversleep, or the children are sick, or there is a deadline that will not wait. The practice is not the perfect morning. The practice is returning, without shame, the next day.

The light at six is patient. It will wait.`,
    },
    {
      title: 'A Calmer Kitchen: Designing for the Life You Actually Have',
      slug: 'a-calmer-kitchen-designing-for-the-life-you-actually-have',
      category: 'Home & Living',
      excerpt: 'The most beautiful kitchens are not the most expensive. They are the ones designed around real evenings and real mess.',
      coverImage: '/uploads/post-home.jpg',
      coverAlt: 'A calm, organised kitchen with herbs',
      tags: 'kitchen,home design,organisation',
      featured: true,
      trending: false,
      content: `## We are sold a fantasy of kitchens

Marble islands wide enough to land a small aircraft. Brass tapware that costs more than a used car. Lights that belong in a museum.

None of it is wrong. But almost none of it is about cooking — or about the life most of us actually live, which involves weeknight exhaustion, a child doing homework at the table, and a sink that is never empty for long.

### Begin with the evening

Before you choose a colour, ask a better question: *what does a Wednesday evening look like here?*

If you cook with someone, is there room for two? If children do homework, where is the light good? Where does the post-school bag land? Where does the dirty pan go while dinner is still on the stove?

Design for the mess, not the magazine.

### Three principles

**Keep the triangle, soften it.** The sink-stove-fridge triangle still matters, but the real luxury is a wide, clear counter between stove and sink — the landing strip for everything hot, heavy, or wet.

**Light in layers.** Overhead light alone is a crime against evening cooking. Add under-cabinet light for the work, a low pendant for the table, and a dimmer so the room can become gentle after the dishes are done.

**Storage you can reach.** A deep corner cabinet sounds generous until you are on your knees at seven p.m. looking for the cinnamon. Prefer shallow, reachable storage over aspirational deep ones.

### The quiet luxury

The calmest kitchens I have been in share something: they are not trying to impress. They have one good knife, a few honest pans, herbs by the window, and a table that has held a thousand ordinary meals.

That is a kitchen designed for a life. Yours.`,
    },
    {
      title: 'Lisbon in November: A Slow Itinerary',
      slug: 'lisbon-in-november-a-slow-itinerary',
      category: 'Travel',
      excerpt: 'Fewer crowds, golden light, and pastel de nata still warm at nine in the morning. A five-day wander through the city.',
      coverImage: '/uploads/post-travel.jpg',
      coverAlt: 'Lisbon rooftops at golden hour',
      tags: 'lisbon,portugal,slow travel,europe',
      featured: false,
      trending: true,
      content: `## November is Lisbon's quiet secret

The summer crowds have gone home. The light, somehow, has stayed. It falls across the tiled facades in long amber sheets, and the city moves at the pace of a long conversation.

I spent five days there last autumn with no plan beyond a rented flat in Alfama and a notebook. This is what I would do again.

### Day one — Arrive slowly

Resist the urge to see anything. Walk from your flat to the nearest café. Order a *bica* (espresso) and a *pastel de nata*. Eat it warm. Watch the trams climb the hill. Let the city introduce itself before you start collecting it.

### Day two — Alfama on foot

Alfama is a neighbourhood built for being lost. Don't fight it. Climb toward the Castle of São Jorge, but stop wherever a view opens. The miradouros — Santa Luzia, das Portas do Sol — are the real destination.

In the evening, find a *tasca*. Not the one with the menu in five languages — the one with the day's dishes chalked on a board. Order whatever the cook recommends.

### Day three — Belém and the river

Take the train to Belém. See the Jerónimos Monastery, yes, but the real pleasure is the riverside walk back toward the city. The Tagus is wide and silver here, and the light is different than on the hills.

Stop at the original Pastéis de Belém. Yes, there is a queue. It moves. The nata here is subtly different — the pastry flakier, the cream barely set.

### Day four — LX Factory and the bookshop

Cross to the Alcântara district. LX Factory is a converted industrial site now full of small shops and restaurants. The highlight is Ler Devagar, a bookshop built into an old printing press, with printing presses still hanging from the ceiling.

Buy a book. Read it in the courtyard with a coffee.

### Day five — Sintra, if you must

Sintra is beautiful and crowded in equal measure. If you go, take the early train and be at the Pena Palace by eight. Then leave by lunchtime and come back to Lisbon for a long, slow final dinner.

Or skip Sintra entirely. Walk the city instead. Sit by the river. Let the last evening belong to Lisbon itself.

### What I would pack

- One good book of Portuguese poetry (Pessoa, obviously)
- Shoes that can handle cobblestones
- A notebook for the tiled doorways you will want to remember
- Patience, for the hills`,
    },
    {
      title: 'A Loaf for Sunday: Sourdough Without the Anxiety',
      slug: 'a-loaf-for-sunday-sourdough-without-the-anxiety',
      category: 'Food',
      excerpt: 'You do not need a microscope, a schedule, or a name for your starter. You need flour, water, time, and patience.',
      coverImage: '/uploads/post-food.jpg',
      coverAlt: 'A freshly baked sourdough loaf on a linen cloth',
      tags: 'sourdough,baking,bread,recipe',
      featured: false,
      trending: false,
      content: `## Sourdough has become a performance

Somewhere between the pandemic and the proliferation of crumb-shot Instagram accounts, sourdough turned into a hobby for people who enjoy stress. Bakers began speaking of hydration percentages and starter feeding schedules as if they were managing a small nuclear reactor.

It does not have to be this way. Bread is one of the oldest things humans make. It forgives a great deal.

### The only equipment that matters

- A digital scale. Not a measuring cup. Bread is not a place for guessing.
- A Dutch oven. The steam it traps is what gives you the crust.
- A bowl. A hand. Time.

That is all.

### The loaf

This makes one loaf. It takes most of a day, but most of that day is waiting.

**Levain** — 20g mature starter, 100g water, 100g flour. Leave 4–5 hours until bubbly and doubled.

**Dough** — 350g water, 500g bread flour, 10g fine salt, all of the levain.

1. Mix water and levain. Add flour and salt. Mix until no dry flour. Rest 30 minutes.
2. Over the next 2 hours, do four "stretch and folds" — 30 minutes apart. Grab a handful of dough, stretch it up, fold it over. Rotate. Repeat four times. That is one set.
3. After the last fold, let the dough rise until it is puffy and about 50% larger — 2 to 4 hours, depending on your kitchen.
4. Shape into a round. Place in a floured bowl, seam up. Cover. Refrigerate overnight.
5. Next morning: heat the Dutch oven to 250°C (480°F) for an hour.
6. Turn the dough onto parchment, score it with a sharp knife, lower it into the hot pot. Lid on. Bake 20 minutes.
7. Lid off. Bake 20–25 minutes more, until deep amber.
8. Cool completely. *Completely.* This is the hardest step.

### The crumb will not always be perfect

Sometimes it is tight. Sometimes it is uneven. It will still be the best bread you have eaten all week, because you made it, and because bread that is two hours old is simply a different food than bread that is two days old.

Feed the starter. Forget about it for a few days. It will be fine. So will you.`,
    },
    {
      title: 'On Reading Slowly: The Books That Ask to Be Lingered Over',
      slug: 'on-reading-slowly-the-books-that-ask-to-be-lingered-over',
      category: 'Culture',
      excerpt: 'In an age of finish-the-book productivity, the case for reading the same novel twice — and the writers who reward it.',
      coverImage: '/uploads/post-culture.jpg',
      coverAlt: 'A stack of well-thumbed books by a lamp',
      tags: 'reading,books,literature',
      featured: false,
      trending: false,
      content: `## We have turned reading into a metric

Pages per night. Books per year. A spreadsheet of titles conquered. The reading apps encourage it; the reading challenges gamify it. Somewhere along the way, finishing became the point.

But finishing was never the point. Reading was.

### Some books are not meant to be finished

There is a particular kind of book that resists being consumed — that asks to be read a page at a time, sometimes a sentence at a time, and then put down so the thought can be carried through the day. These books are not difficult for the sake of it. They are dense because they are full.

I am thinking of Marilynne Robinson's *Gilead*, which is a letter from a dying father to his young son, and which I have read three times and will read again. Of Annie Dillard's *Pilgrim at Tinker Creek*, which is best read one chapter a week, like a season. Of the essays of Robert Macfarlane, which describe landscapes so specifically that to read them quickly is to miss the terrain.

### The case for re-reading

The first time you read a novel, you read for plot. The second time, freed from the question of *what happens*, you finally see *how it is happening* — the architecture, the echoes, the quiet foreshadowing you missed because you were in a hurry to find out.

Re-reading is not a failure of discovery. It is a deeper kind.

### A slow reading practice

- Keep one "slow book" going at all times, alongside whatever you are reading for momentum.
- Read it for ten minutes in the morning, not forty at night. Fresh attention matters more than duration.
- Mark passages. Not to remember them — to return to them.
- Allow yourself to abandon a book that does not earn its pages. Life is short and the library is vast.

### What I am re-reading this autumn

- *Gilead*, Marilynne Robinson
- *The Beauty of Everyday Things*, Soetsu Yanagi
- *A Field Guide to Getting Lost*, Rebecca Solnit

Each is a book that gives more the second time than the first. Each asks only that you slow down enough to hear it.`,
    },
    {
      title: 'The Considered Wardrobe: Ten Pieces, Endless Outfits',
      slug: 'the-considered-wardrobe-ten-pieces-endless-outfits',
      category: 'Style',
      excerpt: 'A small wardrobe is not about deprivation. It is about knowing yourself well enough to stop buying the wrong things.',
      coverImage: '/uploads/post-style.jpg',
      coverAlt: 'A neatly arranged capsule wardrobe',
      tags: 'capsule wardrobe,style,minimalism',
      featured: false,
      trending: false,
      content: `## The closet is full, but there is nothing to wear

It is the oldest complaint, and it is almost always a symptom of the same problem: too many clothes that are almost right, and not enough that are exactly right.

A considered wardrobe is not a minimalist aesthetic. It is not a colour palette or a rule about thirty-three items. It is simply a wardrobe where everything fits the life you have, flatters the body you are in, and works with everything else.

### Start with the question

Before you buy anything, ask: *does this work with at least three things I already own and wear?* If the answer is no, it does not matter how beautiful it is, or how good the sale is. It will become the eleventh piece that goes with nothing.

### Ten pieces that carry a season

This is not a prescription. It is a demonstration of how little you need when everything works together.

1. A well-cut white shirt
2. A navy or charcoal crewneck sweater
3. Straight-leg trousers in a neutral
4. A midi skirt that moves
5. A blazer that fits the shoulders
6. A trench or wool coat
7. Leather ankle boots
8. White leather sneakers
9. A simple silk or cotton scarf
10. One piece of good everyday jewellery

Everything here is neutral enough to mix, and none of it is so precious it cannot be lived in. The variety comes from how you combine them — tuck the shirt, layer the sweater over the skirt, add the scarf, change the shoes.

### Buy fewer, buy better

The economics of a considered wardrobe are simple. One good coat, worn for ten winters, costs less per wear than three cheap coats worn for two seasons each. The same is true of shoes, of jeans, of the white shirt that holds its shape after fifty washes.

This is not about spending more. It is about spending once.

### The freedom of enough

When the closet is full of things you love and that work together, getting dressed stops being a problem. You stop standing in front of it each morning negotiating. You simply reach, and the outfit assembles itself, because everything in there was chosen on purpose.

That is the quiet luxury of a considered wardrobe. Not the look of it — the ease.`,
    },
  ]

  for (const p of posts) {
    const existing = await db.post.findUnique({ where: { slug: p.slug } })
    if (existing) continue
    await db.post.create({
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        coverAlt: p.coverAlt,
        tags: p.tags,
        featured: p.featured,
        trending: p.trending,
        status: 'PUBLISHED',
        categoryId: categoryMap[p.category].id,
        authorId: admin!.id,
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        views: Math.floor(Math.random() * 4000) + 200,
        likes: Math.floor(Math.random() * 200) + 10,
      },
    })
  }

  console.log('Seed complete. Setting id:', setting.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

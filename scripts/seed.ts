import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth'

async function main() {
  // Site settings — Christine Britton's real content
  await db.siteSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Christine Britton',
      tagline: 'Fluid art, resin art & creative drawing tutorials',
      description:
        'Fluid art, resin art, doodle drawing and creative tutorials from a lifelong artist on the West coast of Scotland. Explore acrylic pouring, dutch pours, posca art, polymer clay and more — proof that creativity knows no age limits.',
      logoText: 'Christine Britton',
      primaryColor: '#0d7d6e',
      accentColor: '#be185d',
      email: 'hello@christinebritton.com',
      location: 'West coast of Scotland',
      twitter: 'fluidartpaint',
      facebook: 'fluidartcommunity',
      instagram: 'christinebrittonart',
      pinterest: 'christinebrittonart',
      aboutTitle: 'About Christine',
      aboutContent:
        'As a child of the 60\'s I experienced many opportunities and freedoms to explore my world, which must have perplexed my poor parents at that time. Hippies, flower power, free love, festivals and protests. Anything was up for grabs as I pushed the boundaries that previous generations seemed to have accepted without question.\nI found myself engrossed in painting and sculpture and was thrilled when people wanted to purchase my creations. Soon I was off to university studying art and continuing to grow my creative thinking and enthusiasm for the subject.\nFollowing graduation I began teaching in a secondary school and real life arrived as a shock to the system. Marriage, mortgage and 6 children later and my artistic goals became sidelined.\nMy zest for learning new ways to express my creativity is alive and kicking! From pillows, blooms, dutch pours, swiping, embellishing and trying new recipes, this art form is exciting and engaging as I continue to learn new techniques. There\'s still life in the old girl yet and proof that anyone of any age can do this.\nI\'m also the author of The Quantum Prescription — Healing The Body With The Mind, exploring the intersection of creativity, consciousness, and healing.',
      aboutImage: '/uploads/about.jpg',
      adsenseClient: 'ca-pub-0000000000000000',
      adsenseSlotHeader: '0000000000',
      adsenseSlotInArticle: '0000000001',
      adsenseSlotSidebar: '0000000002',
      adsenseSlotFooter: '0000000003',
      adsEnabled: true,
      newsletterTitle: 'The Creative Letter',
      newsletterText: 'Weekly fluid art techniques, drawing prompts and step-by-step tutorials — straight to your inbox. No spam, ever.',
      footerText: '© 2025 Christine Britton • All rights reserved',
    },
  })

  // Admin user — Christine Britton
  const existing = await db.user.findUnique({ where: { email: 'admin@christinebritton.com' } })
  if (!existing) {
    await db.user.create({
      data: {
        email: 'admin@christinebritton.com',
        name: 'Christine Britton',
        password: hashPassword('admin123'),
        role: 'ADMIN',
        bio: 'Lifelong artist on the West coast of Scotland. Fluid art, resin art, drawing and a belief that creativity knows no age limits. Author of The Quantum Prescription.',
        avatar: '/uploads/author.jpg',
      },
    })
    console.log('Created admin: admin@christinebritton.com / admin123')
  }
  const admin = await db.user.findUnique({ where: { email: 'admin@christinebritton.com' } })

  // Categories — Christine Britton's real art style taxonomy
  const cats = [
    { name: 'Fluid Art', description: 'Acrylic pouring, dutch pours, blooms and swiping — the mesmerising world of fluid art.', color: '#0d7d6e', icon: 'Droplet' },
    { name: 'Resin Art', description: 'Resin and epoxy techniques, geode coasters, ocean art and glossy finishes.', color: '#0e7490', icon: 'Gem' },
    { name: 'Drawing', description: 'Pencil art, shading techniques, sketches and realistic drawing guides.', color: '#854d0e', icon: 'Pencil' },
    { name: 'Doodle Art', description: 'Zentangle, doodle journals, name doodles and easy drawing ideas for beginners.', color: '#9333ea', icon: 'Sparkles' },
    { name: 'Posca Art', description: 'Vibrant posca marker techniques, canvas art, flowers and scenic landscapes.', color: '#be185d', icon: 'PaintBucket' },
    { name: 'Clay Art', description: 'Polymer clay, air dry clay, cardboard sculpture and handmade creations.', color: '#b45309', icon: 'Brush' },
    { name: 'Art Culture', description: 'Famous artists, history of art and the movements that shaped creative expression.', color: '#713f12', icon: 'BookOpen' },
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

  // Posts — Christine Britton's real article titles with authentic content
  const posts = [
    {
      title: 'What Is Fluid Art Painting?',
      slug: 'what-is-fluid-art-painting',
      category: 'Fluid Art',
      excerpt: 'Fluid art, or acrylic pouring, is a delightful blend of science and creativity where liquid acrylics are poured onto canvas to make stunning abstract patterns.',
      coverImage: '/uploads/post-fluid.jpg',
      coverAlt: 'A colourful acrylic pour painting with swirling cells',
      tags: 'fluid art,acrylic pouring,abstract art,beginners',
      featured: true,
      trending: true,
      content: `## A delightful blend of science and creativity

Fluid art painting, also known as **acrylic pouring**, is a delightful blend of science and creativity where artists pour liquid acrylics onto canvases to make stunning abstract patterns. Envision this: you layer colourful paints into a cup, flip it onto the canvas, and voilà — magic happens as the colours swirl and mix in unexpected ways.

It's like watching a science experiment, but way cooler because you end up with unique art every time. This technique, rooted in the 1930s by artist David Alfaro Siqueiros, uses paint density and viscosity for spectacular effects.

### Key takeaways

- Fluid art, or acrylic pouring, involves pouring acrylic paint onto a canvas to create abstract designs.
- Originating in the 1930s, it blends science and creativity, pioneered by artist David Alfaro Siqueiros.
- Techniques include dirty pour, clean pour, flip cup, and swipe — each creating unique visual effects.
- The interaction of paint densities and viscosities is crucial for dynamic patterns and textures.

### Definition and origins

Fluid art painting, commonly known as acrylic pouring, is a contemporary art technique that involves pouring acrylic paint onto a canvas to create abstract designs and patterns. This dynamic and colourful art form has roots that can be traced back to the 1930s.

During this period, Mexican artist David Alfaro Siqueiros experimented with what he called "accidental painting." The spontaneous and unpredictable nature of this method laid the foundation for what we now recognise as fluid art.

> Siqueiros' experiments combined elements of physics and chemistry, leveraging the natural behaviours of paint — its density and viscosity — to produce unexpected and often mesmerising results.

### Techniques and methods

Acrylic pouring encompasses various techniques such as **clean pour**, **dirty pour**, **flip cup**, and **swipe**, each offering distinct methods to manipulate paint on the canvas.

1. **Dirty pour** — layering multiple colours in a single cup before pouring, allowing for dynamic blending of hues.
2. **Clean pour** — directly pouring each colour onto the canvas separately, maintaining clearer colour boundaries.
3. **Flip cup** — the cup filled with various colours is flipped onto the canvas, resulting in unpredictable, mesmerising patterns.
4. **Swipe** — uses a tool to drag paint across the canvas, creating intricate, wave-like effects.

Experimentation with colour combinations and additives like silicone oil can enhance cell formation, contributing to the artistic expression inherent in fluid art. Manipulating the canvas by tilting and turning it allows the paint to flow and spread, creating organic shapes and patterns as it moves.

### Why fluid art is so popular

Fluid art's unique blend of science and creativity continues to captivate artists and art enthusiasts alike. There's something deeply satisfying about the unpredictability — no two pours are ever the same, and the reveal is always a moment of pure delight.

Whether you're a seasoned artist or a complete beginner picking up a brush for the first time, fluid art welcomes you with open arms. It's forgiving, it's messy, and it's endlessly surprising.`,
    },
    {
      title: 'The History of Fluid Art',
      slug: 'the-history-of-fluid-art',
      category: 'Fluid Art',
      excerpt: 'From David Alfaro Siqueiros\' accidental paintings in the 1930s to today\'s acrylic pouring craze — the surprising history of fluid art.',
      coverImage: '/uploads/post-fluid2.jpg',
      coverAlt: 'Historic abstract pour painting in earthy tones',
      tags: 'fluid art,history,acrylic pouring,art history',
      featured: false,
      trending: true,
      content: `## From accidental experiments to a global creative movement

When we think of fluid art, we often picture the vibrant acrylic pours flooding social media today. But the story of fluid art stretches back nearly a century, rooted in experimentation, accident and a willingness to let paint behave as paint wants to behave.

### The 1930s: Siqueiros and accidental painting

The earliest documented exploration of fluid art techniques comes from Mexican muralist **David Alfaro Siqueiros** in the 1930s. Siqueiros was fascinated by the behaviour of modern industrial paints — their flow, their density, the way colours interacted when layered and poured.

> He called it "accidental painting" — a method that embraced unpredictability rather than fighting it.

His experiments combined elements of physics and chemistry. By layering paints of different densities, he discovered that the heavier paint would push through the lighter one, creating mesmerising cellular patterns. This was the birth of what we now call the **dirty pour**.

### Mid-century evolution

Through the mid-20th century, a handful of abstract expressionists and experimental painters continued to explore pouring and flow techniques. **Helen Frankenthaler** pioneered her soak-stain method in the 1950s, pouring thinned oil paint onto unprimed canvas. **Morris Louis** took it further with his "veil" paintings, letting gravity and viscosity do the work.

These artists weren't making "fluid art" in the modern sense, but they were establishing the principle that paint could be poured, flowed and allowed to find its own form.

### The modern fluid art movement

The fluid art we recognise today — acrylic pouring with pouring medium, flip cups, swipe techniques and silicone cells — really took off in the 2010s. Several forces converged:

- **Acrylic pouring mediums** became widely available and affordable, making paint flow predictable enough to control.
- **Social media** — particularly Instagram and YouTube — turned the mesmerising reveal of a poured canvas into viral content.
- **A democratising spirit** — fluid art requires no drawing skill and no formal training, welcoming complete beginners.

### Why the history matters

Understanding where fluid art came from reminds us that it is not a fad. It is the latest chapter in a nearly century-long exploration of what paint can do when we stop trying to control every brushstroke and let the material speak.

The next time you flip a cup onto a canvas, you're participating in a tradition that stretches back to Siqueiros' studio in 1930s Mexico — and forward to wherever your own experiments take you.`,
    },
    {
      title: 'How to Doodle Sketch: Easy Guide for Beginners',
      slug: 'how-to-doodle-sketch-easy-guide-for-beginners',
      category: 'Doodle Art',
      excerpt: 'Anyone can doodle. This beginner-friendly guide covers the supplies, the mindset and the simple steps to start doodling with confidence today.',
      coverImage: '/uploads/post-doodle.jpg',
      coverAlt: 'A hand doodling zentangle patterns in a sketchbook',
      tags: 'doodle art,drawing,beginners,sketchbook',
      featured: true,
      trending: true,
      content: `## Doodling is drawing without the pressure

Here's the secret nobody tells you about doodling: it is not a lesser form of art. It is the most free, most playful, most forgiving kind of drawing there is. There are no rules, no mistakes, and no right way to do it. If you can hold a pen, you can doodle.

### What you need to start

The beauty of doodling is its simplicity. You need almost nothing:

- **A pen you like.** A fine-liner (0.3mm or 0.5mm) is ideal. Gel pens, biros and felt-tips all work.
- **Any paper.** A cheap sketchbook, a notebook, the corner of a receipt. Doodling doesn't demand fancy materials.
- **That's it.** No eraser — doodling is about committing to the line, not correcting it.

### The mindset

Before you draw a single line, let go of the idea that your doodle has to look like anything. Doodling is pattern-making. It's repetition. It's the meditative act of putting one mark next to another and seeing what happens.

> A doodle is not a drawing of something. A doodle is a record of attention.

### Five simple steps

1. **Warm up with lines.** Fill a corner of your page with straight lines, then wavy lines, then circles. Get your hand moving.
2. **Pick a simple shape.** A circle, a square, a leaf. Draw it once. Then draw it again, slightly different. Then again.
3. **Repeat and vary.** Take your shape and repeat it across the page, changing the size or rotation each time. Let a pattern emerge.
4. **Add detail.** Inside one of your shapes, add smaller shapes — dots, lines, hatching. This is where zentangle-style patterns begin.
5. **Keep going.** Don't stop to judge. Fill the page. The magic of doodling happens in the doing, not the planning.

### Easy patterns to try

- **Lines and dots** — alternating rows, building texture.
- **Spirals** — tight and loose, single and nested.
- **Scallops** — repeated semicircles, like fish scales.
- **Hatching** — parallel lines that get closer together to create shade.
- **Bubbles** — overlapping circles of different sizes.

### A daily practice

Keep your sketchbook somewhere visible. Doodle for five minutes with your morning tea, or while on a call. The goal is not to make a masterpiece — it is to keep your hand and your eye in the habit of making marks.

Within a week, you'll notice your lines becoming more confident. Within a month, you'll have a sketchbook full of patterns you didn't know you had in you. That's the quiet power of the doodle.`,
    },
    {
      title: '17 Creative Pencil Art Drawings to Boost Your Imagination',
      slug: '17-creative-pencil-art-drawings-to-boost-your-imagination',
      category: 'Drawing',
      excerpt: 'Stuck for what to draw? These 17 creative pencil art ideas will spark your imagination — from realistic textures to surreal compositions.',
      coverImage: '/uploads/post-pencil.jpg',
      coverAlt: 'A detailed pencil drawing with shading and texture',
      tags: 'pencil art,drawing,sketching,ideas',
      featured: true,
      trending: false,
      content: `## Pick up a pencil and let your imagination loose

There is something deeply satisfying about a pencil. No batteries, no charging, no undo button — just graphite, paper and your hand. If you've been staring at a blank page waiting for inspiration, here are seventeen ideas to get your pencil moving again.

### Nature & texture

1. **A single leaf, drawn from life.** Pay attention to the veins and the way light catches the edge.
2. **Tree bark close-up.** A study in texture — use hatching and cross-hatching to suggest roughness.
3. **A wave, mid-break.** Capture the curl and the foam with soft pencil work and a kneaded eraser for highlights.
4. **A feather.** Practice delicate, directional strokes following the barbs.

### People & faces

5. **A self-portrait, blind contour.** Draw without looking at the paper. It will be wrong, and that's the point.
6. **Hands in different positions.** Hands are notoriously hard — the only way to learn them is to draw them, a lot.
7. **An elderly face.** Wrinkles are wonderful practice for shading and for understanding form.
8. **A profile in shadow.** Draw a face lit from one side, focusing only on the shadow shapes.

### Objects & still life

9. **A crumpled piece of paper.** All those folds and cast shadows are a masterclass in value.
10. **A glass of water.** Refraction, reflection, transparency — a deceptively simple subject that teaches a lot.
11. **Your keys.** Everyday objects drawn carefully become interesting.
12. **A stack of books.** Practice perspective and overlapping forms.

### Imaginative & surreal

13. **A landscape from memory.** Don't use a reference — draw a place you remember and notice what your mind keeps and what it loses.
14. **A hybrid animal.** Combine two creatures and see what emerges.
15. **A door in the middle of a forest.** Tell a small story with a single image.
16. **A teacup with legs.** Absurd, yes — but playful drawing loosens up your hand and your imagination.
17. **A pattern made entirely of tiny repeated objects.** Stars, fish, leaves — let it grow organically across the page.

### How to get the most out of these

Don't spend more than 20 minutes on any one. The point is quantity over perfection — the more you draw, the more your hand learns. Date each one. Come back in a month and notice how much your eye has sharpened.

The pencil is the most patient teacher you will ever have. It waits for you to pick it up. So pick it up.`,
    },
    {
      title: '15 Posca Marker Art Ideas: Vibrant Techniques for Eye-Catching Designs',
      slug: '15-posca-marker-art-ideas-vibrant-techniques',
      category: 'Posca Art',
      excerpt: 'Posca markers are paint in a pen — opaque, vivid and endlessly versatile. Here are 15 ideas to make the most of them on canvas, paper and more.',
      coverImage: '/uploads/post-posca.jpg',
      coverAlt: 'A vibrant posca marker painting with bold colours',
      tags: 'posca art,markers,painting,ideas',
      featured: false,
      trending: true,
      content: `## Paint in a pen — the joy of Posca markers

Posca markers are unlike any other art supply. They are opaque acrylic paint in a pen, which means you can layer light over dark, paint on almost any surface, and get the vibrancy of acrylics with the control of a marker. Once you try them, it's hard to go back.

### Why Posca?

- **Opaque coverage** — you can paint white over black, no problem.
- **Work on any surface** — canvas, paper, wood, glass, metal, fabric, stone.
- **Mix like paint** — blend wet-on-wet, or layer once dry.
- **Archival quality** — lightfast and permanent when dry.

### 15 ideas to spark your next piece

**For canvas and wall art:**

1. **Botanical prints** — bold leaves and flowers in flat colour blocks.
2. **Geometric compositions** — overlapping shapes in a limited palette.
3. **Mandala-style pieces** — symmetrical patterns built from the centre out.
4. **Typography art** — a favourite quote, hand-lettered and decorated.
5. **Portrait in flat colour** — simplify a face into shapes and shadows.

**For everyday objects:**

6. **Customise a skateboard deck** — Posca was made for this.
7. **Paint a terracotta pot** — seal it afterwards and it lasts for years.
8. **Decorate a notebook cover** — your sketchbook deserves its own art.
9. **Glass bottles and jars** — turn recycling into vases.
10. **Sneakers** — yes, really. Posca on canvas shoes, sealed, survives wear.

**For paper and sketchbook:**

11. **A colourful landscape** — flat, stylised, almost like a print.
12. **Abstract florals** — loose, flowing, layered petals.
13. **Comic-style panels** — Posca's opacity is perfect for bold comic art.
14. **Patterned gift wrap** — paint on kraft paper for one-of-a-kind wrapping.
15. **A daily colour study** — one small abstract square a day.

### Techniques to try

- **Stippling** — building tone from dots of colour.
- **Layering** — let each layer dry fully before the next for crisp edges.
- **Wet blending** — work quickly while the paint is still fluid.
- **Sgraffito** — paint a layer, let it dry, paint another, then scratch through to reveal the colour beneath.

### A note on sealing

Posca is permanent on porous surfaces but can scuff on glass, metal or sealed wood. A light spray of acrylic varnish or mod podge will protect your work for years.

Pick up a pen, pick a colour, and start. Posca forgives almost everything — you can paint over any mistake.`,
    },
    {
      title: 'Top 10 Polymer Clay Artists Making Unique Handmade Creations',
      slug: 'top-10-polymer-clay-artists-unique-handmade-creations',
      category: 'Clay Art',
      excerpt: 'Polymer clay has become a medium for extraordinary art. Meet ten artists pushing the boundaries of what this humble material can do.',
      coverImage: '/uploads/post-clay.jpg',
      coverAlt: 'Detailed polymer clay sculptures and handmade creations',
      tags: 'polymer clay,clay art,artists,handmade',
      featured: false,
      trending: false,
      content: `## A humble material, elevated to art

Polymer clay is one of the most accessible art materials on earth. A block costs a few pounds, it cures in a home oven, and it can mimic everything from porcelain to stone to glass. In the hands of a skilled artist, it becomes something extraordinary.

These ten artists — working across jewellery, sculpture, illustration and beyond — show just how far polymer clay can go.

### The artists

1. **The miniaturist** — creating impossibly small, impossibly detailed food and everyday objects, each no bigger than a fingernail.
2. **The botanical sculptor** — leaves, buds and blooms so lifelike you expect them to wilt.
3. **The cane-work master** — building complex millefiori patterns that reveal themselves only when the clay is sliced.
4. **The portrait artist** — relief portraits in clay, capturing expression in shallow three dimensions.
5. **The jewellery innovator** — bold, architectural wearable pieces that read more like small sculptures than accessories.
6. **The texture experimentalist** — pressing fabric, lace, bark and stone into clay to create surfaces that beg to be touched.
7. **The faux-stone specialist** — mixing clays and pigments to mimic turquoise, jade, coral and agate.
8. **The character sculptor** — whimsical creatures with personality, each one a small story.
9. **The mosaic maker** — slicing canes into tiles and assembling them into larger images.
10. **The vessels artist** — thin-walled bowls and pots, often translucent, that elevate polymer clay to fine ceramics.

### What we can learn from them

Across these ten very different practices, a few things stand out:

- **Mastery of the basics.** Every one of these artists has spent years conditioning, rolling and curing clay. The fundamentals make the art possible.
- **A signature material conversation.** Each has found a specific way of working — a texture, a colour palette, a technique — that is recognisably theirs.
- **Willingness to fail.** Polymer clay is cheap enough to experiment with, and these artists do. The breakthroughs come from the failures.

### How to start yourself

You don't need a studio. You need a block of clay, a smooth work surface, a blade or craft knife, and an oven. Condition the clay thoroughly (the single biggest beginner mistake is under-conditioning), start simple, and let yourself make ugly things on the way to making beautiful ones.

The artists above all started exactly where you are now — with a block of clay and a question: *what can I make with this?*`,
    },
    {
      title: 'Best Paint for Air Dry Clay: Keeping Sculptures Crack-Free',
      slug: 'best-paint-for-air-dry-clay-keeping-sculptures-crack-free',
      category: 'Clay Art',
      excerpt: 'Painting air dry clay seems simple until your sculpture cracks or the paint flakes. Here is how to choose the right paint — and how to apply it.',
      coverImage: '/uploads/post-clay2.jpg',
      coverAlt: 'A painted air dry clay sculpture with smooth finish',
      tags: 'air dry clay,painting,clay art,tutorial',
      featured: false,
      trending: false,
      content: `## The right paint makes all the difference

Air dry clay is wonderfully easy to work with — no kiln, no oven, no special equipment. But once your sculpture is dry, the question becomes: what do I paint it with? The wrong choice leads to flaking, cracking or a finish that never quite looks right.

### Why air dry clay is tricky to paint

Air dry clay is porous. It absorbs water from acrylic paint, which can cause the surface to soften and the paint to sink in unevenly. If your sculpture has any remaining moisture inside, painting over it traps that moisture and leads to cracks weeks later.

The solution is a simple three-stage process: **dry, seal, paint.**

### Step 1: Dry thoroughly

This is the step everyone rushes. A small sculpture needs at least 48 hours; a larger one can take a week or more. The clay should be uniformly light in colour and cool to the touch (not slightly damp) before you even think about painting.

> If in doubt, wait another day. There is no such thing as over-drying air dry clay.

### Step 2: Seal the surface

Before painting, apply a thin coat of **acrylic gesso** or a dedicated **clay sealer**. This creates a barrier between the porous clay and your paint, preventing absorption and giving the paint something to grip. One or two thin coats are better than one thick one.

### Step 3: Choose the right paint

**Acrylic paint** is the gold standard for air dry clay. It is water-based (so it won't react with the clay), flexible (so it moves with any tiny shifts in the sculpture), and available in an enormous range of colours.

- **Student-grade acrylics** are fine for practice pieces.
- **Artist-grade acrylics** have more pigment and give a richer, more archival finish.
- **Heavy body acrylics** are good if you want visible brush texture.
- **Fluid acrylics** are better for smooth, even coverage.

Avoid oil paint (it never fully cures on porous clay and can bleed), and avoid watercolour (it will absorb unevenly and look patchy).

### Step 4: Finish and protect

Once your paint is fully dry, apply a **varnish** to protect the surface. A matte varnish gives a natural, ceramic-like finish; a gloss varnish makes colours pop and mimics glazed pottery. Two thin coats, brushed or sprayed, are usually enough.

### Quick troubleshooting

- **Cracks appearing days later** — the clay wasn't fully dry before painting.
- **Paint peeling in sheets** — the surface wasn't sealed, or the paint was applied too thickly.
- **Patchy colour** — the clay absorbed the paint unevenly; seal first.
- **Dull finish** — add a varnish; raw acrylic is naturally slightly matte.

Treat air dry clay with this simple process and your sculptures will stay smooth, vibrant and crack-free for years.`,
    },
    {
      title: 'Resin Art and Epoxy Techniques: A Beginner\'s Guide',
      slug: 'resin-art-and-epoxy-techniques-beginners-guide',
      category: 'Resin Art',
      excerpt: 'Glossy, glass-like and endlessly versatile — resin art is addictive. Here is everything a beginner needs to know to pour safely and beautifully.',
      coverImage: '/uploads/post-resin.jpg',
      coverAlt: 'A glossy resin art piece with embedded pigments',
      tags: 'resin art,epoxy,beginners,tutorial',
      featured: false,
      trending: true,
      content: `## Glossy, glass-like and endlessly versatile

There is nothing quite like the finish of cured resin — a deep, glassy surface that makes colours glow and turns a flat piece of art into something you want to reach out and touch. Resin art is addictive, but it does demand respect. Get the basics right and the results are extraordinary.

### What is epoxy resin?

Epoxy resin is a two-part liquid — a resin and a hardener — that, when mixed in the correct ratio, chemically react to form a solid, glossy plastic. For art, you want a **casting or coating resin** formulated for creative use: low-odour, UV-resistant and slow-curing (which gives you time to work).

### Safety first — non-negotiable

Resin is safe to work with if you take precautions, and harmful if you don't.

- **Wear nitrile gloves** for every pour.
- **Work in a well-ventilated space** — a window open, or a respirator if you pour often.
- **Protect your surfaces** — resin does not come off easily.
- **Keep food and drink away** from your work area.

### What you need to start

- **Epoxy resin kit** (resin + hardener, pre-measured)
- **Mixing cups** — clear, with measurement marks
- **Stir sticks** — wooden, flat
- **Pigments** — resin dye, mica powder or alcohol ink
- **A torch or heat gun** — for popping bubbles
- **A level surface** — resin self-levels, so a level surface matters
- **A dust cover** — a box or tent to keep dust off while curing

### The basic pour

1. **Measure precisely.** Most kits are a 1:1 ratio by volume. Measure exactly — off-ratio resin stays tacky forever.
2. **Mix slowly.** Stir for the full time recommended (usually 2–3 minutes), scraping the sides and bottom. Incomplete mixing causes sticky patches.
3. **Split and colour.** Divide into smaller cups and add pigment. A little goes a long way.
4. **Pour.** Layer colours directly onto your surface, or dirty-pour them together first.
5. **Torch the bubbles.** A quick pass with a flame pops surface bubbles instantly. Don't linger.
6. **Cover and cure.** Most resins are touch-dry in 24 hours and fully cured in 72.

### Techniques to explore

- **Geode coasters** — layering pigmented resin in concentric rings, finished with gold leaf.
- **Ocean art** — blue and white resin, swirled with a heat gun to create realistic waves and foam.
- **Petal pours** — dropping individual colours into a clear base for a stained-glass effect.
- **Resin and wood** — pouring into a live-edge slab for a river-table look on a small scale.

### A beginner's first three pieces

Start small and cheap. Coasters and small tiles are perfect — they use little resin, cure fast, and teach you everything: mixing, colouring, torching and finishing. By your third pour, you'll be ready for a bigger piece.

Resin rewards patience and punishes haste. Measure carefully, mix thoroughly, and let it do what it does. The reveal — peeling back the dust cover the next morning — is one of the best feelings in art.`,
    },
    {
      title: 'Famous Artists Who Changed the Art World Forever',
      slug: 'famous-artists-who-changed-the-art-world-forever',
      category: 'Art Culture',
      excerpt: 'A handful of artists didn\'t just make great work — they changed what art could be. Here are ten who reshaped the art world permanently.',
      coverImage: '/uploads/post-culture.jpg',
      coverAlt: 'A gallery wall of famous artworks through history',
      tags: 'famous artists,art history,art culture',
      featured: false,
      trending: false,
      content: `## The artists who bent the course of art

Most artists make work within the traditions they inherit. A rare few break those traditions open and force the next generation to start somewhere new. This is a small tour of ten such artists — not the "greatest" necessarily, but the ones whose work sent the whole conversation of art off in a new direction.

### The Renaissance shift

**Leonardo da Vinci** did not invent painting, but he reinvented what a painter could be — part scientist, part engineer, part philosopher. His obsessive studies of anatomy, light and optics fed directly into work that still feels impossibly alive five centuries later.

### Light, atmosphere and the everyday

**Caravaggio** brought theatre to painting with extreme chiaroscuro — figures emerging from darkness as if lit by a single candle. His influence on every painter of light who followed is impossible to overstate.

**Vermeer** took the opposite path: quiet, domestic, luminous. He proved that a single room, a single figure, a single shaft of light could carry the weight of a painting.

### The break from realism

**Claude Monet** and the Impressionists were the first group to insist that a painting could be about *the act of seeing* rather than the thing being seen. Once that door was open, art could never go back.

**Vincent van Gogh** painted emotion into every brushstroke. His work was not celebrated in his lifetime, but it became the bridge between Impressionism and Expressionism.

### The 20th century

**Pablo Picasso** did not rest in any style for long. Alongside Braque he invented Cubism, which shattered the single-point perspective that had ruled Western art since the Renaissance.

**Marcel Duchamp** asked the question that haunted the 20th century: *what counts as art?* A urinal, signed and placed in a gallery, did more to expand the definition of art than any painting of the era.

**Frida Kahlo** painted her own body, her own pain, her own identity with a directness that prefigured the confessional art of decades to come. She proved that the personal could be universal.

### Contemporary echoes

**Yayoi Kusama** turned obsession into immersive environment — rooms of mirrors and polka dots that dissolve the boundary between viewer and artwork. Her work reshaped what an art experience could be.

**Jean-Michel Basquiat** brought the energy of the street, of graffiti, of hip-hop into the gallery, and in doing so forced the art world to confront who it had been excluding.

### What they share

These artists did not set out to be revolutionary. They set out to make the work only they could make, using the tools available to them. The revolution was a side effect of honesty.

If there is a lesson for the rest of us — for the fluid artists, the doodlers, the polymer clay sculptors — it is that the most meaningful breakthroughs come not from trying to change the world, but from refusing to make work that isn't truly yours.`,
    },
    {
      title: 'How to Start a Doodle Journal: 30+ Easy Page Ideas for Beginners',
      slug: 'how-to-start-a-doodle-journal-30-easy-page-ideas',
      category: 'Doodle Art',
      excerpt: 'A doodle journal is part sketchbook, part diary, part meditation. Here is how to start one — plus 30+ easy page ideas to fill it.',
      coverImage: '/uploads/post-doodle2.jpg',
      coverAlt: 'An open doodle journal filled with patterns and ideas',
      tags: 'doodle art,journal,sketchbook,beginners',
      featured: false,
      trending: false,
      content: `## Part sketchbook, part diary, part meditation

A doodle journal is the most forgiving art practice I know. It is not a sketchbook in the traditional sense — there is no expectation of a finished drawing, no pressure to produce something frame-worthy. It is simply a place to put your pen down and see what happens, a few minutes at a time.

### Why keep one

- It builds a daily creative habit without demanding much time.
- It is a record of where your attention was, day by day.
- It loosens your hand for every other kind of art you make.
- It is genuinely calming — doodling lowers stress in measurable ways.

### What you need

A notebook you don't mind "ruining", and a pen. That is the whole kit. I prefer a dot-grid notebook because the dots give a subtle structure without the tyranny of lines, but any notebook works. Avoid erasable pens — a doodle journal is about committing to the mark.

### How to start a page

Don't begin with a plan. Begin with a mark. A single line, a circle, a dot. Then add another mark next to it. Then another. Let the page tell you what it wants to be. If you fill a corner and stop, that's a complete page. If you fill the whole thing, that's also a complete page.

### 30+ page ideas

**Patterns (10)**
1. A grid of tiny circles, each filled with a different texture.
2. Concentric squares, like a tunnel.
3. A wave pattern that fills the whole page.
4. Repeated leaves along a curving stem.
5. A spiral of dots, getting denser toward the centre.
6. Scalloped rows, like fish scales.
7. A checkerboard where each square holds a different pattern.
8. Hatched lines forming a gradient from light to dark.
9. A web of connecting lines and nodes.
10. A single shape repeated at different scales.

**Observational (8)**
11. The view from your window, simplified.
12. Your morning coffee cup.
13. The objects on your desk.
14. A plant, leaf by leaf.
15. Your own hand, blind contour.
16. The shoes you wore today.
17. A meal you ate.
18. The sky at a specific moment.

**Reflective (7)**
19. A word that mattered today, decorated.
20. Three things you're grateful for, drawn as small icons.
21. A feeling, expressed only in shapes.
22. A map of your day — where you went, in symbols.
23. A quote, hand-lettered and surrounded by pattern.
24. A weather report, drawn.
25. Something you're working through, drawn as a metaphor.

**Playful (6)**
26. A monster with too many eyes.
27. A door in the middle of nowhere.
28. A hybrid of two animals.
29. A pattern made of your initials.
30. A landscape that could not exist.
31. A tiny world inside a teacup.

### A gentle rule

The only rule of a doodle journal is: **don't tear pages out.** The "bad" pages are part of the practice. They are evidence that you showed up. Keep them. In a year, you'll be glad you did.

Start tonight. Five minutes. One mark. See where it goes.`,
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
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
        views: Math.floor(Math.random() * 8000) + 500,
        likes: Math.floor(Math.random() * 400) + 20,
      },
    })
  }

  console.log('Seed complete with Christine Britton content.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

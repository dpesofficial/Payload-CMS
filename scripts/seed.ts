/**
 * Imports the exported WordPress homepage into Payload.
 *   php scripts/wp-export.php > scripts/wp-export.json
 *   npm run seed
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dir = path.dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(fs.readFileSync(path.join(dir, 'wp-export.json'), 'utf8'))

const ADMIN = { email: 'demo@wpcreative.com.au', password: 'TitanDemo2026!' }

// Trustindex renders reviews client-side, so there is nothing in the database
// to migrate. Clearly-labelled samples; a real build syncs the Google Business
// Profile API into Payload on a schedule.
const SAMPLE_REVIEWS = [
{ author: 'Sample review · replace with live Google feed', rating: 5, quote: 'Great communication from quote to install. The shutters have cut the heat in our west-facing rooms noticeably.' },
{ author: 'Sample review · replace with live Google feed', rating: 5, quote: 'Installers were on time, tidy and quick. Quality of the product is exactly what was promised.' },
{ author: 'Sample review · replace with live Google feed', rating: 5, quote: 'Second time using Titan. Straightforward pricing and the finish matches our first install perfectly.' },
]

const payload = await getPayload({ config })
const mediaCache = new Map<number, number | string>()

const upload = async (ref: any): Promise<number | string | null> => {
  if (!ref) return null
  if (mediaCache.has(ref.wpId)) return mediaCache.get(ref.wpId)!

  const existing = await payload.find({
    collection: 'media',
    where: { wpId: { equals: ref.wpId } },
    limit: 1,
  })
  if (existing.docs[0]) {
    mediaCache.set(ref.wpId, existing.docs[0].id)
    return existing.docs[0].id
  }

  let filePath = ref.file
  if (!filePath || !fs.existsSync(filePath)) {
    // Local uploads folder is not synced, so pull the original from the live site.
    const res = await fetch(ref.remote)
    if (!res.ok) {
      console.warn(`  ! could not fetch ${ref.remote} (${res.status})`)
      return null
    }
    filePath = path.join(os.tmpdir(), ref.name)
    fs.writeFileSync(filePath, Buffer.from(await res.arrayBuffer()))
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt: ref.alt || '', wpId: ref.wpId },
    filePath,
  })
  console.log(`  + media ${ref.name}`)
  mediaCache.set(ref.wpId, doc.id)
  return doc.id
}

// Resolve every _image / _icon / _crests reference into Payload media IDs.
const layout: any[] = []
for (const block of data.layout) {
  const b: any = { ...block }

  if (b.blockType === 'banner') {
    b.slides = []
    for (const s of block.slides) {
      const { _image, ...rest } = s
      b.slides.push({ ...rest, image: await upload(_image) })
    }
    b.crests = (await Promise.all(block._crests.map(upload))).filter(Boolean)
    delete b._crests
  }

  if (b.blockType === 'yourJourney') {
    b.steps = []
    for (const s of block.steps) {
      const { _icon, ...rest } = s
      b.steps.push({ ...rest, icon: await upload(_icon) })
    }
  }

  if (b.blockType === 'twoColumn') {
    b.rows = []
    for (const r of block.rows) {
      const { _image, ...rest } = r
      b.rows.push({ ...rest, image: await upload(_image) })
    }
  }

  if (b.blockType === 'googleReviews') b.reviews = SAMPLE_REVIEWS

  layout.push(b)
}

// Payload group fields must be objects, never null.
const LINKS = new Set(['enquire', 'learnMore', 'cta'])
const normalise = (v: any): any => {
  if (Array.isArray(v)) return v.map(normalise)
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v).map(([k, val]) => [k, LINKS.has(k) && val == null ? {} : normalise(val)]),
    )
  }
  return v
}

const doc = {
  title: data.title,
  slug: data.slug,
  layout: normalise(layout),
  metaTitle: '',
  metaDescription: '',
  aiSummary: '',
}

const found = await payload.find({ collection: 'pages', where: { slug: { equals: data.slug } }, limit: 1 })
if (found.docs[0]) {
  await payload.update({ collection: 'pages', id: found.docs[0].id, data: doc })
  console.log(`Updated page /${data.slug}`)
} else {
  await payload.create({ collection: 'pages', data: doc })
  console.log(`Created page /${data.slug}`)
}

const logoId = await upload(data.settings?._logo)

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    brand: 'Titan',
    logo: logoId as any,
    nav: [
      { label: 'Roller Shutters', url: '/roller-shutters/' },
      { label: 'Plantation Shutters', url: '/shutters/' },
      { label: 'Outdoor Blinds', url: '/outdoor-blinds/' },
      { label: 'Inspiration', url: '/inspiration/' },
    ],
    headerCta: { label: 'Book a consult', url: '#quote' },
    footerText: 'Titan Shutters demo · Next.js + Payload CMS · built by WP Creative',
    phone: data.settings?.phone || '1300 020 001',
    showDemoBar: true,
    demoBarText: 'Proof of concept by WP Creative · content served from Payload CMS',
    assistantButton: 'Ask about shutters',
    assistantIntro: "Answers come only from this site's CMS content.",
    assistantSuggestions: [
      { question: 'Which shutter suits a west-facing window?' },
      { question: 'Are your shutters made in Australia?' },
      { question: 'How do I book a design consult?' },
    ],
  },
})
console.log('Seeded site settings')

const users = await payload.find({ collection: 'users', limit: 1 })
if (users.totalDocs === 0) {
  await payload.create({ collection: 'users', data: ADMIN })
  console.log(`Created admin ${ADMIN.email} / ${ADMIN.password}`)
}

console.log(`\nMigrated ${layout.length} sections from ${data.source}`)
console.log(`Not in scope for this demo: ${data.skipped.join(', ')}`)
process.exit(0)



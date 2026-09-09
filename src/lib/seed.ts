import type { Payload } from 'payload'

/**
 * Shared import routine. Used by the CLI script locally and by /api/seed on
 * Vercel, where the Blob token lives in the environment rather than on disk.
 */

const SAMPLE_REVIEWS = [
  {
    author: 'Sample review · replace with live Google feed',
    rating: 5,
    quote:
      'Great communication from quote to install. The shutters have cut the heat in our west-facing rooms noticeably.',
  },
  {
    author: 'Sample review · replace with live Google feed',
    rating: 5,
    quote:
      'Installers were on time, tidy and quick. Quality of the product is exactly what was promised.',
  },
  {
    author: 'Sample review · replace with live Google feed',
    rating: 5,
    quote:
      'Second time using Titan. Straightforward pricing and the finish matches our first install perfectly.',
  },
]

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  gif: 'image/gif',
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

export async function runSeed(
  payload: Payload,
  data: any,
  opts: { adminEmail: string; adminPassword: string; log?: (m: string) => void } ,
) {
  const log = opts.log ?? (() => {})
  const cache = new Map<number, number | string>()

  const upload = async (ref: any): Promise<number | string | null> => {
    if (!ref) return null
    if (cache.has(ref.wpId)) return cache.get(ref.wpId)!

    const existing = await payload.find({
      collection: 'media',
      where: { wpId: { equals: ref.wpId } },
      limit: 1,
    })
    if (existing.docs[0]) {
      cache.set(ref.wpId, existing.docs[0].id)
      return existing.docs[0].id
    }

    // Always fetch the original from the live site. Keeps this identical
    // whether it runs on a laptop or inside a serverless function.
    const res = await fetch(ref.remote)
    if (!res.ok) {
      log(`  ! could not fetch ${ref.remote} (${res.status})`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const ext = (ref.name.split('.').pop() || '').toLowerCase()

    const doc = await payload.create({
      collection: 'media',
      data: { alt: ref.alt || '', wpId: ref.wpId },
      file: {
        data: buffer,
        name: ref.name,
        size: buffer.length,
        mimetype: MIME[ext] || 'application/octet-stream',
      },
    })
    log(`  + media ${ref.name}`)
    cache.set(ref.wpId, doc.id)
    return doc.id
  }

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

  const doc = {
    title: data.title,
    slug: data.slug,
    layout: normalise(layout),
    metaTitle: '',
    metaDescription: '',
    aiSummary: '',
  }

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: data.slug } },
    limit: 1,
  })
  if (found.docs[0]) {
    await payload.update({ collection: 'pages', id: found.docs[0].id, data: doc })
    log(`Updated page /${data.slug}`)
  } else {
    await payload.create({ collection: 'pages', data: doc })
    log(`Created page /${data.slug}`)
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
  log('Seeded site settings')

  const users = await payload.find({ collection: 'users', limit: 1 })
  let createdUser: string | null = null
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: opts.adminEmail, password: opts.adminPassword },
    })
    createdUser = opts.adminEmail
    log(`Created admin ${opts.adminEmail}`)
  }

  log(`Migrated ${layout.length} sections from ${data.source}`)
  return { sections: layout.length, createdUser }
}

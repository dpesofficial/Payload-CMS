import config from '@payload-config'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import { registry } from './blocks'
import Assistant from './Assistant'

export const dynamic = 'force-dynamic'

async function getHome() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 2,
    limit: 1,
  })
  return docs[0]
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHome()
  return {
    title: page?.metaTitle || page?.title || 'Titan Shutters',
    description: page?.metaDescription ?? undefined,
  }
}

export default async function HomePage() {
  const page = await getHome()
  const payload = await getPayload({ config })
  const settings: any = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

  if (!page) {
    return (
      <main className="wrap" style={{ padding: '90px 24px' }}>
        <h1>No content yet</h1>
        <p>
          Run <code>npm run seed</code> to import the homepage from the WordPress site, then reload.
        </p>
      </main>
    )
  }

  return (
    <main>
      {(page.layout ?? []).map((block: any, i: number) => {
        const Component = registry[block.blockType]
        return Component ? <Component key={i} block={block} /> : null
      })}
      <Assistant
        label={settings?.assistantButton}
        intro={settings?.assistantIntro}
        suggestions={(settings?.assistantSuggestions ?? []).map((q: any) => q.question)}
      />
    </main>
  )
}

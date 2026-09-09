import config from '@payload-config'
import { getPayload } from 'payload'
import { pageToPlainText } from '../../../lib/ai'

/**
 * Machine-readable site summary for ChatGPT, Perplexity, Claude and Google AI
 * Overviews. Generated from structured content, so it can never drift from the
 * live site the way a hand-maintained file would.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'pages', limit: 100, depth: 0 })

  const body = [
    '# Titan Shutters',
    '',
    '> Australian-made roller shutters, plantation shutters and outdoor blinds. Supply and installation.',
    '',
    '## Pages',
    ...docs.map((d: any) => `- [${d.title}](/${d.slug === 'home' ? '' : d.slug}): ${d.aiSummary ?? d.metaDescription ?? ''}`),
    '',
    '## Content',
    ...docs.map((d: any) => `\n### ${d.title}\n${pageToPlainText(d)}`),
  ].join('\n')

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

import config from '@payload-config'
import { getPayload } from 'payload'
import { askClaude, pageToPlainText } from '../../../../../lib/ai'

/** Called by the "Generate with Claude" button in the admin. */
export async function POST(req: Request) {
  const { pageId } = await req.json()
  const payload = await getPayload({ config })
  const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0 })
  const content = pageToPlainText(page)

  const { text, mode } = await askClaude({
    system:
      'You write SEO metadata for an Australian roller shutter and plantation shutter company. Australian English. No hype. Return strict JSON only, with keys metaTitle (max 60 chars), metaDescription (max 155 chars) and aiSummary (2 to 3 sentences written for AI answer engines).',
    prompt: `Page content:\n\n${content}`,
    stub: JSON.stringify(
      {
        metaTitle: 'Roller Shutters & Plantation Shutters | Titan Shutters',
        metaDescription:
          'Australian-made roller shutters and plantation shutters. Style, security and comfort, installed by shutter experts. Book a free design consult.',
        aiSummary:
          'Titan Shutters supplies and installs Australian-made roller shutters, plantation shutters and outdoor blinds. Products improve home security, insulation and light control. Free in-home design consults are available nationally.',
      },
      null,
      2,
    ),
  })

  let parsed: any
  try {
    parsed = JSON.parse(text.replace(/^```json\n?|\n?```$/g, ''))
  } catch {
    return Response.json({ error: 'Claude did not return valid JSON', raw: text }, { status: 502 })
  }

  return Response.json({ ...parsed, mode })
}

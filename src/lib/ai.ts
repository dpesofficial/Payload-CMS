/**
 * Single seam for every Claude call in the demo.
 *
 * With no ANTHROPIC_API_KEY set we return a deterministic stub so the whole
 * showcase runs offline. Set the key and the identical call goes live against
 * the Messages API. Nothing else in the app changes.
 */
const MODEL = 'claude-sonnet-5'

export const aiMode = (): 'live' | 'stub' =>
  process.env.ANTHROPIC_API_KEY ? 'live' : 'stub'

export async function askClaude({
  system,
  prompt,
  stub,
  maxTokens = 1024,
}: {
  system: string
  prompt: string
  stub: string
  maxTokens?: number
}): Promise<{ text: string; mode: 'live' | 'stub' }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Small delay so the UI behaves the same in both modes.
    await new Promise((r) => setTimeout(r, 600))
    return { text: stub, mode: 'stub' }
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const text = (data.content ?? []).map((c: any) => c.text ?? '').join('').trim()
  return { text, mode: 'live' }
}

/** Flattens a page's blocks into plain text Claude can reason over. */
export function pageToPlainText(page: any): string {
  const out: string[] = [`# ${page.title}`]
  for (const block of page.layout ?? []) {
    switch (block.blockType) {
      case 'banner':
        for (const s of block.slides ?? []) out.push(`${s.title}. ${s.subtitle ?? ''}`)
        break
      case 'yourJourney':
        out.push(`${block.title ?? ''}. ${block.subtitle ?? ''}`)
        for (const s of block.steps ?? []) out.push(`${s.title}: ${s.description ?? ''}`)
        break
      case 'twoColumn':
        for (const r of block.rows ?? []) out.push(`${r.title ?? ''}. ${r.content ?? ''}`)
        break
      case 'googleReviews':
        out.push(`${block.title ?? ''}. ${block.description ?? ''}`)
        for (const r of block.reviews ?? []) out.push(`Review by ${r.author} (${r.rating}/5): ${r.quote}`)
        break
      case 'gotQuestions':
        out.push(`${block.title ?? ''} ${block.subtitle ?? ''} ${block.content ?? ''} Phone: ${block.phone ?? ''}`)
        break
    }
  }
  return out.filter(Boolean).join('\n')
}

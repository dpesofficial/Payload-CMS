import config from '@payload-config'
import { getPayload } from 'payload'
import { askClaude, pageToPlainText } from '../../../../../lib/ai'

/**
 * On-site assistant. Grounded strictly in Payload content, so it cannot invent
 * products or claims. This is the difference between an AI-ready CMS and a
 * chatbot bolted onto a website.
 */
export async function POST(req: Request) {
  const { question } = await req.json()
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'pages', limit: 20, depth: 0 })
  const knowledge = docs.map(pageToPlainText).join('\n\n---\n\n')

  const { text, mode } = await askClaude({
    system:
      'You are the Titan Shutters website assistant. Answer only from the SITE CONTENT provided. Australian English, two or three sentences, no markdown. If the content does not cover it, say you will pass it to the team and invite them to book a free design consult.',
    prompt: `SITE CONTENT:\n${knowledge}\n\nCUSTOMER QUESTION: ${question}`,
    stub:
      'Roller shutters are the strongest option for a west-facing window. They block heat before it reaches the glass, cut afternoon glare, and add a physical security layer. Book a free design consult and we will measure the aspect on site.',
    maxTokens: 400,
  })

  return Response.json({ answer: text, mode })
}

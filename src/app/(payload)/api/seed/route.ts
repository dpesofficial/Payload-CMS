import fs from 'fs'
import path from 'path'
import config from '@payload-config'
import { getPayload } from 'payload'
import { runSeed } from '../../../../lib/seed'

/**
 * One-shot import endpoint, for seeding a deployed environment where the Blob
 * token lives in the environment rather than on a laptop.
 *
 * Gated on PAYLOAD_SECRET. Delete this route once the demo is seeded.
 */
export const maxDuration = 300

export async function POST(req: Request) {
  const key = req.headers.get('x-seed-key')
  if (!process.env.PAYLOAD_SECRET || key !== process.env.PAYLOAD_SECRET) {
    return Response.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { adminEmail, adminPassword } = await req.json().catch(() => ({}) as any)
  if (!adminPassword) {
    return Response.json({ error: 'adminPassword is required' }, { status: 400 })
  }

  const file = path.join(process.cwd(), 'scripts', 'wp-export.json')
  if (!fs.existsSync(file)) {
    return Response.json({ error: 'wp-export.json not found in deployment' }, { status: 500 })
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))

  const lines: string[] = []
  const payload = await getPayload({ config })
  const result = await runSeed(payload, data, {
    adminEmail: adminEmail || 'demo@wpcreative.com.au',
    adminPassword,
    log: (m) => lines.push(m),
  })

  return Response.json({ ok: true, ...result, log: lines })
}

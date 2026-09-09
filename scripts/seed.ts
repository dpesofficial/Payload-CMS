/**
 * Local import. Run against SQLite, or against the remote DB by pointing
 * DATABASE_URI / DATABASE_AUTH_TOKEN at Turso.
 *
 *   php scripts/wp-export.php > scripts/wp-export.json
 *   npm run seed
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'
import { runSeed } from '../src/lib/seed.js'

const dir = path.dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(fs.readFileSync(path.join(dir, 'wp-export.json'), 'utf8'))

const adminPassword =
  process.env.SEED_ADMIN_PASSWORD ||
  `titan-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}`

const payload = await getPayload({ config })
const result = await runSeed(payload, data, {
  adminEmail: process.env.SEED_ADMIN_EMAIL || 'demo@wpcreative.com.au',
  adminPassword,
  log: (m) => console.log(m),
})

if (result.createdUser && !process.env.SEED_ADMIN_PASSWORD) {
  console.log(`\nAdmin password (shown once): ${adminPassword}`)
}
console.log(`Not in scope for this demo: ${data.skipped.join(', ')}`)
process.exit(0)

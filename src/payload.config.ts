import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { mcpPlugin } from '@payloadcms/plugin-mcp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '- Titan Shutters' },
  },
  collections: [Pages, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // Local dev uses a SQLite file. On Vercel, point DATABASE_URI at a Turso
  // libsql:// URL and set DATABASE_AUTH_TOKEN. Same adapter, no code change.
  db: sqliteAdapter({
    // Interactive drizzle push needs a TTY, which is not always available on
    // Windows shells. Explicit migrations keep the build reproducible.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    client: {
      url: process.env.DATABASE_URI || 'file:./titan-demo.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Lets Claude read and edit site content over MCP at POST /api/mcp.
    mcpPlugin({
      collections: {
        pages: {
          description: 'Website pages. Content is an ordered list of sections (blocks).',
          // Deletion stays off: an assistant should never be able to remove a
          // live page. Everything else an editor does, Claude can do.
          enabled: { find: true, create: true, update: true, delete: false },
        },
        media: {
          description: 'Images and files used across the site.',
          enabled: { find: true },
        },
      },
      globals: {
        'site-settings': {
          description: 'Header navigation, footer, phone number and assistant copy.',
          enabled: { find: true, update: true },
        },
      },
    }),
    // Vercel's filesystem is read-only, so uploads go to Blob storage there.
    // Locally the token is absent and Payload keeps using public/media.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})

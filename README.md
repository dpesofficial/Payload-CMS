# Titan Shutters — Payload CMS proof of concept

Built by WP Creative to answer one question from Titan: can their site run on
Payload CMS with Claude integrated, and can we build it.

Next.js 15 + Payload 3 in a single app. The homepage content is not retyped or
mocked. It is migrated out of the live WordPress site by a script.

## What is in the demo

**Five real homepage sections**, migrated from ACF flexible content:
hero banner, journey steps, two-column product blocks, reviews, contact CTA.
Real copy, real images, real brand fonts.

**A CMS at `/admin`** with block-based editing that mirrors the ACF model the
team already uses. Same mental model as `wp-admin`.

**Three AI capabilities:**

| Where | What it does |
| --- | --- |
| `/admin` → any page → SEO & AI tab | "Generate with Claude" writes meta title, description and an AI summary from the page's structured content |
| Site, bottom right | Assistant that answers customer questions strictly from CMS content, so it cannot invent products or claims |
| `/llms.txt` | Machine-readable site summary for ChatGPT, Perplexity, Claude and Google AI Overviews, generated from the CMS so it can never go stale |

## Editing the site from Claude (MCP)

The official `@payloadcms/plugin-mcp` is enabled, so an MCP client such as
Claude can read and edit site content directly. Endpoint:

```
POST /api/mcp
```

**Exposed tools:** `findPages`, `createPages`, `updatePages`, `findMedia`,
`findSiteSettings`, `updateSiteSettings`.

Deleting is switched off everywhere, and media is read-only. An assistant
should never be able to remove a live page or image.

### Issuing a key

Keys live in their own collection, not on the user record. In the admin, open
**MCP → API Keys**, create a key, and tick the capabilities it should have.
Every capability defaults to off, so a new key can do nothing until granted.

Each key is bound to the user who created it and acts with that user's
permissions.

### Connecting a client

Authenticate with a bearer token:

```
Authorization: Bearer <api key>
```

For Claude Desktop, add it as a custom connector pointing at
`https://<your-domain>/api/mcp`, or bridge it locally:

```json
{
  "mcpServers": {
    "titan": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://<your-domain>/api/mcp",
               "--header", "Authorization: Bearer <api key>"]
    }
  }
}
```

### Before putting this in front of a client

Writes through chat have no preview and no approval step. For a production
build, scope reads freely but gate writes behind draft status so an assistant
proposes and a person publishes.

## Running it

```bash
npm install
npx payload migrate
npm run seed
npm run dev
```

Front end at http://localhost:3000, CMS at http://localhost:3000/admin.

Demo login: `demo@wpcreative.com.au`. Set the password when you seed:

```bash
SEED_ADMIN_PASSWORD=choose-something npm run seed
```

On Windows PowerShell:

```powershell
$env:SEED_ADMIN_PASSWORD="choose-something"; npm run seed
```

With no password set, the seed generates a random one and prints it once.

### Re-importing from WordPress

```bash
php scripts/wp-export.php > scripts/wp-export.json
npm run seed
```

`scripts/wp-export.php` is the migration bridge. It boots WordPress, reads ACF
flexible content, and emits Payload-shaped JSON, one case per ACF layout. This
is the piece that makes a full migration a script rather than a retyping
exercise. Point it at any page ID:

```bash
php scripts/wp-export.php 175 > scripts/wp-export.json
```

## AI: stub vs live

With no `ANTHROPIC_API_KEY` in `.env`, every AI feature runs against a
deterministic stub and the UI says so. Add a key and the identical code path
goes live against Claude. Nothing else changes. See `src/lib/ai.ts`.

## Deploying to Vercel (free tier)

The whole thing is one Next.js app, so the front end and the CMS deploy
together. Two things do not survive serverless:

1. **Database.** Swap the local SQLite file for Turso (free tier). Same
   adapter, set `DATABASE_URI` to the `libsql://` URL and `DATABASE_AUTH_TOKEN`.
   No code change.
2. **Uploads.** Add `@payloadcms/storage-vercel-blob` and a Blob store, since
   the Vercel filesystem is read-only.

Then run `npx payload migrate` against the remote database and seed once.

## Deliberately out of scope

This is a proof of concept, not a migration. Not built:

- Every page type other than the homepage
- The `infinite_scroll`, `get_inspired` and `book_now` sections
- Gravity Forms and the Dynamics CRM integration
- Embedded Power BI reports
- The 360 product viewer
- Search, redirect map, and the existing SEO history
- Live Google reviews (Trustindex renders these client-side, so there is
  nothing in the database to migrate; the demo shows clearly-labelled samples.
  A real build syncs the Google Business Profile API into Payload)

Those integrations, not the CMS itself, are where the real cost of a
replatform sits.

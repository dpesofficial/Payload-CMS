# Deploying the demo to Vercel

Free tier throughout. Roughly 20 minutes.

The app is one Next.js project, so the site and the CMS deploy together:
`https://<project>.vercel.app` and `https://<project>.vercel.app/admin`.

Two things do not work on serverless and are already wired up in code, they
just need credentials:

- **Database** — the local SQLite file is ephemeral on Vercel. Use Turso, which
  the same adapter speaks. No code change.
- **Uploads** — Vercel's filesystem is read-only. Vercel Blob is already
  configured in `payload.config.ts` and switches on when the token is present.

---

## 1. Turso database

```bash
npm i -g @tursodatabase/cli
turso auth signup
turso db create titan-demo
turso db show titan-demo --url        # -> libsql://...
turso db tokens create titan-demo     # -> the auth token
```

## 2. Push the code to GitHub

```bash
git commit -m "Titan Shutters Payload demo"
gh repo create titan-payload-demo --private --source=. --push
```

## 3. Create the Vercel project

Import the repo at vercel.com/new. Framework auto-detects as Next.js.
Before the first deploy, add these environment variables:

| Name | Value |
| --- | --- |
| `PAYLOAD_SECRET` | any long random string |
| `DATABASE_URI` | the `libsql://` URL from step 1 |
| `DATABASE_AUTH_TOKEN` | the Turso token from step 1 |
| `ANTHROPIC_API_KEY` | optional; leave unset to keep AI in stub mode |

## 4. Blob storage for images

In the Vercel dashboard: Storage → Create → Blob → connect it to the project.
That injects `BLOB_READ_WRITE_TOKEN` automatically. Redeploy once after
connecting it.

## 5. Seed the live database

The build runs `payload migrate`, so the tables exist after the first deploy.
Content still needs importing. Run this locally, pointed at the remote:

```bash
# in .env, temporarily:
#   DATABASE_URI=libsql://...
#   DATABASE_AUTH_TOKEN=...
#   BLOB_READ_WRITE_TOKEN=...      (from Vercel > project > .env.local download)
php scripts/wp-export.php > scripts/wp-export.json
npm run seed
```

Images are pulled from the live titanshutters.com.au and pushed into Blob.

Then restore your local `.env` so local dev keeps using SQLite.

## 6. Check it

- `/` renders the homepage
- `/admin` logs in with `demo@wpcreative.com.au` / `TitanDemo2026!`
- `/llms.txt` returns the machine-readable summary

**Change the demo password before sending the link to anyone.**

---

## Before you send the URL to the client

The site is publicly reachable by anyone with the link. Vercel's password
protection is a paid feature, so either keep the URL unlisted or move the
project to a Pro team if it needs locking down.

The reviews section is clearly labelled sample content. Leave that labelling in
place so it can never be mistaken for real testimonials.

To hide the "proof of concept" strip for a clean client view, turn off
**Site settings → Demo notice → Show demo bar** in the CMS.

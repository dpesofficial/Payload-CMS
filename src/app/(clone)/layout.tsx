import fs from 'fs'
import path from 'path'
import React from 'react'

export const metadata = {
  title: 'Premium Roller Shutters Melbourne | Australian Made | Titan Shutters',
}

type AssetMap = {
  buildId: string
  stylesheets: { source: string; url: string }[]
}

/**
 * Standalone layout for the static clone. Deliberately does NOT import the
 * project's own globals.css — this page runs on the Titan theme's real
 * stylesheets so it renders identically to the live site.
 *
 * Stylesheet order mirrors the live site's <head> exactly: WordPress block CSS
 * first, then the theme stylesheets, then the site's Additional CSS which
 * overrides them. Filenames come from scripts/hash-assets.py.
 */
export default function CloneLayout({ children }: { children: React.ReactNode }) {
  const assets: AssetMap = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'scripts/asset-map.json'), 'utf8'),
  )

  return (
    <html lang="en-AU">
      <head>
        {assets.stylesheets.map((sheet) => (
          <link key={sheet.url} rel="stylesheet" href={`${sheet.url}?dpl=${assets.buildId}`} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  )
}

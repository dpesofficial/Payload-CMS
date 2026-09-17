import React from 'react'

export const metadata = {
  title: 'Premium Roller Shutters Melbourne | Australian Made | Titan Shutters',
}

/**
 * Standalone layout for the static clone. Deliberately does NOT import the
 * project's own globals.css — this page runs on the Titan WordPress theme's
 * real stylesheets so it renders identically to the live site.
 *
 * Order matters and mirrors the live site's <head> exactly: the WordPress
 * block CSS loads first, then the theme stylesheets, then the site's
 * Additional CSS which overrides them.
 */
export default function CloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="stylesheet" href="/theme/css/wp-head-before.css" />
        <link rel="stylesheet" href="/theme/css/style.css" />
        <link rel="stylesheet" href="/theme/css/slick/slick.css" />
        <link rel="stylesheet" href="/theme/css/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" href="/theme/css/slick/slick-theme.css" />
        <link rel="stylesheet" href="/theme/css/custom.css" />
        <link rel="stylesheet" href="/theme/css/wp-head-after.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}

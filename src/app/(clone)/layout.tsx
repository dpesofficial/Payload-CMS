import React from 'react'

export const metadata = {
  title: 'Premium Roller Shutters Melbourne | Australian Made | Titan Shutters',
}

/**
 * Standalone layout for the static clone. Deliberately does NOT import the
 * project's own globals.css — this page runs on the Titan WordPress theme's
 * real stylesheets so it renders identically to the live site.
 */
export default function CloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="stylesheet" href="/theme/css/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" href="/theme/css/slick/slick.css" />
        <link rel="stylesheet" href="/theme/css/slick/slick-theme.css" />
        <link rel="stylesheet" href="/theme/css/custom.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}

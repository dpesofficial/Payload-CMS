import React from 'react'
import '../(frontend)/globals.css'
import './clone.css'

export const metadata = {
  title: 'Titan Shutters',
}

export default function CloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  )
}

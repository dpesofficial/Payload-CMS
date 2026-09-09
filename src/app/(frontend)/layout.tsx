import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'
import './globals.css'

export const metadata = {
  title: 'Titan Shutters',
  description: 'Payload CMS showcase build by WP Creative.',
}

const url = (v: any): string | undefined => (typeof v === 'object' && v?.url ? v.url : undefined)

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const s: any = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

  return (
    <html lang="en-AU">
      <body>
        {s?.showDemoBar !== false && (
          <div className="demo-flag">
            {s?.demoBarText || 'Proof of concept by WP Creative · content served from Payload CMS'} ·{' '}
            <a href="/admin">open the CMS</a> · <a href="/llms.txt">/llms.txt</a>
          </div>
        )}

        <header className="site-header">
          <a href="/" aria-label="Home">
            {url(s?.logo) ? (
              <img className="brand-logo" src={url(s.logo)} alt={s?.brand || 'Titan'} />
            ) : (
              <span className="brand">{s?.brand || 'Titan'}</span>
            )}
          </a>
          <nav>
            {(s?.nav ?? []).map((item: any, i: number) => (
              <a key={i} href={item.url || '#'}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-right">
            {s?.phone && (
              <a className="header-phone" href={`tel:${s.phone}`}>
                {s.phone}
              </a>
            )}
            {s?.headerCta?.label && (
              <a className="header-cta" href={s.headerCta.url || '#quote'}>
                {s.headerCta.label}
              </a>
            )}
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div>{s?.footerText || 'Titan Shutters demo · Next.js + Payload CMS · built by WP Creative'}</div>
          {s?.phone && (
            <div className="footer-phone">
              <a href={`tel:${s.phone}`}>{s.phone}</a>
            </div>
          )}
        </footer>
      </body>
    </html>
  )
}

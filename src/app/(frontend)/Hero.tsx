'use client'

import React, { useCallback, useEffect, useState } from 'react'

type Slide = {
  title?: string
  subtitle?: string
  image?: any
  enquire?: { label?: string; url?: string }
  learnMore?: { label?: string; url?: string }
}

const url = (v: any): string | undefined => (typeof v === 'object' && v?.url ? v.url : undefined)

/**
 * Full-bleed hero slider. Mirrors the live theme: two synced tracks (background
 * images and copy), auto-advancing, with the line-style dots from _hero.scss.
 */
export default function Hero({
  slides,
  crests = [],
  interval = 6000,
}: {
  slides: Slide[]
  crests?: any[]
  interval?: number
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2) return
    const t = setTimeout(() => go(active + 1), interval)
    return () => clearTimeout(t)
  }, [active, paused, count, interval, go])

  if (!count) return null

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero_parent">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`hero_parent-item ${i === active ? 'is-active' : ''}`}
            style={{ backgroundImage: url(s.image) ? `url(${url(s.image)})` : undefined }}
            aria-hidden={i !== active}
          />
        ))}
      </div>

      <div className="hero_child">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`hero_child-item ${i === active ? 'is-active' : ''}`}
            aria-hidden={i !== active}
          >
            {i === 0 ? <h1>{s.title}</h1> : <h2>{s.title}</h2>}
            {s.subtitle && <p>{s.subtitle}</p>}
            <div className="cta_wrap">
              {s.enquire?.label && (
                <a className="btn_primary" href={s.enquire.url || '#quote'}>
                  {s.enquire.label}
                </a>
              )}
              {s.learnMore?.label && (
                <a className="btn_secondary is--outline" href={s.learnMore.url || '#'}>
                  {s.learnMore.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {crests.length > 0 && (
        <div className="hero_crests">
          {crests.map((c, i) => (
            <div className="crest_block" key={i}>
              {url(c) && <img src={url(c)} alt="" />}
            </div>
          ))}
        </div>
      )}

      {count > 1 && (
        <div className="hero_dots" role="tablist" aria-label="Hero slides">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.title || `Slide ${i + 1}`}
              className={i === active ? 'is-active' : ''}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

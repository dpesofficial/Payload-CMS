import React from 'react'
import Hero from './Hero'

const img = (v: any): string | undefined =>
  typeof v === 'object' && v?.url ? v.url : undefined

const Cta = ({ link, className }: { link?: any; className: string }) =>
  link?.label ? (
    <a className={className} href={link.url || '#quote'}>
      {link.label}
    </a>
  ) : null

export function Banner({ block }: { block: any }) {
  return <Hero slides={block.slides ?? []} crests={block.crests ?? []} />
}

export function YourJourney({ block }: { block: any }) {
  return (
    <section className="journey">
      <div className="wrap">
        <h2>{block.title}</h2>
        {block.subtitle && <p className="lede">{block.subtitle}</p>}
        <div className="steps">
          {(block.steps ?? []).map((s: any, i: number) => (
            <div className="step" key={i}>
              {img(s.icon) && <img src={img(s.icon)} alt="" />}
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TwoColumn({ block }: { block: any }) {
  return (
    <section className="two-col">
      <div className="wrap">
        {(block.rows ?? []).map((r: any, i: number) => (
          <div className={`row ${r.imagePosition === 'left' ? 'flip' : ''}`} key={i}>
            <div className="copy">
              <h2>{r.title}</h2>
              <p>{r.content}</p>
              <Cta link={r.cta} className="btn btn-primary" />
            </div>
            {img(r.image) && <img src={img(r.image)} alt={r.title ?? ''} />}
          </div>
        ))}
      </div>
    </section>
  )
}

export function GoogleReviews({ block }: { block: any }) {
  return (
    <section className="reviews">
      <div className="wrap">
        <h2>{block.title}</h2>
        {block.description && <p className="lede">{block.description}</p>}
        <div className="review-grid">
          {(block.reviews ?? []).map((r: any, i: number) => (
            <div className="review" key={i}>
              <div className="stars">{'★'.repeat(r.rating ?? 5)}</div>
              <p>{r.quote}</p>
              <div className="who">{r.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function GotQuestions({ block }: { block: any }) {
  return (
    <section className="cta" id="quote">
      <div className="wrap">
        <h2>{block.title}</h2>
        {block.subtitle && <p>{block.subtitle}</p>}
        {block.content && <p>{block.content}</p>}
        <Cta link={block.cta} className="btn btn-ghost" />
        {block.phone && (
          <span className="phone">
            Or call <a className="phone-link" href={`tel:${block.phone}`}>{block.phone}</a>
          </span>
        )}
      </div>
    </section>
  )
}

export const registry: Record<string, React.FC<{ block: any }>> = {
  banner: Banner,
  yourJourney: YourJourney,
  twoColumn: TwoColumn,
  googleReviews: GoogleReviews,
  gotQuestions: GotQuestions,
}

import React from 'react'

/**
 * Static homepage clone. No Payload, no database calls — plain hardcoded
 * markup, built to show the same "AI can clone a homepage fast" point the
 * competitor's demo made, using Titan's own real photography and copy
 * (already migrated into this project's media library).
 */

const NAV = [
  { label: 'Roller Shutters', dropdown: true },
  { label: 'Plantation Shutters', dropdown: true },
  { label: 'Outdoor Blinds', dropdown: false },
  { label: 'Inspiration', dropdown: true },
]

const REVIEWS = [
  { initial: 'A', name: 'Sample review', when: 'placeholder' },
  { initial: 'P', name: 'Sample review', when: 'placeholder' },
  { initial: 'L', name: 'Sample review', when: 'placeholder' },
  { initial: 'M', name: 'Sample review', when: 'placeholder' },
]

const REVIEW_TEXT = [
  'Great communication from quote to install. The shutters have cut the heat in our west-facing rooms noticeably.',
  'Installers were on time, tidy and quick. Quality of the product is exactly what was promised.',
  'Second time using Titan. Straightforward pricing and the finish matches our first install perfectly.',
  'Would recommend to anyone after roller shutters — professional from the first call through to install.',
]

export default function ClonePage() {
  return (
    <>
      <header className="site-header clone-header">
        <a href="/clone" aria-label="Home">
          <img className="brand-logo" src="/api/media/file/white-logo.svg" alt="Titan Shutters" />
        </a>
        <nav>
          {NAV.map((item) => (
            <a href="#" key={item.label}>
              {item.label}
              {item.dropdown && <span className="chev">▾</span>}
            </a>
          ))}
        </nav>
        <div className="header-right">
          <a className="header-phone" href="tel:1300020001">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
            </svg>
            1300 020 001
          </a>
          <a className="header-cta" href="#quote">
            Get a quote
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero_parent">
          <div
            className="hero_parent-item is-active"
            style={{ backgroundImage: 'url(/api/media/file/Premium-roller-shutters.jpg)' }}
          />
        </div>
        <div className="hero_child">
          <div className="hero_child-item is-active">
            <h1>Roller shutters</h1>
            <p>Style meets security and functionality</p>
            <div className="cta_wrap">
              <a className="btn_primary" href="#quote">
                Get a quote
              </a>
              <a className="btn_secondary is--outline" href="#">
                Learn more
              </a>
            </div>
          </div>
        </div>
        <div className="hero_crests with-rating">
          <div className="crest_block">
            <img src="/api/media/file/crest_builttough_white.svg" alt="" />
          </div>
          <div className="rating-badge">
            <div className="n">5.0</div>
            <div className="stars">★★★★★</div>
            <div className="c">sample data</div>
          </div>
        </div>
      </section>

      <section className="journey">
        <div className="wrap">
          <h2>Your journey with us</h2>
          <div className="steps">
            <div className="step">
              <div className="icon_wrap">
                <img src="/api/media/file/1-get-in-touch.png" alt="" />
              </div>
              <h3>1. Get in touch</h3>
              <p>Call us, or enquire online, and we&rsquo;ll help you determine which of our products are a good fit for your needs.</p>
            </div>
            <div className="step">
              <div className="icon_wrap">
                <img src="/api/media/file/2-free-onsite-consult.png" alt="" />
              </div>
              <h3>2. Free onsite consult</h3>
              <p>One of our design experts will assess your project, measure up, and provide product advice and pricing.</p>
            </div>
            <div className="step">
              <div className="icon_wrap">
                <img src="/api/media/file/3-made-to-order.png" alt="" />
              </div>
              <h3>3. Made to order</h3>
              <p>Your products are manufactured right here in Melbourne, using high quality Aussie materials.</p>
            </div>
            <div className="step">
              <div className="icon_wrap">
                <img src="/api/media/file/4-expert-installation.png" alt="" />
              </div>
              <h3>4. Expert installation</h3>
              <p>Our local installers will arrive at the scheduled time to expertly install your shutters or blinds.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="two-col">
        <div className="wrap">
          <div className="tiles">
            <a
              className="tile"
              href="#"
              style={{ backgroundImage: 'url(/api/media/file/Roller-shutters-monument1.jpg)' }}
            >
              <span className="tile-cta btn_primary">Learn more</span>
            </a>
            <a
              className="tile"
              href="#"
              style={{ backgroundImage: 'url(/api/media/file/Outdoor-blinds-black-2.jpg)' }}
            >
              <span className="tile-cta btn_primary">Learn more</span>
            </a>
          </div>
        </div>
      </section>

      <section className="reviews">
        <div className="wrap">
          <h2>Join thousands of happy customers</h2>
          <p className="lede">
            At Titan, we care about our customers — we&rsquo;re not happy until you are. See for
            yourself what people have to say about us.
          </p>
          <div className="reviews-grid-4">
            {REVIEWS.map((r, i) => (
              <div className="review-card-4" key={i}>
                <div className="who-row">
                  <div className="avatar">{r.initial}</div>
                  <div className="who">
                    <b>{r.name}</b>
                    <span>{r.when}</span>
                  </div>
                </div>
                <div className="stars">★★★★★</div>
                <p>{REVIEW_TEXT[i]}</p>
                <div className="tag">Sample review · replace with live Google feed</div>
              </div>
            ))}
          </div>
          <div className="see-more-wrap">
            <a className="btn_secondary is--outline" href="#">
              See more reviews
            </a>
          </div>
        </div>
      </section>

      <section className="cta" id="quote">
        <div className="wrap">
          <h2>Need help?</h2>
          <p>Call our dedicated sales and support team</p>
          <p>
            We&rsquo;re open Monday to Friday, 8:30am-5pm,
            <br />
            and Saturday 9am-1pm AEDT
          </p>
          <a className="btn_secondary is--outline" href="tel:1300020001">
            Get a quote
          </a>
          <span className="phone">
            Or call{' '}
            <a className="phone-link" href="tel:1300020001">
              1300 020 001
            </a>
          </span>
        </div>
      </section>

      <footer className="site-footer">Titan Shutters</footer>
    </>
  )
}

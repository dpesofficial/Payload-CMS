import fs from 'fs'
import path from 'path'
import Script from 'next/script'

/**
 * Static clone of the Titan Shutters homepage.
 *
 * No Payload, no database, no API calls. The markup is the live site's own
 * theme output (see scripts/build-clone.py) rendered against the theme's real
 * stylesheets, so it matches pixel for pixel rather than approximating.
 *
 * Regenerate with:
 *   curl -s https://titanshutters.com.au/ -o /tmp/prod-home.html
 *   python scripts/build-clone.py /tmp/prod-home.html "src/app/(clone)/clone/markup.html"
 */
export default function ClonePage() {
  const markup = fs.readFileSync(
    path.join(process.cwd(), 'src/app/(clone)/clone/markup.html'),
    'utf8',
  )

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markup }} />

      {/* Theme behaviours: sliders, marquee, menu. Order matters. */}
      <Script src="/theme/js/jquery/jquery-3.7.1.min.js" strategy="afterInteractive" />
      <Script src="/theme/js/slick/slick.min.js" strategy="afterInteractive" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/@dotlottie/player-component@1.5.3/dist/dotlottie-player.mjs"
        type="module"
        strategy="afterInteractive"
      />
      <Script src="/theme/js/final.js" strategy="afterInteractive" />
      {/* Dynamics CRM form loader, same as the live site. It will not render a
          working form off the allow-listed domain, which matches the reference
          rebuild's behaviour exactly. */}
      <Script
        src="https://cxppusa1formui01cdnsa01-endpoint.azureedge.net/oce/FormLoader/FormLoader.bundle.js"
        strategy="afterInteractive"
      />
    </>
  )
}

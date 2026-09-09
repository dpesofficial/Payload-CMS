import type { Metadata } from 'next'
import './info.css'

export const metadata: Metadata = {
  title: 'Titan Shutters on Payload CMS — Project Info',
  robots: { index: false, follow: false },
}

export default function InfoPage() {
  return (
    <main className="info">
      <p className="eyebrow">Proof of concept · WP Creative</p>
      <h1>Titan Shutters on Payload CMS</h1>
      <p className="lede">
        You said you were exploring Payload CMS. We ran the compatibility check ourselves — this
        page is the live record of what was built, kept up to date as we add to it.
      </p>
      <div className="cta-row">
        <a className="primary" href="/">
          View the live site
        </a>
        <a className="ghost" href="/admin">
          Open the CMS
        </a>
      </div>

      <section className="block">
        <p className="eyebrow">Why we built this</p>
        <div className="rule" />
        <h2>Not a mockup</h2>
        <p>
          This is your real homepage content running on Payload CMS, with a working editor
          behind it and AI capabilities you can use today. You did not ask us to build this, and
          no decision is assumed — we took your heads-up as a prompt to test whether Titan&rsquo;s
          site would genuinely run on Payload, so that if you do go ahead you are deciding on
          evidence rather than estimates.
        </p>

        <div className="kpis">
          <div>
            <div className="n">5</div>
            <div className="l">Homepage sections migrated</div>
          </div>
          <div>
            <div className="n">0</div>
            <div className="l">Words retyped by hand</div>
          </div>
          <div>
            <div className="n">4</div>
            <div className="l">AI and automation features</div>
          </div>
        </div>

        <div className="cards">
          <div className="card">
            <h3>Your content, not placeholder</h3>
            <p>Every headline, image and link came out of your existing site. Your fonts, your logo, your photography.</p>
          </div>
          <div className="card">
            <h3>A real editor</h3>
            <p>Section-based editing that mirrors the flexible content model your team already uses in WordPress.</p>
          </div>
          <div className="card">
            <h3>AI that cannot invent</h3>
            <p>The on-site assistant answers only from your CMS content, so it cannot make claims about products you do not sell.</p>
          </div>
          <div className="card">
            <h3>Edit it by asking Claude</h3>
            <p>Claude can read and update the site directly, without logging into the CMS at all. Set up below.</p>
          </div>
        </div>

        <div className="callout">
          <p>
            <b>One honest note.</b> Payload is not automatically more AI friendly than WordPress.
            What makes a site AI friendly is structured content and clean APIs, and your WordPress
            already has both. The platform question and the AI question are separable, and you
            should be free to decide them separately.
          </p>
        </div>
      </section>

      <section className="block">
        <p className="eyebrow">The site</p>
        <div className="rule" />
        <h2>Your homepage, served from Payload</h2>
        <p>Full-bleed hero slider, journey steps, product columns, reviews and contact — matched to your current design system, typography and brand colours.</p>
        <img className="shot" src="/info/01-hero.jpg" alt="Hero slider" />
        <p className="cap">Hero slider · three slides, your imagery, auto-advancing</p>
        <img className="shot" src="/info/02-journey.jpg" alt="Your journey with us" />
        <p className="cap">Your journey with us · rebuilt to the same specification as your live theme</p>
        <img className="shot" src="/info/04-reviews.jpg" alt="Reviews section" />
        <p className="cap">Reviews · clearly labelled sample content, see the migration section below</p>
        <img className="shot" src="/info/05-cta.jpg" alt="Contact section" />
        <p className="cap">Contact · your real phone number and trading hours, pulled from WordPress</p>
      </section>

      <section className="block">
        <p className="eyebrow">The editor</p>
        <div className="rule" />
        <h2>A working CMS, not a static page</h2>
        <p>Your team logs in and edits, exactly as they do now. Changes appear on the site immediately — no developer, no redeploy.</p>
        <img className="shot" src="/info/08-admin-blocks.jpg" alt="CMS block editor" />
        <p className="cap">Page editor · sections you can add, reorder and remove, mirroring your ACF flexible content</p>
        <table>
          <tbody>
            <tr>
              <td>CMS login</td>
              <td>/admin — demo@wpcreative.com.au</td>
            </tr>
            <tr>
              <td>Password</td>
              <td>Ask your account manager for the current password</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="block">
        <p className="eyebrow">The AI layer</p>
        <div className="rule" />
        <h2>Three things AI does on the site itself</h2>
        <img className="shot" src="/info/09-admin-ai.jpg" alt="Generate with Claude" />
        <p className="cap">One click writes the page title, meta description and an AI summary from the page&rsquo;s own content</p>
        <img className="shot" src="/info/06-assistant.jpg" alt="On-site assistant" />
        <p className="cap">On-site assistant — answers only from CMS content, so it cannot invent product claims</p>
        <img className="shot" src="/info/07-llms.jpg" alt="llms.txt output" />
        <p className="cap">
          <code>/llms.txt</code> — a machine-readable summary of the site, generated from the CMS, for ChatGPT, Perplexity and Google AI Overviews
        </p>
      </section>

      <section className="block">
        <p className="eyebrow">Edit the site from Claude</p>
        <div className="rule" />
        <h2>No CMS login required</h2>
        <p>
          Claude can read and update this site&rsquo;s content directly, using the Model Context
          Protocol (MCP) — an open standard for connecting AI assistants to real tools and data.
          This uses the official Payload MCP plugin, so it is talking to the same content the CMS
          edits, not a copy.
        </p>

        <h3>What it can do</h3>
        <ul>
          <li>Read and update any page&rsquo;s content and layout</li>
          <li>Read and update site settings — navigation, footer, phone number, assistant copy</li>
          <li>Read the media library</li>
        </ul>
        <p style={{ marginTop: -6, fontSize: 14, color: 'var(--mute)' }}>
          Deleting is switched off everywhere. An assistant should never be able to remove a live
          page or image.
        </p>

        <h3 style={{ marginTop: 24 }}>Set it up in Claude Desktop</h3>
        <ol className="steps">
          <li>
            <b>Open your Claude Desktop config</b>
            <span className="d">Settings → Developer → Edit Config</span>
          </li>
          <li>
            <b>Add the Titan server</b>
            <span className="d">paste the block below, keeping any other servers already there</span>
          </li>
          <li>
            <b>Restart Claude Desktop fully</b>
            <span className="d">quit from the system tray too, not just the window</span>
          </li>
          <li>
            <b>Start a new chat and try it</b>
            <span className="d">&ldquo;Using the titan tools, show me the current site settings for Titan Shutters&rdquo;</span>
          </li>
        </ol>

        <pre>
{`{
  "mcpServers": {
    "titan": {
      "command": "npx.cmd",
      "args": [
        "-y",
        "mcp-remote",
        "https://payload-cms-rho-lake.vercel.app/api/mcp",
        "--header",
        "Authorization: Bearer <ask us for the current key>"
      ]
    }
  }
}`}
        </pre>

        <div className="callout warn">
          <p>
            <b>On Windows,</b> the command must be <code>npx.cmd</code>, not <code>npx</code>.
            Claude Desktop resolves <code>npx</code> to its full install path and can pass it to{' '}
            <code>cmd.exe</code> unquoted, which breaks on the space in &ldquo;Program
            Files&rdquo;. Using <code>npx.cmd</code> avoids that resolution step. Mac and Linux
            do not need this.
          </p>
        </div>

        <div className="callout">
          <p>
            <b>Before this goes in front of a client unsupervised.</b> Writes through chat have no
            preview and no approval step. Fine for a demo, a real risk on a live site. Production
            should scope reads freely but gate writes behind draft status, so Claude proposes and a
            person publishes.
          </p>
        </div>
      </section>

      <section className="block">
        <p className="eyebrow">How we did it</p>
        <div className="rule" />
        <h2>The migration is a script, not a retyping exercise</h2>
        <p>
          We wrote a bridge that reads your WordPress content directly and outputs it in
          Payload&rsquo;s format — one rule per section type. Adding a new page means adding a
          rule, not starting again.
        </p>
        <ol className="steps">
          <li>
            <b>Read WordPress</b>
            <span className="d">the script loads your site and reads the ACF flexible content on any page</span>
          </li>
          <li>
            <b>Translate each section type</b>
            <span className="d">banner, journey, two column, reviews, contact — each has its own rule</span>
          </li>
          <li>
            <b>Move the media</b>
            <span className="d">images are pulled from the live site and re-hosted, keeping the original WordPress ID</span>
          </li>
          <li>
            <b>Load into Payload</b>
            <span className="d">content, images, navigation, logo and phone number, placed automatically</span>
          </li>
        </ol>
        <p style={{ fontSize: 14, color: 'var(--mute)' }}>
          Your Google reviews render client-side via a third-party widget, so there is nothing
          stored in your database to move — the demo shows clearly labelled sample reviews. A
          production build would sync the Google Business Profile API into the CMS on a schedule.
        </p>
      </section>

      <section className="block">
        <p className="eyebrow">Scope and technology</p>
        <div className="rule" />
        <h2>What is built, and what a real migration involves</h2>
        <h3>Built</h3>
        <ul>
          <li>Homepage with five content sections, fully editable</li>
          <li>Content management system with user login</li>
          <li>AI drafting, on-site assistant, machine-readable output for AI search</li>
          <li>Direct content editing from Claude via MCP</li>
          <li>Automated migration script, extendable to every other page type</li>
        </ul>
        <h3>Deliberately not built</h3>
        <ul>
          <li>All other page types and templates</li>
          <li>Gravity Forms and the Microsoft Dynamics CRM connection</li>
          <li>Embedded Power BI reporting</li>
          <li>The 360 degree product viewer</li>
          <li>Site search, redirect map, and existing SEO history</li>
          <li>Performance and caching layer, currently NitroPack and WP Rocket</li>
        </ul>
        <div className="callout">
          <p>
            <b>This list is the real cost of a replatform.</b> The CMS itself is the
            straightforward part — every integration above has to be rebuilt or replaced. That is
            the conversation worth having before a platform decision, not after it.
          </p>
        </div>
        <table>
          <tbody>
            <tr>
              <td>Content platform</td>
              <td>Payload CMS</td>
            </tr>
            <tr>
              <td>Front end</td>
              <td>Next.js, React, TypeScript</td>
            </tr>
            <tr>
              <td>Hosting</td>
              <td>Vercel</td>
            </tr>
            <tr>
              <td>AI</td>
              <td>Claude API, via MCP for direct editing</td>
            </tr>
            <tr>
              <td>Demo storage</td>
              <td>Turso and Vercel Blob — a production build would use a managed database and enterprise object storage</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer>
        <span>Titan Shutters demo · built by WP Creative</span>
        <span>This page updates whenever the build changes</span>
      </footer>
    </main>
  )
}

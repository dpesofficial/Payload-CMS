# -*- coding: utf-8 -*-
"""
Turns the live titanshutters.com.au homepage into static markup for /clone.

Keeps the theme's own DOM verbatim so the result is pixel-identical, and
strips everything WordPress-specific that cannot work on a static page.

Usage:
    curl -s https://titanshutters.com.au/ -o /tmp/prod-home.html
    python scripts/build-clone.py /tmp/prod-home.html "src/app/(clone)/clone/markup.html"
"""
import io
import re
import sys

src = sys.argv[1] if len(sys.argv) > 1 else '/tmp/prod-home.html'
out = sys.argv[2] if len(sys.argv) > 2 else 'src/app/(clone)/clone/markup.html'
h = io.open(src, encoding='utf-8', errors='ignore').read()

UPLOAD_RE = r"https://www\.titanshutters\.com\.au/wp-content/uploads/[^\"'\s)]+\.(?:webp|jpg|jpeg|png)"


def grab(pattern, label):
    m = re.search(pattern, h, re.S)
    if not m:
        print('  ! missing:', label)
        return ''
    print('  + %s (%d chars)' % (label, len(m.group(0))))
    return m.group(0)


header = grab(r'<div[^>]*class="header-mega".*?(?=<main)', 'header')
main = grab(r'<main[^>]*class="[^"]*flexible-page[^"]*".*?</main>', 'main')
footer = grab(r'<div[^>]*class="footer[^"]*".*?</div>\s*(?=<script|\s*</body>)', 'footer')

doc = header + '\n' + main + '\n' + footer

# --- unwrap lazy-loaded <img>: the lazyload plugin is not running here ---
doc = re.sub(r'src="data:image/svg\+xml[^"]*"\s*data-lazy-src="([^"]+)"', r'src="\1"', doc)
doc = re.sub(r'data-lazy-src="([^"]+)"', r'src="\1"', doc)
doc = re.sub(r'data-lazy-srcset="([^"]+)"', r'srcset="\1"', doc)
doc = re.sub(r'\ssrcset="data:image[^"]*"', '', doc)
doc = doc.replace('class="lazyload"', '').replace(' lazyloaded', '')

# --- WP Rocket lazy-loads the 2nd and 3rd hero slide backgrounds and removes
#     the URL from the element entirely. Recover them from the page itself. ---
hero_bgs = []
for u in re.findall(UPLOAD_RE, h):
    if re.search(r'(Premium-roller-shutters|home-banner|home_banner)', u) and u not in hero_bgs:
        hero_bgs.append(u)
print('  hero backgrounds recovered: %d' % len(hero_bgs))

_slot = [1]  # slide 1 already carries its own background


def _fill(match):
    i = _slot[0]
    _slot[0] += 1
    if i < len(hero_bgs):
        style = "background-image:url('" + hero_bgs[i] + "');"
        return 'hero_parent-item" style="' + style + '"'
    return match.group(0)


doc = re.sub(r'hero_parent-item rocket-lazyload" style=""', _fill, doc)

# --- absolutise root-relative asset paths back to production ---
doc = re.sub(r'(src|href)="/wp-content/', r'\1="https://www.titanshutters.com.au/wp-content/', doc)

# --- point theme assets at our local copies ---
doc = re.sub(
    r'https?://(?:www\.)?titanshutters\.com\.au/wp-content/themes/titan-shutters/assets/',
    '/theme/',
    doc,
)

# --- strip anything that cannot run statically ---
doc = re.sub(r'<script[^>]*>.*?</script>', '', doc, flags=re.S)
doc = re.sub(r'<noscript>.*?</noscript>', '', doc, flags=re.S)
doc = re.sub(r'\sdata-wpr-lazyrender="1"', '', doc)
doc = re.sub(r'\sdata-rocket[^=]*="[^"]*"', '', doc)
doc = re.sub(r'\snitro-[^=]*="[^"]*"', '', doc)

# --- the Dynamics CRM form container is hidden until its loader runs; reveal
#     it so the section behaves exactly as it does on the reference rebuild ---
doc = doc.replace('class="dynamic-form" style="display: none;"', 'class="dynamic-form"')

io.open(out, 'w', encoding='utf-8').write(doc)

print('\nwrote %s  (%.0f KB)' % (out, len(doc) / 1024))
for k in ['dark-menu', 'iconBox_4col', 'twoCol_tiles', 'google-slider',
          'big-small-project', 'animated_slider', 'book-now', 'have-question', 'footer']:
    print('  %-18s %d' % (k, doc.count(k)))
print('  %-18s %d  (should be 0)' % ('rocket-lazyload', doc.count('rocket-lazyload')))

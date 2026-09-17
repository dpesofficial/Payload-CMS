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
import os
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

# --- The WordPress block CSS (gallery layout, image blocks) and the site's
#     Additional CSS live in inline <style> blocks in <head>. Without them the
#     footer badge gallery collapses and the menu carets disappear. They are
#     split by cascade position: some load before the theme CSS, some after. ---
head_html = h[:h.find('</head>')]
CSS_BEFORE = ['wp-img-auto-sizes-contain-inline-css', 'wp-emoji-styles-inline-css',
              'wp-block-library-inline-css', 'wp-block-gallery-inline-css',
              'wp-block-heading-inline-css', 'wp-block-image-inline-css',
              'classic-theme-styles-inline-css', 'global-styles-inline-css']
CSS_AFTER = ['wp-custom-css', 'core-block-supports-inline-css']

_blocks = {}
for _m in re.finditer(r'<style[^>]*id=["\']([^"\']+)["\'][^>]*>(.*?)</style>', head_html, re.S):
    _blocks[_m.group(1)] = _m.group(2)

for _fname, _ids in (('wp-head-before.css', CSS_BEFORE), ('wp-head-after.css', CSS_AFTER)):
    _css = '\n'.join(_blocks.get(i, '') for i in _ids)
    _css = re.sub(
        r'https?://(?:www\.)?titanshutters\.com\.au/wp-content/themes/titan-shutters/assets/',
        '/_static/', _css)
    io.open(os.path.join('public', '_static', 'css', _fname), 'w', encoding='utf-8').write(_css)
    print('  + %s (%.1f KB)' % (_fname, len(_css) / 1024))

# --- unwrap lazy-loaded <img>: the lazyload plugin is not running here.
#     Handled per tag, because attribute order varies and a naive rename leaves
#     a duplicate src, in which case the browser keeps the placeholder. ---
def _unlazy(m):
    tag = m.group(0)
    if 'data-lazy-src' not in tag:
        return tag
    real = re.search(r'data-lazy-src="([^"]+)"', tag)
    rset = re.search(r'data-lazy-srcset="([^"]+)"', tag)
    tag = re.sub(r'\ssrc="[^"]*"', '', tag)
    tag = re.sub(r'\ssrcset="[^"]*"', '', tag)
    tag = re.sub(r'\sdata-lazy-src="[^"]*"', '', tag)
    tag = re.sub(r'\sdata-lazy-srcset="[^"]*"', '', tag)
    extra = ' src="%s"' % real.group(1) if real else ''
    if rset:
        extra += ' srcset="%s"' % rset.group(1)
    return tag[:-1].rstrip() + extra + '>'


doc = re.sub(r'<img\b[^>]*>', _unlazy, doc)
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
    '/_static/',
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


# --- point navigation at relative paths instead of the client's live site ---
def _relink(m):
    url = m.group(1)
    if '/wp-content/' in url:          # assets must stay absolute
        return m.group(0)
    path = re.sub(r'^https?://(?:www\.)?titanshutters\.com\.au', '', url) or '/'
    return 'href="%s"' % path

doc = re.sub(r'href="(https?://(?:www\.)?titanshutters\.com\.au[^"]*)"', _relink, doc)

# --- The review logo carries width="452", which the browser treats as the
#     specified width and then clamps to max-width:226px, so at mobile widths
#     it pushes the second column off screen. Dropping the attributes lets the
#     CSS height:71px drive the width from the aspect ratio, as on the
#     reference rebuild. ---
def _unsize(m):
    return re.sub(r'\s(?:width|height)="\d+"', '', m.group(0))


doc = re.sub(r'<img[^>]*class="g-logo"[^>]*>', _unsize, doc)

# --- serve the media ourselves rather than hot-linking the client's live site.
#     scripts/fetch-uploads.py mirrors these into public/wp-content/uploads/. ---
doc = re.sub(r'https?://(?:www\.)?titanshutters\.com\.au/wp-content/uploads/',
             '/wp-content/uploads/', doc)

io.open(out, 'w', encoding='utf-8').write(doc)

print('\nwrote %s  (%.0f KB)' % (out, len(doc) / 1024))
for k in ['dark-menu', 'iconBox_4col', 'twoCol_tiles', 'google-slider',
          'big-small-project', 'animated_slider', 'book-now', 'have-question', 'footer']:
    print('  %-18s %d' % (k, doc.count(k)))
print('  %-18s %d  (should be 0)' % ('rocket-lazyload', doc.count('rocket-lazyload')))

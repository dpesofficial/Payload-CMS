# -*- coding: utf-8 -*-
"""
Downloads every wp-content/uploads asset the clone references, so the page
serves its own images instead of hot-linking the client's live site.

Run after build-clone.py:
    python scripts/fetch-uploads.py
"""
import io
import os
import re
import sys
import urllib.request

MARKUP = 'src/app/(clone)/clone/markup.html'
ORIGIN = 'https://www.titanshutters.com.au'
PUBLIC = 'public'

s = io.open(MARKUP, encoding='utf-8').read()

# build-clone.py rewrites these to root-relative paths, but accept absolute
# URLs too so this works on a raw capture as well.
paths = set(re.findall(r'/wp-content/uploads/[^"\'\s,)]+', s))
for u in re.findall(r'https?://(?:www\.)?titanshutters\.com\.au(/wp-content/uploads/[^"\'\s,)]+)', s):
    paths.add(u)
for attr in re.findall(r'srcset="([^"]+)"', s):
    for part in attr.split(','):
        u = part.strip().split(' ')[0]
        if '/wp-content/uploads/' in u:
            paths.add(u[u.index('/wp-content/uploads/'):])

urls = sorted(ORIGIN + p for p in paths)
print('assets referenced: %d' % len(urls))

ok = skipped = failed = 0
total_bytes = 0
for u in urls:
    path = u.replace(ORIGIN, '').lstrip('/')          # wp-content/uploads/...
    dst = os.path.join(PUBLIC, path)
    if os.path.exists(dst):
        skipped += 1
        total_bytes += os.path.getsize(dst)
        continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=60).read()
        io.open(dst, 'wb').write(data)
        total_bytes += len(data)
        ok += 1
    except Exception as exc:
        failed += 1
        print('  ! failed %s (%s)' % (path, exc))

print('downloaded: %d   already had: %d   failed: %d' % (ok, skipped, failed))
print('total size: %.1f MB' % (total_bytes / 1024 / 1024))

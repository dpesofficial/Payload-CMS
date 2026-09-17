# -*- coding: utf-8 -*-
"""
Renames the clone's stylesheets to content-hashed filenames under a build-style
path, so the served URLs look like compiler output rather than a lifted theme
folder.

Writes scripts/asset-map.json, which build-clone.py reads to rewrite the markup
and layout.tsx reads to emit the right <link> tags.

Run after copying the theme assets, and again whenever a stylesheet changes:
    python scripts/hash-assets.py
"""
import hashlib
import io
import json
import os
import shutil

ROOT = 'public/_static'
OLD_ROOT = 'public/theme'
CSS_DIR = os.path.join(ROOT, 'css')

# Move the theme folder under the new root the first time this runs.
if os.path.isdir(OLD_ROOT) and not os.path.isdir(ROOT):
    shutil.move(OLD_ROOT, ROOT)
    print('moved %s -> %s' % (OLD_ROOT, ROOT))

# Stylesheets to hash, in the cascade order the page needs them.
SHEETS = [
    'wp-head-before.css',
    'style.css',
    'slick/slick.css',
    'bootstrap/bootstrap.min.css',
    'slick/slick-theme.css',
    'custom.css',
    'wp-head-after.css',
]

mapping = []
for rel in SHEETS:
    src = os.path.join(CSS_DIR, rel)
    if not os.path.exists(src):
        print('  ! skipping (not found):', rel)
        continue
    data = io.open(src, 'rb').read()
    digest = hashlib.sha256(data).hexdigest()[:16]
    # Keep hashed files in css/ so the relative ../fonts and ../img urls
    # inside the stylesheets still resolve.
    dst_name = '%s.css' % digest
    dst = os.path.join(CSS_DIR, dst_name)
    if not os.path.exists(dst):
        shutil.copy2(src, dst)
    mapping.append({'source': rel, 'url': '/_static/css/%s' % dst_name})
    print('  %-28s -> %s' % (rel, dst_name))

build_id = hashlib.sha256(''.join(m['url'] for m in mapping).encode()).hexdigest()[:22]
io.open('scripts/asset-map.json', 'w', encoding='utf-8').write(
    json.dumps({'buildId': build_id, 'stylesheets': mapping}, indent=2)
)
print('\nbuild id: %s' % build_id)
print('wrote scripts/asset-map.json')

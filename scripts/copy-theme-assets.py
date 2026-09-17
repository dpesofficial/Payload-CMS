# -*- coding: utf-8 -*-
"""
Copies every asset referenced by the theme stylesheets into public/_static/.

The theme CSS pulls in decorative images by relative path (menu carets, icons,
background textures). Missing any of them shows up as an invisible element
rather than a broken image, so copy them all rather than guessing.
"""
import io
import os
import re
import shutil

SRC = 'C:/laragon/www/titan/wp-content/themes/titan-shutters/assets'
DST = 'public/_static'
CSS_FILES = [
    'public/_static/css/custom.css',
    'public/_static/css/style.css',
    'public/_static/css/wp-head-before.css',
    'public/_static/css/wp-head-after.css',
    'public/_static/css/slick/slick-theme.css',
]

refs = set()
for f in CSS_FILES:
    if not os.path.exists(f):
        continue
    text = io.open(f, encoding='utf-8', errors='ignore').read()
    for u in re.findall(r'url\(["\']?([^)"\']+)["\']?\)', text):
        if u.startswith('data:') or u.startswith('http') or u.startswith('/theme/'):
            continue
        refs.add(u.split('?')[0].split('#')[0])

copied = 0
missing = []
for r in sorted(refs):
    # url() paths inside the stylesheets are relative to /theme/css/
    rel = os.path.normpath(os.path.join('css', r)).replace(os.sep, '/')
    src = os.path.join(SRC, rel)
    dst = os.path.join(DST, rel)
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1
    else:
        missing.append(rel)

print('referenced: %d   copied: %d   missing: %d' % (len(refs), copied, len(missing)))
for m in missing[:10]:
    print('   missing from theme:', m)

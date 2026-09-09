/**
 * Demo has only a handful of real routes. Any CMS-authored link pointing
 * elsewhere would 404, so route it to "#" instead until that page exists.
 */
const REAL_ROUTES = new Set(['/', '/admin', '/info', '/llms.txt'])

export function safeHref(url?: string | null): string {
  if (!url) return '#'
  if (url.startsWith('#') || url.startsWith('tel:') || url.startsWith('mailto:')) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const path = url.split('?')[0].replace(/\/$/, '') || '/'
  return REAL_ROUTES.has(path) ? url : '#'
}

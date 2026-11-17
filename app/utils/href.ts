// Links typed by editors: "www.example.com" or "example.com/page" (no https://)
// would be read as a page of this site (/current-page/www.example.com).
// Add https:// when the text looks like a domain; leave everything else as is
// (https://…, mailto:, tel:, /internal-page, #anchor).
export function href(url?: string): string | undefined {
  const u = (url ?? '').trim()
  if (!u) return undefined
  if (/^([a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(u)) return u
  if (/^[\w-]+(\.[\w-]+)+(\/|$|\?|#)/.test(u)) return `https://${u}`
  return u
}

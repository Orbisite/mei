import { API_IMG_BASE, SITE_URL } from '../config/remoteData'
import { resolveMediaUrl } from '../utils/siteImages'

export async function loadSiteSettings() {
  const res = await fetch(SITE_URL)
  if (!res.ok) {
    throw new Error(`site.json (${res.status})`)
  }
  return res.json()
}

function upsertMeta(selector, attr, value) {
  if (!value) {
    return
  }
  let node = document.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    if (selector.includes('property=')) {
      const key = selector.match(/property="([^"]+)"/)?.[1]
      if (key) {
        node.setAttribute('property', key)
      }
    } else {
      const key = selector.match(/name="([^"]+)"/)?.[1]
      if (key) {
        node.setAttribute('name', key)
      }
    }
    document.head.appendChild(node)
  }
  node.setAttribute(attr, value)
}

export function applySiteSettings(site = {}) {
  const title = site.title
  const description = site.description
  const canonicalUrl = site.canonicalUrl
  const og = site.og ?? {}
  const twitter = site.twitter ?? {}

  if (title) {
    document.title = title
  }
  upsertMeta('meta[name="description"]', 'content', description)

  if (canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }

  upsertMeta('meta[property="og:type"]', 'content', og.type)
  upsertMeta('meta[property="og:url"]', 'content', og.url)
  upsertMeta('meta[property="og:title"]', 'content', og.title ?? title)
  upsertMeta('meta[property="og:description"]', 'content', og.description ?? description)
  upsertMeta('meta[property="og:locale"]', 'content', og.locale)
  upsertMeta('meta[name="twitter:card"]', 'content', twitter.card)
  upsertMeta('meta[name="twitter:title"]', 'content', twitter.title ?? title)
  upsertMeta('meta[name="twitter:description"]', 'content', twitter.description ?? description)

  const resolveImage = (value) => resolveMediaUrl(API_IMG_BASE, value)
  const image = resolveImage(og.image ?? twitter.image ?? site.favicon)
  upsertMeta('meta[property="og:image"]', 'content', image)
  upsertMeta('meta[name="twitter:image"]', 'content', resolveImage(twitter.image ?? image))

  const favicon = resolveImage(site.favicon)
  if (favicon) {
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      document.head.appendChild(link)
    }
    link.href = favicon
  }
}

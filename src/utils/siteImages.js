import { API_IMG_BASE } from '../config/remoteData'

/**
 * Résolution des URLs médias (API_IMG_BASE + nom de fichier, ou URL absolue).
 */

export function resolveMediaUrl(base, value) {
  if (!value || typeof value !== 'string') {
    return undefined
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  if (base && typeof base === 'string') {
    const b = base.replace(/\/$/, '')
    const p = value.replace(/^\//, '')
    return `${b}/${p}`
  }
  return value
}

/**
 * Lit `content.images` depuis content.json (API).
 * @returns {object | null}
 */
export function extractContentImages(content) {
  const img = content?.images
  if (!img || typeof img !== 'object') {
    return null
  }
  const r = (v) => resolveMediaUrl(API_IMG_BASE, v)
  return {
    logo: r(img.logoSrc ?? img.logo),
    hero: r(img.hero),
    favicon: r(img.favicon),
    ogImage: r(img.ogImage),
    bento: Array.isArray(img.bento) ? img.bento.map((u) => r(u)).filter(Boolean) : undefined,
    testimonialAvatars: Array.isArray(img.testimonialAvatars)
      ? img.testimonialAvatars.map((u) => r(u)).filter(Boolean)
      : undefined,
  }
}

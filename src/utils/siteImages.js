import { API_IMG_BASE } from '../config/remoteData'
import { resolveForLocale } from './localeUtils'

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
    galleryFilenames: Array.isArray(img.gallery) ? img.gallery.filter(Boolean) : undefined,
  }
}

/**
 * Items pour GalleryBlock : `content.gallery.items` ({ file, alt, caption }) ou `images.gallery` (noms de fichiers).
 * @param {object} content
 * @param {string} locale
 * @returns {{ src: string, alt?: string, caption?: string }[]}
 */
export function buildGalleryItemsForLocale(content, locale) {
  const items = content?.gallery?.items
  if (Array.isArray(items) && items.length > 0) {
    return items
      .map((item) => {
        const file = item?.file ?? item?.src
        if (!file || typeof file !== 'string') {
          return null
        }
        const src = resolveMediaUrl(API_IMG_BASE, file)
        if (!src) {
          return null
        }
        const alt = resolveForLocale(locale, item.alt) ?? ''
        const caption = resolveForLocale(locale, item.caption)
        return {
          src,
          alt,
          ...(caption ? { caption } : {}),
        }
      })
      .filter(Boolean)
  }

  const names = content?.images?.gallery
  if (Array.isArray(names) && names.length > 0) {
    return names
      .map((file) => {
        if (!file || typeof file !== 'string') {
          return null
        }
        const src = resolveMediaUrl(API_IMG_BASE, file)
        return src ? { src, alt: '' } : null
      })
      .filter(Boolean)
  }

  return []
}

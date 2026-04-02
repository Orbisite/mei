import { mergeDeep } from '../utils/mergeDeep'

export function normalizePathname(pathname) {
  if (pathname == null || pathname === '') {
    return '/'
  }
  let p = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1)
  }
  return p
}

function stripPages(content) {
  if (!content || typeof content !== 'object') {
    return content
  }
  const { pages: _p, ...root } = content
  return root
}

/**
 * Prépare le contenu pour une URL donnée.
 * Sans clé `pages` : une seule page (comportement historique), toute URL affiche la même chose.
 * Avec `pages` : clés = chemins (`"/"`, `"/contact"`, …). Chaque entrée peut avoir `sections`
 * (ordre des blocs) et des clés qui surchargent le reste du JSON (hero, footer, …).
 */
export function getContentForRoute(content, pathname) {
  const path = normalizePathname(pathname)
  const pages = content?.pages

  if (pages == null || typeof pages !== 'object') {
    return { merged: stripPages(content), sections: null, notFound: false }
  }

  const root = stripPages(content)

  if (path !== '/' && !Object.prototype.hasOwnProperty.call(pages, path)) {
    return { merged: null, sections: null, notFound: true }
  }

  const spec = pages[path] ?? {}
  const { sections = null, ...overrides } = spec
  const merged = mergeDeep(root, overrides)
  return { merged, sections, notFound: false }
}

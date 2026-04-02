/**
 * Résout récursivement les feuilles `{ fr, en }` selon la locale active.
 */

function isLocaleLeaf(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, 'fr') &&
    Object.prototype.hasOwnProperty.call(value, 'en')
  )
}

export function resolveForLocale(locale, value) {
  if (value === null || value === undefined) {
    return value
  }

  if (isLocaleLeaf(value)) {
    return value[locale] ?? value.fr ?? value.en
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveForLocale(locale, item))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, resolveForLocale(locale, child)]),
    )
  }

  return value
}

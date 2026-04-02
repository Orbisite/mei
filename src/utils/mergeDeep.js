/**
 * Fusion profonde d’objets simples (JSON). Les tableaux sont remplacés, pas fusionnés.
 */
export function mergeDeep(base, override) {
  if (override == null) {
    return base
  }
  if (Array.isArray(override)) {
    return override
  }
  if (typeof override !== 'object' || base == null || typeof base !== 'object') {
    return override
  }
  const out = { ...base }
  for (const key of Object.keys(override)) {
    const bv = base[key]
    const ov = override[key]
    if (
      ov != null &&
      typeof ov === 'object' &&
      !Array.isArray(ov) &&
      bv != null &&
      typeof bv === 'object' &&
      !Array.isArray(bv)
    ) {
      out[key] = mergeDeep(bv, ov)
    } else {
      out[key] = ov
    }
  }
  return out
}

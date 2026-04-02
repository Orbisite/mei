/**
 * Par défaut : dépôt `aurora-api` (JSON via raw.githubusercontent.com).
 */
const MODEL_RAW =
  import.meta.env.VITE_MODEL_RAW_BASE ??
  'https://raw.githubusercontent.com/Orbisite/aurora-api/main'

export const CONTENT_URL =
  import.meta.env.VITE_CONTENT_URL ?? `${MODEL_RAW}/content.json`

export const THEME_URL =
  import.meta.env.VITE_THEME_URL ?? `${MODEL_RAW}/theme.json`

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? `${MODEL_RAW}/site.json`

export const API_IMG_BASE =
  import.meta.env.VITE_API_IMG_BASE ?? `${MODEL_RAW}/img`

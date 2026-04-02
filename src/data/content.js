import { CONTENT_URL } from '../config/remoteData'

/**
 * Charge `content.json` depuis l’API (URL configurable via VITE_CONTENT_URL).
 * @returns {Promise<object>}
 */
export async function loadContent() {
  const res = await fetch(CONTENT_URL)
  if (!res.ok) {
    throw new Error(`content.json (${res.status})`)
  }
  return res.json()
}

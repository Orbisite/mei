import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '..', 'dist')
const indexHtml = path.join(dist, 'index.html')
const notFoundHtml = path.join(dist, '404.html')

if (!fs.existsSync(indexHtml)) {
  console.error('copy-spa-fallback: dist/index.html introuvable — lance vite build avant.')
  process.exit(1)
}
fs.copyFileSync(indexHtml, notFoundHtml)
console.log('copy-spa-fallback: dist/404.html (SPA GitHub Pages)')

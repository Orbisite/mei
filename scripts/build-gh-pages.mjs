/**
 * Build pour GitHub Pages (site « projet » : https://org.github.io/<nom-du-depot>/).
 * - En CI : utilise GITHUB_REPOSITORY (fourni par GitHub Actions) pour déduire VITE_BASE.
 * - En local : exporte VITE_BASE=/nom-du-depot/ avant la commande.
 */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

let base = process.env.VITE_BASE?.trim()
if (!base && process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.split('/')[1]
  base = `/${repo}/`
}
if (!base) {
  console.error(
    'build-gh-pages: définissez VITE_BASE=/nom-du-repo/ (ex. /mon-site/ pour https://org.github.io/mon-site/).\n' +
      'Sous GitHub Actions, GITHUB_REPOSITORY est défini automatiquement.',
  )
  process.exit(1)
}
if (!base.startsWith('/')) {
  base = `/${base}`
}
if (!base.endsWith('/')) {
  base = `${base}/`
}

const env = { ...process.env, VITE_BASE: base }
execSync('vite build', { cwd: root, stdio: 'inherit', env })
execSync('node scripts/copy-spa-fallback.mjs', { cwd: root, stdio: 'inherit' })

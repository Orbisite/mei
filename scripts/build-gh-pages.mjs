/**
 * Build pour GitHub Pages (site « projet » : https://org.github.io/<nom-du-depot>/).
 * - En CI : GITHUB_REPOSITORY → VITE_BASE.
 * - En local : `orbisite.ghPagesBase` dans package.json, ou variable VITE_BASE=/nom-du-depot/.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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
  try {
    const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
    base = pkg.orbisite?.ghPagesBase?.trim()
  } catch {
    /* ignore */
  }
}
if (!base) {
  console.error(
    'build-gh-pages: ajoutez `"orbisite": { "ghPagesBase": "/nom-du-repo/" }` dans package.json,\n' +
      'ou définissez VITE_BASE=/nom-du-repo/ (ex. /aurora/ pour https://org.github.io/aurora/).\n' +
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

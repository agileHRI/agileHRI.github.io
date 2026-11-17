// The site is generated as static files (npm run generate -> .output/public)
// and published on GitHub Pages by .github/workflows/deploy.yml.
import { existsSync, readFileSync, readdirSync } from 'node:fs'

// Every file in content/pages/ becomes a page: <route>.yml -> /<route>,
// except drafts ("draft: true"). Listed here so the static build generates a
// page even if nothing links to it.
const isDraft = (file: string) => /^draft:\s*true\s*$/m.test(readFileSync(`content/pages/${file}`, 'utf8'))
const pageFiles = existsSync('content/pages') ? readdirSync('content/pages').filter(f => f.endsWith('.yml')) : []
const toRoute = (f: string) => '/' + f.replace(/\.yml$/, '')
const pageRoutes = pageFiles.filter(f => !isDraft(f)).map(toRoute)
// A published page may link to a draft: skip it instead of failing the whole build.
const draftRoutes = pageFiles.filter(isDraft).map(toRoute)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css'],
  content: {
    // Node's built-in SQLite (Node 22.5+): no native module to compile.
    experimental: { sqliteConnector: 'native' },
  },
  nitro: {
    prerender: { routes: pageRoutes, crawlLinks: true, ignore: draftRoutes },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})

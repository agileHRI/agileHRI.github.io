// Two builds of the same site:
//   - Public site: static files (npm run generate -> .output/public), published
//     on GitHub Pages by .github/workflows/deploy.yml.
//   - Editing app with Nuxt Studio (npm run build:app -> .output/server), run as
//     a Node.js app on Hostinger at dev-cms.agilehri.org. AGILEHRI_STUDIO=true
//     (set by the build:app script) turns Studio on; the public build never has it.
import { existsSync, readFileSync, readdirSync } from 'node:fs'

// Not NUXT_STUDIO: Nuxt reads every NUXT_* variable as a runtime-config override,
// and NUXT_STUDIO would replace Studio's whole configuration with the text "true".
const studio = process.env.AGILEHRI_STUDIO === 'true'

// Every file in content/pages/ becomes a page: <route>.md -> /<route>,
// except drafts ("draft: true"). Listed here so the static build generates a
// page even if nothing links to it.
const isDraft = (file: string) => /^draft:\s*true\s*$/m.test(readFileSync(`content/pages/${file}`, 'utf8'))
const pageFiles = existsSync('content/pages') ? readdirSync('content/pages').filter(f => f.endsWith('.md')) : []
const toRoute = (f: string) => '/' + f.replace(/\.md$/, '')
const pageRoutes = pageFiles.filter(f => !isDraft(f)).map(toRoute)
// A published page may link to a draft: skip it instead of failing the whole build.
const draftRoutes = pageFiles.filter(isDraft).map(toRoute)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content', ...(studio ? ['nuxt-studio'] : [])],
  css: ['~/assets/css/main.css'],
  content: {
    // Node's built-in SQLite (Node 22.5+): no native module to compile.
    experimental: { sqliteConnector: 'native' },
  },
  // Nuxt Studio (editing app only). Secrets are NOT here: they are environment
  // variables set in hPanel (see README, "Editing app").
  ...(studio && {
    studio: {
      route: '/_studio',
      repository: {
        provider: 'github',
        owner: 'agileHRI',
        repo: 'agileHRI.github.io',
        branch: 'main',
        // Public repo: GitHub asks only for "public_repo" access, not "repo"
        // (which would cover every private repo of whoever signs in).
        private: false,
      },
      // The "/" menu of the page editor offers only the site's sections
      // (app/components/content/), not every component of the site.
      editor: { components: { include: ['Hero', 'Cards', 'Card', 'Quote', 'ImageText', 'Discord'] } },
    },
  }),
  nitro: {
    prerender: { routes: pageRoutes, crawlLinks: true, ignore: draftRoutes },
    // The editing app shows the same content as the public site: keep it out
    // of search engines.
    ...(studio && { routeRules: { '/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } } } }),
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        ...(studio ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      ],
    },
  },
})

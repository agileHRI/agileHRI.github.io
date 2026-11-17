// The site is generated as static files (npm run generate -> .output/public)
// and published on GitHub Pages by .github/workflows/deploy.yml.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css'],
  content: {
    // Node's built-in SQLite (Node 22.5+): no native module to compile.
    experimental: { sqliteConnector: 'native' },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})

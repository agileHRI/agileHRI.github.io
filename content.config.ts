// How the site reads the content. The fields of every file are defined in
// schemas.ts (shared with scripts/validate-content.ts, the check that runs
// before every build); Pages CMS edits the same fields (.pages.yml).
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { category, home, module, page, site } from './schemas'

// Drafts ("draft: true") are left out of the build entirely, so their text
// doesn't reach the published site (not even its content data files).
const drafts = (dir: string) => existsSync(`content/${dir}`)
  ? readdirSync(`content/${dir}`)
      .filter(f => /\.(yml|md)$/.test(f) && /^draft:\s*true\s*$/m.test(readFileSync(`content/${dir}/${f}`, 'utf8')))
      .map(f => `${dir}/${f}`)
  : []

export default defineContentConfig({
  collections: {
    home: defineCollection({ type: 'data', source: 'home.yml', schema: home }),
    site: defineCollection({ type: 'data', source: 'site.yml', schema: site }),
    // One Markdown file per page: content/pages/<route>.md -> /<route>
    pages: defineCollection({ type: 'page', source: { include: 'pages/*.md', exclude: drafts('pages') }, schema: page }),
    // Catalogue: categories (editable list) and modules (one file each).
    categories: defineCollection({ type: 'data', source: 'categories/*.yml', schema: category }),
    modules: defineCollection({ type: 'data', source: { include: 'modules/*.yml', exclude: drafts('modules') }, schema: module }),
  },
})

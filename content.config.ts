// What each content file contains. Pages CMS edits the same fields
// (.pages.yml); keep both in step when a field is added or renamed.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// Drafts ("draft: true") are left out of the build entirely, so their text
// doesn't reach the published site (not even its content data files).
const draftPages = existsSync('content/pages')
  ? readdirSync('content/pages')
      .filter(f => f.endsWith('.yml') && /^draft:\s*true\s*$/m.test(readFileSync(`content/pages/${f}`, 'utf8')))
      .map(f => `pages/${f}`)
  : []

const link = z.object({ label: z.string(), url: z.string() })

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'data',
      source: 'home.yml',
      schema: z.object({
        hero: z.object({
          tag: z.string(),
          title: z.string(),
          titleStyle: z.enum(['large', 'subtitle']).default('large'),
          text: z.string(),
          button: link,
        }),
        cycle: z.object({
          tag: z.string(),
          steps: z.array(z.object({ label: z.string(), text: z.string() })),
          loop: z.object({ label: z.string(), text: z.string() }),
          note: z.string(),
        }),
        stats: z.array(z.object({ number: z.string(), label: z.string() })),
        soon: z.object({
          title: z.string(),
          text: z.string(),
          cards: z.array(z.object({ title: z.string(), text: z.string(), url: z.string(), pill: z.string() })),
        }),
        quote: z.object({ text: z.string(), source: z.string() }),
      }),
    }),
    // One file per page: content/pages/<route>.yml -> /<route>
    pages: defineCollection({
      type: 'data',
      source: { include: 'pages/*.yml', exclude: draftPages },
      schema: z.object({
        title: z.string(),
        // A draft is kept in the repo but not published (not generated, not shown).
        draft: z.boolean().default(false),
        // The page is a list of sections; "type" says which kind (see app/components/section/).
        sections: z.array(z.discriminatedUnion('type', [
          z.object({ type: z.literal('hero'), tag: z.string().optional(), title: z.string(), text: z.string().optional(),
            buttonLabel: z.string().optional(), buttonUrl: z.string().optional() }),
          z.object({ type: z.literal('text'), title: z.string().optional(), body: z.string() }),
          z.object({ type: z.literal('cards'), title: z.string().optional(),
            cards: z.array(z.object({ title: z.string(), text: z.string().optional(), url: z.string().optional() })) }),
          z.object({ type: z.literal('quote'), text: z.string(), source: z.string().optional() }),
          z.object({ type: z.literal('imageText'), image: z.string(), alt: z.string(), title: z.string().optional(),
            body: z.string(), imageSide: z.enum(['left', 'right']).default('left') }),
          z.object({ type: z.literal('discord'), title: z.string(), text: z.string().optional(), buttonLabel: z.string() }),
        ])).default([]),
      }),
    }),
    site: defineCollection({
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        discord: z.string(), // invite link used by every Discord section
        menu: z.array(link),
        footer: z.object({
          project: z.string(),
          projectLink: link,
          right: z.string(),
          rightLink: link,
          funding: z.string(),
        }),
      }),
    }),
  },
})

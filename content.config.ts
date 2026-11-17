// What each content file contains. Pages CMS edits the same fields
// (.pages.yml); keep both in step when a field is added or renamed.
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

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
    site: defineCollection({
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
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

// The fields of every content file, in one place. Used by:
//   - content.config.ts (how the site reads the content), and
//   - scripts/validate-content.ts (the check that runs before every build and
//     stops the publication when a file is wrong).
// The editing forms in .pages.yml must offer the same fields and values.
import { z } from 'zod'

// Fixed lists for the catalogue (the same values as the selects in .pages.yml).
export const SECTORS = ['manufacturing', 'logistics', 'healthcare', 'agrifood', 'construction', 'retail'] as const
export const TRLS = ['4', '5', '6', '7', '8', '9'] as const

const text = z.string().trim().min(1)
const link = z.object({ label: text, url: text })

export const home = z.object({
  hero: z.object({
    tag: text,
    title: text,
    titleStyle: z.enum(['large', 'subtitle']).default('large'),
    text,
    button: link,
  }),
  cycle: z.object({
    tag: text,
    steps: z.array(z.object({ label: text, text })).min(1),
    loop: z.object({ label: text, text }),
    note: text,
  }),
  stats: z.array(z.object({ number: text, label: text })),
  soon: z.object({
    title: text,
    text,
    cards: z.array(z.object({ title: text, text, url: text, pill: text })),
  }),
  quote: z.object({ text, source: text }),
})

export const site = z.object({
  title: text,
  description: text,
  discord: text, // invite link used by every Discord section
  menu: z.array(link),
  footer: z.object({
    project: text,
    projectLink: link,
    right: text,
    rightLink: link,
    funding: text,
  }),
})

// A page (content/pages/<route>.md): these fields go at the top of the file
// (frontmatter); the rest is Markdown with sections (app/components/content/).
export const page = z.object({
  title: text,
  description: z.string().optional(),
  // A draft is kept in the repo but not published (not generated, not shown).
  draft: z.boolean().default(false),
})

// Catalogue: what a module does (editable list). Modules store the category key.
// (Not "id" or "order": Nuxt Content reserves "id", and "order" is an SQL keyword.)
export const category = z.object({
  key: z.string().regex(/^[a-z0-9-]+$/, 'lower case letters, digits and dashes only'),
  label: text,
  description: z.string().optional(),
  position: z.number().default(99),
})

// Catalogue: one file per module, content/modules/<slug>.yml -> /catalogue/<slug>
export const module = z.object({
  name: text,
  project: text,
  organisation: text,
  country: z.string().optional(),
  sector: z.enum(SECTORS),
  categories: z.array(text).min(1, 'choose at least one category'),
  keywords: z.array(z.string()).default([]),
  trl: z.enum(TRLS),
  licence: text,
  stack: z.string().optional(),
  repository: z.string().url().optional(),
  summary: text,
  description: z.string().optional(),
  draft: z.boolean().default(false),
})

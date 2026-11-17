// Checks every content file before the site is built (npm run validate).
// GitHub Actions runs it first: if anything is wrong, nothing is published and
// the live site stays as it was. The messages name the file and the field.
//
// Nuxt Content alone does NOT reject wrong values (it uses the schema to store
// the data), so this check is what keeps a bad save from going public.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import type { ZodTypeAny } from 'zod'
import { category, home, module, page, site } from '../schemas.ts'

const errors: string[] = []

function check<T extends ZodTypeAny>(file: string, schema: T, extract = (source: string) => source) {
  let data: unknown
  try {
    data = parse(extract(readFileSync(file, 'utf8')))
  } catch (e) {
    errors.push(`${file}: not valid YAML (${(e as Error).message.split('\n')[0]})`)
    return undefined
  }
  const result = schema.safeParse(data)
  if (!result.success) {
    for (const issue of result.error.issues)
      errors.push(`${file}: ${issue.path.join('.') || '(whole file)'}: ${issue.message}`)
    return undefined
  }
  return result.data
}

const filesIn = (dir: string, ext = '.yml') => existsSync(dir)
  ? readdirSync(dir).filter(f => f.endsWith(ext)).map(f => `${dir}/${f}`)
  : []

// The fields at the top of a Markdown file (frontmatter), as YAML text.
function frontmatter(source: string) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!m) throw new Error('missing the fields at the top (between two --- lines)')
  return m[1]
}

check('content/home.yml', home)
check('content/site.yml', site)
// Pages are Markdown: check the fields at the top (between the two --- lines).
for (const file of filesIn('content/pages', '.md')) check(file, page, frontmatter)
for (const file of filesIn('content/pages')) errors.push(`${file}: pages are Markdown now (.md), not .yml`)

// Categories: the file name must be the key (Pages CMS names it that way).
const categoryIds = new Set<string>()
for (const file of filesIn('content/categories')) {
  const c = check(file, category)
  if (!c) continue
  if (!file.endsWith(`/${c.key}.yml`)) errors.push(`${file}: key "${c.key}" must match the file name (${c.key}.yml)`)
  categoryIds.add(c.key)
}

// Modules: every category they use must exist (checked even when another
// field of the module is wrong, so all problems show up at once).
for (const file of filesIn('content/modules')) {
  check(file, module)
  let raw: { categories?: unknown } | undefined
  try { raw = parse(readFileSync(file, 'utf8')) } catch { continue }
  const used = Array.isArray(raw?.categories) ? raw.categories.filter((c): c is string => typeof c === 'string') : []
  for (const id of used)
    if (!categoryIds.has(id)) errors.push(`${file}: categories: "${id}" is not a category (known: ${[...categoryIds].join(', ')})`)
}

if (errors.length) {
  console.error(`Content check failed (${errors.length}):\n` + errors.map(e => `  - ${e}`).join('\n'))
  process.exit(1)
}
console.log('Content check passed.')

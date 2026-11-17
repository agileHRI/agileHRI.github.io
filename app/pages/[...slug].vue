<script setup lang="ts">
// Any page: content/pages/<route>.md is shown at /<route>.
import { PageText } from '#components'
// A page is Markdown: free text, plus sections inserted as components
// (app/components/content/: ::hero, ::cards, ::quote, ::image-text, ::discord).
const route = useRoute()
// filter(Boolean): /events/ (trailing slash, as GitHub Pages serves it) is the same page as /events
const slug = computed(() => ([] as string[]).concat(route.params.slug || []).filter(Boolean).join('/'))
const { data: page } = await useAsyncData(`page-${slug.value}`, () =>
  queryCollection('pages').where('stem', '=', `pages/${slug.value}`).where('draft', '=', false).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
useSeoMeta({ title: () => page.value?.title, description: () => page.value?.description })

// Sections are full-width bands. The free text between two sections is wrapped
// in a text band (PageText) so it lines up with them.
const SECTIONS = new Set(['hero', 'cards', 'quote', 'image-text', 'discord'])
type Node = string | [string, Record<string, unknown>, ...unknown[]]
const isSection = (n: Node) => Array.isArray(n) && SECTIONS.has(n[0])
const doc = computed(() => {
  if (!page.value) return null
  const nodes = (page.value.body as unknown as { value?: Node[] }).value ?? []
  const out: Node[] = []
  for (const n of nodes) {
    const last = out.at(-1)
    if (isSection(n)) out.push(n)
    else if (Array.isArray(last) && last[0] === 'page-text') last.push(n)
    else out.push(['page-text', {}, n])
  }
  return { ...page.value, body: { ...page.value.body, value: out } }
})
// A page that starts with a teal header doesn't repeat its title above it.
const showTitle = computed(() => {
  const first = (doc.value?.body.value as Node[] | undefined)?.[0]
  return !(Array.isArray(first) && first[0] === 'hero')
})
</script>

<template>
  <div v-if="doc">
    <section v-if="showTitle" class="ah-section ah-title-band">
      <div class="ah-wrap"><h1 class="ah-page-title">{{ doc.title }}</h1></div>
    </section>
    <ContentRenderer :value="doc" :components="{ 'page-text': PageText }" />
  </div>
</template>

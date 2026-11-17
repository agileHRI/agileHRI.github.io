<script setup lang="ts">
// Any page created in Pages CMS: content/pages/<route>.yml is shown at /<route>.
import { SectionCards, SectionDiscord, SectionHero, SectionImageText, SectionQuote, SectionText } from '#components'

const route = useRoute()
// filter(Boolean): /events/ (trailing slash, as GitHub Pages serves it) is the same page as /events
const slug = computed(() => ([] as string[]).concat(route.params.slug || []).filter(Boolean).join('/'))
const { data: page } = await useAsyncData(`page-${slug.value}`, () =>
  queryCollection('pages').where('stem', '=', `pages/${slug.value}`).where('draft', '=', false).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
useSeoMeta({ title: () => page.value?.title })

// One component per section type (app/components/section/).
const components = {
  hero: SectionHero, text: SectionText, cards: SectionCards,
  quote: SectionQuote, imageText: SectionImageText, discord: SectionDiscord,
} as const
// A page that starts with a teal header doesn't repeat its title above it.
const showTitle = computed(() => page.value?.sections[0]?.type !== 'hero')
</script>

<template>
  <div v-if="page">
    <section v-if="showTitle" class="ah-section ah-title-band">
      <div class="ah-wrap"><h1 class="ah-page-title">{{ page.title }}</h1></div>
    </section>
    <component :is="components[section.type]" v-for="(section, i) in page.sections" :key="i" :s="section" />
  </div>
</template>

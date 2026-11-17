<script setup lang="ts">
// /catalogue: every module (content/modules/*.yml), written into the HTML at
// build time so the cards are visible without JavaScript and indexable.
const { data } = await useAsyncData('catalogue', async () => {
  const [modules, categories] = await Promise.all([
    queryCollection('modules').order('name', 'ASC').all(),
    queryCollection('categories').order('position', 'ASC').all(),
  ])
  return { modules, categories }
})
const labels = computed(() => new Map((data.value?.categories ?? []).map(c => [c.key, c.label])))
const categoryLabel = (id: string) => labels.value.get(id) ?? id
useSeoMeta({ title: 'Catalogue', description: 'Open HRI modules: search and filter by category, sector and TRL.' })
</script>

<template>
  <div>
    <section class="ah-hero ah-page-hero">
      <div class="ah-wrap">
        <p class="ah-tag">Catalogue</p>
        <h1>Open HRI modules</h1>
        <p class="ah-hero-sub">Reusable human-robot interaction modules, ready to test and integrate.</p>
      </div>
    </section>
    <section class="ah-section">
      <div class="ah-wrap">
        <p class="ah-mockup" role="note"><strong>Mockup · demo data.</strong> Organisations, modules and texts are fictitious.</p>
        <p class="ah-count">{{ data?.modules.length ?? 0 }} modules</p>
        <div class="ah-grid">
          <ModuleCard v-for="m in data?.modules" :key="m.stem" :m="m" :category-label="categoryLabel" />
        </div>
      </div>
    </section>
  </div>
</template>

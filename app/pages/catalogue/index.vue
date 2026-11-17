<script setup lang="ts">
// /catalogue: every module (content/modules/*.yml), written into the HTML at
// build time so the cards are visible without JavaScript and indexable.
// Search and filters run in the browser and live in the address
// (?q=lidar&category=perception&sector=healthcare&trl=6), so a filtered view
// can be shared and the back button works.
const { data } = await useAsyncData('catalogue', async () => {
  const [modules, categories] = await Promise.all([
    queryCollection('modules').order('name', 'ASC').all(),
    queryCollection('categories').order('position', 'ASC').all(),
  ])
  return { modules, categories }
})
const modules = computed(() => data.value?.modules ?? [])
const categories = computed(() => data.value?.categories ?? [])
const labels = computed(() => new Map(categories.value.map(c => [c.key, c.label])))
const categoryLabel = (id: string) => labels.value.get(id) ?? id
useSeoMeta({ title: 'Catalogue', description: 'Open HRI modules: search and filter by category, sector and TRL.' })

// --- Filters: read from the address, written back to it -----------------------
const route = useRoute()
const router = useRouter()
const asList = (v: unknown) => ([] as unknown[]).concat(v ?? []).flatMap(x => String(x).split(',')).filter(Boolean)
const q = computed(() => String(route.query.q ?? ''))
const selected = computed(() => asList(route.query.category))
const sector = computed(() => String(route.query.sector ?? ''))
const minTrl = computed(() => String(route.query.trl ?? ''))
const active = computed(() => !!(q.value || selected.value.length || sector.value || minTrl.value))

function setQuery(patch: Record<string, string | string[] | undefined>, replace = false) {
  const query: Record<string, string> = {}
  const next = { q: q.value, category: selected.value, sector: sector.value, trl: minTrl.value, ...patch }
  for (const [k, v] of Object.entries(next)) {
    const s = Array.isArray(v) ? v.join(',') : (v ?? '')
    if (s) query[k] = s
  }
  router[replace ? 'replace' : 'push']({ query })
}
const toggleCategory = (key: string) =>
  setQuery({ category: selected.value.includes(key) ? selected.value.filter(k => k !== key) : [...selected.value, key] })
const clearAll = () => router.push({ query: {} })

// The typed text updates the address as you type. The first letter adds a
// history step and the following ones update it, so Back undoes the whole
// search (and only the search) instead of one letter at a time.
const typed = ref(q.value)
watch(q, v => { if (v !== typed.value) typed.value = v })
watch(typed, v => { if (v.trim() !== q.value) setQuery({ q: v.trim() || undefined }, !!q.value) })

// --- Matching ------------------------------------------------------------------------
// Case- and accent-insensitive: "Pérception" finds "perception".
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
type Mod = (typeof modules.value)[number]
const haystack = (m: Mod) => norm([m.name, m.summary, m.organisation, m.project, m.stack ?? '', m.country ?? '',
  ...m.keywords, ...m.categories.map(categoryLabel)].join(' '))
const matches = (m: Mod, ignoreCategories = false) =>
  (!q.value || norm(q.value).split(/\s+/).every(word => haystack(m).includes(word)))
  && (ignoreCategories || !selected.value.length || m.categories.some(c => selected.value.includes(c)))
  && (!sector.value || m.sector === sector.value)
  && (!minTrl.value || Number(m.trl) >= Number(minTrl.value))

// Until the page is running in the browser, show everything (the generated HTML
// has every card; without JavaScript nothing is hidden).
const ready = ref(false)
onMounted(() => {
  ready.value = true
  typed.value = q.value
})
const shown = computed(() => (ready.value ? modules.value.filter(m => matches(m)) : modules.value))
// How many modules each category would show with the other filters as they are.
const countFor = (key: string) => modules.value.filter(m => matches(m, true) && m.categories.includes(key)).length
const sectors = computed(() => [...new Set(modules.value.map(m => m.sector))].sort())
const isActive = computed(() => ready.value && active.value)
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

        <form class="ah-filters" role="search" @submit.prevent>
          <label class="ah-search">
            <span class="ah-sr">Search modules</span>
            <input v-model="typed" type="search" placeholder="Search: name, technology, keyword (e.g. lidar, voice, ROS 2)">
          </label>
          <div class="ah-filter-row">
            <label>Sector
              <select :value="ready ? sector : ''" @change="setQuery({ sector: ($event.target as HTMLSelectElement).value || undefined })">
                <option value="">All</option>
                <option v-for="s in sectors" :key="s" :value="s">{{ s.charAt(0).toUpperCase() + s.slice(1) }}</option>
              </select>
            </label>
            <label>Minimum TRL
              <select :value="ready ? minTrl : ''" @change="setQuery({ trl: ($event.target as HTMLSelectElement).value || undefined })">
                <option value="">Any</option>
                <option v-for="t in ['4', '5', '6', '7', '8', '9']" :key="t" :value="t">TRL {{ t }}+</option>
              </select>
            </label>
          </div>
          <div class="ah-cat-chips" role="group" aria-label="Categories">
            <button v-for="c in categories" :key="c.key" type="button" class="ah-chip"
                    :aria-pressed="ready && selected.includes(c.key)" :title="c.description" @click="toggleCategory(c.key)">
              {{ c.label }} <span class="ah-chip-n">{{ ready ? countFor(c.key) : modules.filter(m => m.categories.includes(c.key)).length }}</span>
            </button>
          </div>
        </form>

        <p class="ah-count" aria-live="polite">
          <template v-if="isActive">{{ shown.length }} of {{ modules.length }} modules</template>
          <template v-else>{{ modules.length }} modules</template>
          <button v-if="isActive" type="button" class="ah-clear" @click="clearAll">Clear filters</button>
        </p>

        <div v-if="shown.length" class="ah-grid">
          <ModuleCard v-for="m in shown" :key="m.stem" :m="m" :category-label="categoryLabel" />
        </div>
        <div v-else class="ah-empty">
          <p>No module matches these filters.</p>
          <button type="button" class="ah-btn" @click="clearAll">Clear filters</button>
        </div>
      </div>
    </section>
  </div>
</template>

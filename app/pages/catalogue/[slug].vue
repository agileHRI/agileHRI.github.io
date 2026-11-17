<script setup lang="ts">
// /catalogue/<slug>: one module, from content/modules/<slug>.yml.
const route = useRoute()
const slug = computed(() => String(route.params.slug ?? '').replace(/\/+$/, ''))
const { data } = await useAsyncData(`module-${slug.value}`, async () => {
  const [m, categories] = await Promise.all([
    queryCollection('modules').where('stem', '=', `modules/${slug.value}`).first(),
    queryCollection('categories').order('position', 'ASC').all(),
  ])
  return { m, categories }
})
if (!data.value?.m) throw createError({ statusCode: 404, statusMessage: 'Module not found', fatal: true })
const m = computed(() => data.value!.m!)
const labels = computed(() => new Map((data.value?.categories ?? []).map(c => [c.key, c.label])))
useSeoMeta({ title: () => m.value.name, description: () => m.value.summary })
</script>

<template>
  <div v-if="data?.m">
    <section class="ah-hero ah-page-hero">
      <div class="ah-wrap">
        <p class="ah-tag"><NuxtLink to="/catalogue" class="ah-back">← Catalogue</NuxtLink></p>
        <p><span class="ah-badge">{{ m.sector }} · TRL {{ m.trl }}</span></p>
        <h1>{{ m.name }}</h1>
        <p class="ah-hero-sub">{{ m.summary }}</p>
      </div>
    </section>
    <section class="ah-section">
      <div class="ah-wrap">
        <p class="ah-mockup" role="note"><strong>Mockup · demo data.</strong> This organisation, module and text are fictitious.</p>
        <div class="ah-detail">
          <div>
            <MDC v-if="m.description" class="ah-body ah-rich" :value="m.description" tag="div" />
          </div>
          <aside class="ah-facts" aria-label="Module facts">
            <dl>
              <dt>Project</dt><dd>{{ m.project }}</dd>
              <dt>Organisation</dt><dd>{{ m.organisation }}</dd>
              <template v-if="m.country"><dt>Country</dt><dd>{{ m.country }}</dd></template>
              <dt>Sector</dt><dd class="ah-cap">{{ m.sector }}</dd>
              <dt>Readiness</dt><dd>TRL {{ m.trl }}</dd>
              <dt>Licence</dt><dd>{{ m.licence }}</dd>
              <template v-if="m.stack"><dt>Technologies</dt><dd>{{ m.stack }}</dd></template>
              <dt>Categories</dt>
              <dd class="ah-chips">
                <span v-for="c in m.categories" :key="c" class="ah-pill">{{ labels.get(c) ?? c }}</span>
              </dd>
            </dl>
            <p v-if="m.repository"><a class="ah-btn ah-btn-code" :href="m.repository">GitHub → {{ m.repository.replace(/^https?:\/\/(www\.)?github\.com\//, '') }}</a></p>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

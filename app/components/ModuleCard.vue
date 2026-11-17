<script setup lang="ts">
// One module in the catalogue (design: the ARISE pack prototype's module card).
defineProps<{
  m: { stem: string; name: string; organisation: string; country?: string; sector: string; trl: string; licence: string; summary: string; categories: string[] }
  categoryLabel: (id: string) => string
}>()
</script>

<template>
  <article class="ah-mod">
    <div class="ah-mod-top">
      <span class="ah-badge">{{ m.sector }} · TRL {{ m.trl }}</span>
      <h3><NuxtLink :to="`/catalogue/${m.stem.replace(/^modules\//, '')}`">{{ m.name }}</NuxtLink></h3>
      <p class="ah-mod-exp">{{ m.organisation }}<template v-if="m.country"> · {{ m.country }}</template></p>
    </div>
    <div class="ah-mod-body">
      <p class="ah-mod-desc">{{ m.summary }}</p>
      <p class="ah-chips">
        <span v-for="c in m.categories" :key="c" class="ah-pill">{{ categoryLabel(c) }}</span>
      </p>
      <p class="ah-stack-line">{{ m.licence }}</p>
    </div>
  </article>
</template>

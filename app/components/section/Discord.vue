<script setup lang="ts">
defineProps<{ s: { title: string; text?: string; buttonLabel: string } }>()
// The invite link is set once, in content/site.yml ("Menu and footer" in Pages CMS).
const { data: site } = await useAsyncData('site', () => queryCollection('site').first())
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <h2 class="ah-head">{{ s.title }}</h2>
      <p v-if="s.text" class="ah-body">{{ s.text }}</p>
      <p class="ah-buttons"><a class="ah-btn ah-btn-discord" :href="site?.discord">{{ s.buttonLabel }}</a></p>
    </div>
  </section>
</template>

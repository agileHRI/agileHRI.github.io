<script setup lang="ts">
// A grid of cards. Each card inside is a "card" component.
defineProps<{
  /** Section title (optional) */
  title?: string
}>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <h2 v-if="title" class="ah-head">{{ title }}</h2>
      <div class="ah-grid"><slot /></div>
    </div>
  </section>
</template>

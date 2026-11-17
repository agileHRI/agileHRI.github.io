<script setup lang="ts">
defineProps<{ s: { tag?: string; title: string; text?: string; buttonLabel?: string; buttonUrl?: string } }>()
</script>

<template>
  <section class="ah-hero ah-page-hero">
    <div class="ah-wrap">
      <p v-if="s.tag" class="ah-tag">{{ s.tag }}</p>
      <h1>{{ s.title }}</h1>
      <p v-if="s.text" class="ah-hero-sub">{{ s.text }}</p>
      <p v-if="s.buttonLabel && s.buttonUrl" class="ah-buttons"><a class="ah-btn ah-btn-light" :href="s.buttonUrl">{{ s.buttonLabel }}</a></p>
    </div>
  </section>
</template>

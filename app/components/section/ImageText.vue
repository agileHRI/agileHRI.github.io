<script setup lang="ts">
defineProps<{ s: { image: string; alt: string; title?: string; body: string; imageSide?: 'left' | 'right' } }>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap ah-media" :class="{ 'ah-media-right': s.imageSide === 'right' }">
      <img :src="s.image" :alt="s.alt" loading="lazy">
      <div>
        <h2 v-if="s.title" class="ah-head">{{ s.title }}</h2>
        <MDC class="ah-body ah-rich" :value="s.body" tag="div" />
      </div>
    </div>
  </section>
</template>

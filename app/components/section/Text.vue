<script setup lang="ts">
defineProps<{ s: { title?: string; body: string } }>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <h2 v-if="s.title" class="ah-head">{{ s.title }}</h2>
      <MDC class="ah-body ah-rich" :value="s.body" tag="div" />
    </div>
  </section>
</template>

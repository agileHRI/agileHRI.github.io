<script setup lang="ts">
defineProps<{ s: { text: string; source?: string } }>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <blockquote class="ah-quote">
        <p>{{ s.text }}</p>
        <cite v-if="s.source">— {{ s.source }}</cite>
      </blockquote>
    </div>
  </section>
</template>

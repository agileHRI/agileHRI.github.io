<script setup lang="ts">
// A sentence to highlight, in the orange box.
defineProps<{
  /** Who said it / where it comes from (optional) */
  source?: string
}>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <blockquote class="ah-quote">
        <p><slot mdc-unwrap="p" /></p>
        <cite v-if="source">— {{ source }}</cite>
      </blockquote>
    </div>
  </section>
</template>

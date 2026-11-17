<script setup lang="ts">
// Not a section for editors (it lives outside components/content, so Studio
// doesn't offer it): app/pages/[...slug].vue wraps each stretch of free text
// between sections in this band, so it lines up with the sections.
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap"><div class="ah-body ah-rich ah-page-text"><slot /></div></div>
  </section>
</template>

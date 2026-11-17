<script setup lang="ts">
// Invitation to the Discord community. The invite link is set once, in content/site.yml.
defineProps<{
  /** Section title */
  title: string
  /** Button text */
  buttonLabel: string
}>()
const { data: site } = await useAsyncData('site', () => queryCollection('site').first())
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <h2 class="ah-head">{{ title }}</h2>
      <p v-if="$slots.default" class="ah-body"><slot mdc-unwrap="p" /></p>
      <p class="ah-buttons"><a class="ah-btn ah-btn-discord" :href="site?.discord">{{ buttonLabel }}</a></p>
    </div>
  </section>
</template>

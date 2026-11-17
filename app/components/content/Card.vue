<script setup lang="ts">
// One card, inside "cards". With a link, the whole card is clickable.
defineProps<{
  /** Card title */
  title: string
  /** Link (optional) */
  url?: string
}>()
</script>

<template>
  <div class="ah-card ah-small" :class="{ 'ah-link': url }">
    <h3><a v-if="url" :href="href(url)">{{ title }}</a><template v-else>{{ title }}</template></h3>
    <p v-if="$slots.default"><slot mdc-unwrap="p" /></p>
  </div>
</template>

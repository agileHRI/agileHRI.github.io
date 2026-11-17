<script setup lang="ts">
// Teal header band. In a page:  ::hero{title="…" tag="…" buttonLabel="…" buttonUrl="…"}  text  ::
defineProps<{
  /** Large title */
  title: string
  /** Small label above the title (optional) */
  tag?: string
  /** Button text (optional; needs a button link) */
  buttonLabel?: string
  /** Button link (optional) */
  buttonUrl?: string
}>()
</script>

<template>
  <section class="ah-hero ah-page-hero">
    <div class="ah-wrap">
      <p v-if="tag" class="ah-tag">{{ tag }}</p>
      <h1>{{ title }}</h1>
      <div v-if="$slots.default" class="ah-hero-sub"><slot mdc-unwrap="p" /></div>
      <p v-if="buttonLabel && buttonUrl" class="ah-buttons"><a class="ah-btn ah-btn-light" :href="href(buttonUrl)">{{ buttonLabel }}</a></p>
    </div>
  </section>
</template>

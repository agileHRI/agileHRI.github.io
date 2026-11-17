<script setup lang="ts">
// An image next to rich text.
defineProps<{
  /** Image (for example /images/robot.jpg) */
  image: string
  /** Description of the image, for people who can't see it */
  alt: string
  /** Section title (optional) */
  title?: string
  /** Which side the image goes on */
  imageSide?: 'left' | 'right'
}>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap ah-media" :class="{ 'ah-media-right': imageSide === 'right' }">
      <img :src="image" :alt="alt" loading="lazy">
      <div>
        <h2 v-if="title" class="ah-head">{{ title }}</h2>
        <div class="ah-body ah-rich"><slot /></div>
      </div>
    </div>
  </section>
</template>

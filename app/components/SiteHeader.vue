<script setup lang="ts">
defineProps<{ menu: { label: string; url: string }[] }>()
const isExternal = (url: string) => /^https?:\/\//.test(url)
</script>

<template>
  <header class="ah-nav">
    <NuxtLink to="/" class="ah-logo">AgileHRI <span>Ecosystem</span></NuxtLink>
    <nav class="ah-menu" aria-label="Main">
      <a v-for="item in menu" :key="item.url" :href="href(item.url)"
         :target="isExternal(item.url) ? '_blank' : undefined"
         :rel="isExternal(item.url) ? 'noopener' : undefined">{{ item.label }}</a>
    </nav>
  </header>
</template>

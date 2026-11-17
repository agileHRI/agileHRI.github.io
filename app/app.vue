<script setup lang="ts">
// Menu and footer come from content/site.yml.
const { data: site } = await useAsyncData('site', () => queryCollection('site').first())
useSeoMeta({ title: () => site.value?.title, description: () => site.value?.description })
</script>

<template>
  <div class="ah-page">
    <SiteHeader :menu="site?.menu ?? []" />
    <main class="ah-main"><NuxtPage /></main>
    <SiteFooter v-if="site" :footer="site.footer" />
  </div>
</template>

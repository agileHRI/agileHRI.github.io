<script setup lang="ts">
defineProps<{ s: { title?: string; cards: { title: string; text?: string; url?: string }[] } }>()
</script>

<template>
  <section class="ah-section">
    <div class="ah-wrap">
      <h2 v-if="s.title" class="ah-head">{{ s.title }}</h2>
      <div class="ah-grid">
        <div v-for="(card, i) in s.cards" :key="i" class="ah-card ah-small" :class="{ 'ah-link': card.url }">
          <h3><a v-if="card.url" :href="href(card.url)">{{ card.title }}</a><template v-else>{{ card.title }}</template></h3>
          <p v-if="card.text">{{ card.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

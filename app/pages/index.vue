<script setup lang="ts">
// The Home page: every text comes from content/home.yml.
const { data: home } = await useAsyncData('home', () => queryCollection('home').first())
</script>

<template>
  <div v-if="home">
    <section class="ah-hero">
      <div class="ah-wrap">
        <p class="ah-tag">{{ home.hero.tag }}</p>
        <h1 :class="{ 'is-subtitle': home.hero.titleStyle === 'subtitle' }">{{ home.hero.title }}</h1>
        <p class="ah-hero-sub">{{ home.hero.text }}</p>
        <p class="ah-buttons"><a class="ah-btn ah-btn-light" :href="home.hero.button.url">{{ home.hero.button.label }}</a></p>
      </div>
    </section>

    <section class="ah-cycle">
      <div class="ah-wrap">
        <p class="ah-tag">{{ home.cycle.tag }}</p>
        <ol class="ah-cycle-steps">
          <li v-for="(step, i) in home.cycle.steps" :key="i" class="ah-cycle-step">
            <span class="ah-num">{{ i + 1 }}</span>
            <span class="ah-step-label">{{ step.label }}</span>
            <span class="ah-step-sub">{{ step.text }}</span>
          </li>
          <li class="ah-cycle-step ah-loop">
            <span class="ah-num">↺</span>
            <span class="ah-step-label">{{ home.cycle.loop.label }}</span>
            <span class="ah-step-sub">{{ home.cycle.loop.text }}</span>
          </li>
        </ol>
        <p class="ah-cycle-note">↑ {{ home.cycle.note }} ↑</p>
      </div>
    </section>

    <section class="ah-stats">
      <div v-for="stat in home.stats" :key="stat.label" class="ah-stat">
        <p class="ah-stat-num">{{ stat.number }}</p>
        <p class="ah-stat-label">{{ stat.label }}</p>
      </div>
    </section>

    <section class="ah-section">
      <div class="ah-wrap">
        <h2 class="ah-section-title">{{ home.soon.title }}</h2>
        <p class="ah-section-sub">{{ home.soon.text }}</p>
        <div class="ah-grid">
          <div v-for="card in home.soon.cards" :key="card.url" class="ah-card ah-tool">
            <h3><a :href="card.url">{{ card.title }}</a></h3>
            <p>{{ card.text }}</p>
            <p><span class="ah-pill">{{ card.pill }}</span></p>
          </div>
        </div>
        <blockquote class="ah-quote">
          <p>{{ home.quote.text }}</p>
          <cite>— {{ home.quote.source }}</cite>
        </blockquote>
      </div>
    </section>
  </div>
</template>

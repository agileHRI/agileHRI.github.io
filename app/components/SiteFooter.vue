<script setup lang="ts">
defineProps<{ footer: {
  project: string; projectLink: { label: string; url: string }
  right: string; rightLink: { label: string; url: string }; funding: string
} }>()
</script>

<template>
  <footer class="ah-footer">
    <div class="ah-wrap">
      <div class="ah-footer-row">
        <p><strong>AgileHRI</strong> · <a :href="href(footer.projectLink.url)">{{ footer.projectLink.label }}</a> · {{ footer.project }}</p>
        <p class="ah-footer-right">{{ footer.right }} · <a :href="href(footer.rightLink.url)">{{ footer.rightLink.label }}</a></p>
      </div>
      <p class="ah-eu">{{ footer.funding }}</p>
    </div>
  </footer>
</template>

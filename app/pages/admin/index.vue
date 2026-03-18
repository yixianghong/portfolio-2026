<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

await navigateTo('/admin/posts', { replace: true })
</script>

<template>
  <div />
</template>

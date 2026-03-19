<script setup lang="ts">
import { marked } from 'marked'

const { fetchContact } = useContact()

const { data: content, pending } = useLazyAsyncData('contact', () => fetchContact(), {
  server: false
})

const html = computed(() => {
  if (!content.value) return ''
  return marked.parse(content.value) as string
})
</script>

<template>
  <UPageSection>
    <div class="flex items-end justify-between gap-4">
      <h1 class="text-2xl font-semibold tracking-tight">
        Contact Me
      </h1>
    </div>
    <div
      v-if="pending"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="!html"
      class="py-20 text-center text-muted"
    >
      尚未設定 Contact 頁面內容。
    </div>

    <div
      v-else
      class="prose dark:prose-invert max-w-none"
      v-html="html"
    />
  </UPageSection>
</template>

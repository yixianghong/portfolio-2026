<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const { fetchPost } = usePosts()

const { data: post, pending } = useLazyAsyncData(`blog-post-${route.params.id}`, () =>
  fetchPost(String(route.params.id)), {
  server: false
})

useSeoMeta({
  title: () => post.value?.title ? `${post.value.title} | Jason Hong` : 'Blog | Jason Hong',
  description: () => post.value?.excerpt ?? '技術文章與生活分享。',
  ogTitle: () => post.value?.title ? `${post.value.title} | Jason Hong` : 'Blog | Jason Hong',
  ogDescription: () => post.value?.excerpt ?? '技術文章與生活分享。'
})

const html = computed(() => {
  if (!post.value?.content) return ''
  return marked.parse(post.value.content) as string
})

function formatDate(ts: { toDate(): Date } | null | undefined) {
  if (!ts) return ''
  return ts.toDate().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <UPageSection>
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
      v-else-if="!post"
      class="py-20 text-center text-muted"
    >
      找不到此文章。
    </div>

    <article
      v-else
      class="mx-auto w-full"
    >
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ post.title }}
        </h1>
        <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span class="tabular-nums">{{ formatDate(post.createdAt) }}</span>
          <span v-if="post.tags.length">·</span>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in post.tags"
              :key="tag"
              color="primary"
              variant="subtle"
              class="font-normal"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </div>

      <div
        class="prose dark:prose-invert max-w-none"
        v-html="html"
      />

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <NuxtLink
          to="/blog"
          class="text-sm text-muted hover:text-primary transition-colors"
        >
          ← 回文章列表
        </NuxtLink>
      </div>
    </article>
  </UPageSection>
</template>

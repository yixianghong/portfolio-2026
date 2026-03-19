<script setup lang="ts">
import type { Post } from '~/composables/usePosts'

const posts = ref<Post[]>([])
const pending = ref(true)

onMounted(async () => {
  try {
    const { fetchPosts } = usePosts()
    posts.value = await fetchPosts()
  } finally {
    pending.value = false
  }
})

function formatDate(ts: { toDate(): Date } | null | undefined) {
  if (!ts) return ''
  return ts.toDate().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <UPageSection>
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">
          Blog
        </h1>
        <p class="mt-2 text-muted">
          技術文章與生活分享
        </p>
      </div>
    </div>

    <div
      v-if="pending"
      class="mt-10 flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="posts.length === 0"
      class="mt-10 py-20 text-center text-muted"
    >
      目前還沒有文章。
    </div>

    <div
      v-else
      class="mt-10 grid gap-6"
    >
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/blog/${post.id}`"
        class="block"
      >
        <UCard class="transition hover:-translate-y-0.5 hover:shadow-lg">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold tracking-tight">
                {{ post.title }}
              </h2>
              <p class="mt-1 text-sm text-muted line-clamp-2">
                {{ post.excerpt }}
              </p>
            </div>
            <span class="shrink-0 text-sm text-muted tabular-nums">
              {{ formatDate(post.createdAt) }}
            </span>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
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
        </UCard>
      </NuxtLink>
    </div>
  </UPageSection>
</template>

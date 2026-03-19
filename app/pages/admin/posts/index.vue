<script setup lang="ts">
import type { Post } from '~/composables/usePosts'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const posts = ref<Post[]>([])
const pending = ref(true)

async function refresh() {
  pending.value = true
  try {
    const { fetchPosts } = usePosts()
    posts.value = await fetchPosts(true)
  } finally {
    pending.value = false
  }
}

onMounted(() => refresh())

const deleting = ref<string | null>(null)

async function handleDelete(id: string) {
  if (!confirm('確定要刪除此文章嗎？')) return
  deleting.value = id
  try {
    const { deletePost } = usePosts()
    await deletePost(id)
    await refresh()
  } finally {
    deleting.value = null
  }
}

function formatDate(ts: { toDate(): Date } | null | undefined) {
  if (!ts) return '-'
  return ts.toDate().toLocaleDateString('zh-TW')
}
</script>

<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">
        文章管理
      </h1>
      <UButton
        to="/admin/posts/new"
        color="primary"
        icon="i-lucide-plus"
      >
        新增文章
      </UButton>
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
      v-else-if="posts.length === 0"
      class="py-20 text-center text-muted"
    >
      還沒有文章，點選右上角新增吧！
    </div>

    <UCard v-else>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-2 pr-4 font-medium text-muted">
              標題
            </th>
            <th class="text-left py-2 pr-4 font-medium text-muted">
              狀態
            </th>
            <th class="text-left py-2 pr-4 font-medium text-muted">
              建立時間
            </th>
            <th class="py-2 font-medium text-muted" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <td class="py-3 pr-4 font-medium">
              {{ post.title }}
            </td>
            <td class="py-3 pr-4">
              <UBadge
                :color="post.published ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
              >
                {{ post.published ? '已發布' : '草稿' }}
              </UBadge>
            </td>
            <td class="py-3 pr-4 text-muted tabular-nums">
              {{ formatDate(post.createdAt) }}
            </td>
            <td class="py-3 flex items-center justify-end gap-2">
              <UButton
                :to="`/admin/posts/${post.id}`"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-pencil"
              />
              <UButton
                color="error"
                variant="ghost"
                size="sm"
                icon="i-lucide-trash-2"
                :loading="deleting === post.id"
                @click="handleDelete(post.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </div>
</template>

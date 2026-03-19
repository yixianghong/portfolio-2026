<script setup lang="ts">
import type { Work } from '~/composables/useWorks'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const works = ref<Work[]>([])
const pending = ref(true)

async function refresh() {
  pending.value = true
  try {
    const { fetchWorks } = useWorks()
    works.value = await fetchWorks()
  } finally {
    pending.value = false
  }
}

onMounted(() => refresh())

const deleting = ref<string | null>(null)

async function handleDelete(id: string) {
  if (!confirm('確定要刪除此作品嗎？')) return
  deleting.value = id
  try {
    const { deleteWork } = useWorks()
    await deleteWork(id)
    await refresh()
  } finally {
    deleting.value = null
  }
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">
        作品管理
      </h1>
      <UButton
        to="/admin/works/new"
        color="primary"
        icon="i-lucide-plus"
      >
        新增作品
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
      v-else-if="works.length === 0"
      class="py-20 text-center text-muted"
    >
      還沒有作品，點選右上角新增吧！
    </div>

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <UCard
        v-for="work in works"
        :key="work.id"
      >
        <div class="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900/40 h-36 mb-4">
          <img
            v-if="work.imageUrl"
            :src="work.imageUrl"
            :alt="work.title"
            class="max-h-28 w-auto object-contain"
            loading="lazy"
          >
          <UIcon
            v-else
            name="i-lucide-image"
            class="size-8 text-muted"
          />
        </div>

        <h3 class="font-semibold">
          {{ work.title }}
        </h3>
        <p class="mt-1 text-sm text-muted line-clamp-2">
          {{ work.description }}
        </p>

        <div class="mt-4 flex gap-2 justify-end">
          <UButton
            :to="`/admin/works/${work.id}`"
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
            :loading="deleting === work.id"
            @click="handleDelete(work.id)"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
